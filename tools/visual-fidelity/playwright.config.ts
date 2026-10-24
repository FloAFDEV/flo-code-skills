// Kit de fidélité visuelle : compare le rendu d'une app à une référence (prototype Lovable,
// build précédent…) par captures pleine page, à plusieurs viewports.
//
// Deux passes, même config, URL différente :
//   1. référence : FIDELITY_URL=<url-ref>    npx playwright test -c <ce-dossier> --update-snapshots=all
//   2. cible     : FIDELITY_URL=<url-cible>  npx playwright test -c <ce-dossier>
//
// FIDELITY_MASK doit être identique dans les deux passes (le masque est peint dans la capture).
// Variables : FIDELITY_URL (requis), FIDELITY_ROUTES ("/,/contact"), FIDELITY_MASK (sélecteurs CSS
// séparés par des virgules, contenu dynamique), FIDELITY_MAX_DIFF_PIXELS (défaut 100 : bruit
// d'anticrénelage toléré, un élément entier ne l'est pas).
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.FIDELITY_URL;
if (!baseURL) throw new Error("FIDELITY_URL est requis (ex. http://localhost:3000)");

export default defineConfig({
  testDir: ".",
  // Chemin sans suffixe plateforme : les captures de la référence servent de baseline à la cible.
  snapshotPathTemplate: "{testDir}/__reference__/{projectName}/{arg}{ext}",
  outputDir: "./test-results",
  reporter: [["list"], ["html", { outputFolder: "./report", open: "never" }]],
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
