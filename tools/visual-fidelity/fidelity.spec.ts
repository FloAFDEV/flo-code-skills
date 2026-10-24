import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

type ReferenceSource = { mode: "reproduction" | "adaptation"; reference: string; url: string };

const routes = (process.env.FIDELITY_ROUTES ?? "/")
  .split(",")
  .map((route) => route.trim())
  .filter(Boolean);

const maskSelectors = (process.env.FIDELITY_MASK ?? "")
  .split(",")
  .map((selector) => selector.trim())
  .filter(Boolean);

// Seuil absolu, pas un ratio : sur une page longue, 1 % masquerait un CTA entier.
const maxDiffPixels = Number(process.env.FIDELITY_MAX_DIFF_PIXELS ?? "100");

// Écrit par la passe référence, exigé par la passe cible : le mode et la source voyagent avec la
// baseline, et une comparaison sans baseline de référence échoue au lieu d'en fabriquer une.
function resolveSource(testFile: string, capturing: boolean, url: string): ReferenceSource {
  const sourceFile = path.join(path.dirname(testFile), "__reference__", "source.json");
  if (capturing) {
    const mode = process.env.FIDELITY_MODE?.toLowerCase();
    const reference = process.env.FIDELITY_REFERENCE?.trim();
    if (mode !== "reproduction" && mode !== "adaptation") {
      throw new Error("Passe référence : FIDELITY_MODE=reproduction|adaptation est requis.");
    }
    if (!reference) {
      throw new Error('Passe référence : FIDELITY_REFERENCE est requis (ex. "prototype Lovable").');
    }
    const source: ReferenceSource = { mode, reference, url };
    mkdirSync(path.dirname(sourceFile), { recursive: true });
    writeFileSync(sourceFile, JSON.stringify(source, null, 2));
    return source;
  }
  if (!existsSync(sourceFile)) {
    throw new Error("Aucune baseline de référence : lancer d'abord la passe référence (--update-snapshots=all).");
  }
  return JSON.parse(readFileSync(sourceFile, "utf8")) as ReferenceSource;
}

function snapshotName(route: string): string {
  const slug = route.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/gi, "-");
  return `${slug || "home"}.png`;
}

// Parcourt la page pour déclencher lazy-loading et animations « reveal on scroll »,
// puis revient en haut : la capture reflète l'état final visible par un visiteur.
async function settle(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    await document.fonts.ready;
    const step = window.innerHeight;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
}

let source: ReferenceSource;
let capturing = false;

test.beforeAll(({}, testInfo) => {
  capturing = testInfo.config.updateSnapshots === "all";
  source = resolveSource(testInfo.file, capturing, process.env.FIDELITY_URL ?? "");
});

for (const route of routes) {
  test(`fidélité ${route}`, async ({ page, baseURL }) => {
    test.info().annotations.push(
      { type: "mode", description: source.mode.toUpperCase() },
      { type: "référence", description: `${source.reference} — ${source.url}` },
      { type: "passe", description: capturing ? "capture de la référence" : `comparaison de ${baseURL}` },
    );
    if (!capturing && source.url === baseURL) {
      test.info().annotations.push({
        type: "avertissement",
        description: "cible et référence ont la même URL : vérifier que la baseline vient bien de la référence",
      });
    }

    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    const response = await page.goto(route);
    expect(response?.status(), `statut HTTP de ${route}`).toBeLessThan(400);
    await settle(page);

    // toHaveScreenshot attend deux captures identiques consécutives : les animations JS se stabilisent.
    await expect(page).toHaveScreenshot(snapshotName(route), {
      fullPage: true,
      animations: "disabled",
      caret: "hide",
      mask: maskSelectors.map((selector) => page.locator(selector)),
      maxDiffPixels,
    });

    // Rapporté, pas bloquant : la référence peut elle-même émettre des erreurs console.
    test.info().annotations.push({
      type: "console-errors",
      description: consoleErrors.length ? consoleErrors.join(" | ") : "aucune",
    });
  });
}
