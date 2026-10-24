import { expect, test, type Page } from "@playwright/test";

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

for (const route of routes) {
  test(`fidélité ${route}`, async ({ page }) => {
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
