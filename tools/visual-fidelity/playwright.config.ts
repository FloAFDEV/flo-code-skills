// Kit de fidélité visuelle : compare le rendu d'une app à une référence EXÉCUTABLE (prototype
// Lovable, site existant, build antérieur) par captures pleine page, à plusieurs viewports.
// Modes REPRODUCTION et ADAPTATION uniquement ; en CRÉATION il n'existe pas de référence à mesurer.
//
// Deux passes, même config, URL différente :
//   1. référence : FIDELITY_MODE=reproduction|adaptation FIDELITY_REFERENCE="<source>" \
//                  FIDELITY_URL=<url-ref> npx playwright test -c <ce-dossier> --update-snapshots=all
//   2. cible     : FIDELITY_URL=<url-cible> npx playwright test -c <ce-dossier>
//                  (mode et source sont relus depuis __reference__/source.json)
//
// FIDELITY_MASK doit être identique dans les deux passes (le masque est peint dans la capture).
// Variables : FIDELITY_URL (requis), FIDELITY_ROUTES ("/,/contact"), FIDELITY_MASK (sélecteurs CSS
// séparés par des virgules, contenu dynamique), FIDELITY_MAX_DIFF_PIXELS (défaut 100 : bruit
// d'anticrénelage toléré, un élément entier ne l'est pas).
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.FIDELITY_URL;
if (!baseURL) throw new Error("FIDELITY_URL est requis (ex. http://localhost:3000)");
if (process.env.FIDELITY_MODE?.toLowerCase() === "creation") {
  throw new Error("Mode CRÉATION : aucune référence à comparer, ce kit ne s'applique pas.");
}

export default defineConfig({
  testDir: ".",
  // Chemin sans suffixe plateforme : les captures de la référence servent de baseline à la cible.
  snapshotPathTemplate: "{testDir}/__reference__/{projectName}/{arg}{ext}",
  outputDir: "./test-results",
  reporter: [["list"], ["html", { outputFolder: "./report", open: "never" }]],
  // Jamais de baseline créée implicitement : seule la passe référence (--update-snapshots=all) en écrit.
  updateSnapshots: "none",
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL,
    // Chromium seul : le rendu des polices varie entre moteurs, la comparaison doit être stable.
    ...devices["Desktop Chrome"],
    locale: "fr-FR",
    timezoneId: "Europe/Paris",
  },
  projects: [
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: "tablet", use: { viewport: { width: 768, height: 1024 } } },
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
  ],
});
