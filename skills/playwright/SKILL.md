---
name: playwright
description: Validation fonctionnelle automatisée niveau production SaaS avec Playwright. À activer pour tests E2E, smoke tests, parcours critiques, régressions UI, captures d'écran, responsive, accessibilité de base, vérification des erreurs console et du réseau. Étape avant validation finale d'une feature (Code → verify → playwright → design-taste → validation). Skill doctrinal : il ne juge pas l'esthétique (→ design-taste).
owns:
  - e2e-tests
  - smoke-tests
  - critical-journey-validation
  - ui-regression
  - test-screenshots
  - responsive-testing
  - basic-a11y-testing
  - console-error-checks
  - network-checks
excludes:
  - perceived-quality-audit
  - ai-artifact-detection
  - unit-testing
  - user-flows
---

# playwright

> Phase AUDIT (fonctionnel). Prouver que les parcours marchent, et qu'ils continuent de marcher.
> Il **produit** les vérifications et les captures ; `design-taste` en **juge** la qualité visuelle.

## ▶️ When To Invoke
- **Avant la validation finale** d'une feature (étape `playwright` du pipeline).
- Écrire/organiser des **tests E2E**, **smoke tests**, valider un **parcours critique**.
- Mettre en place une **régression UI** (snapshots) ou des tests **responsive**.
- Vérifier **a11y de base**, **erreurs console**, **appels réseau** sur un parcours.

## ⏹️ When NOT To Invoke
- Juger si l'UI est « belle » / « template » / « IA » → `design-taste`.
- Tests **unitaires** / logique pure → `flo-dev-standards`.
- *Définir* les parcours (ici on les **exécute**) → `frontend-design`.

## 🎯 Scope (responsabilités)
- **Tests E2E** et **smoke tests** sur l'app réelle.
- **Validation des parcours critiques** (auth, action métier centrale, paiement…).
- **Régression UI** par snapshots ciblés.
- **Captures d'écran** (matériau d'audit pour `design-taste`).
- **Responsive** (viewports clés), **a11y de base** automatisable.
- **Vérification des erreurs console** et des **appels réseau** (statuts, échecs).

## 🚫 Hors-scope (délégué)
- **Jugement esthétique** des captures → `design-taste`.
- **Tests unitaires / logique pure** → `flo-dev-standards`.
- **Définition des parcours** → `frontend-design`.
- **Données réelles dans les fixtures** → interdit par `flo-medical` (fixtures anonymisées).

## ✅ Règles strictes

### Couverture
1. **Parcours critiques d'abord**, pas l'exhaustif cosmétique.
2. **Smoke test** rapide sur chaque déploiement : l'app démarre, les routes clés répondent, pas d'erreur fatale.
3. Chaque test = **un scénario utilisateur** avec un résultat observable.
4. Couvrir les **états** prévus par `frontend-design` : succès, vide, erreur, cas limites.

### Robustesse
5. **Sélecteurs résilients** : `getByRole`/`getByLabel`/`data-testid` — jamais de sélecteur lié au style (classes Tailwind, ordre DOM).
6. **Attentes explicites** (auto-waiting / `expect`), **jamais de `waitForTimeout` arbitraire**.
7. Tests **isolés et idempotents** : état créé/nettoyé par le test, indépendants de l'ordre, rejouables.
8. **Données anonymisées** (exigence `flo-medical`) ; secrets via env.

### Régression UI, responsive & santé runtime
9. Snapshots visuels **déterministes** (masquer dates/données dynamiques) ; nommés et rangés pour `design-taste`.
10. Tester les **viewports clés** (mobile / tablette / desktop) sur les écrans à risque.
11. **A11y de base** : présence des rôles/labels, navigation clavier sur les parcours critiques.
12. **Erreurs console** : aucun `error`/`warning` inattendu pendant un parcours → échec.
13. **Réseau** : vérifier statuts attendus, absence de 4xx/5xx non gérés, pas d'appel manquant/dupliqué.

### CI
14. Suite **intégrable en CI**, rapide et fiable ; échec **actionnable** (trace, screenshot, vidéo).
15. Position dans le pipeline : `Code → verify → playwright → design-taste → validation finale`.

## ⛔ Anti-règles (jamais)
- ❌ Jamais juger si une UI est « belle » ou « template » (→ `design-taste`).
- ❌ Jamais de `waitForTimeout` fixe ni de sélecteur fragile basé sur le style.
- ❌ Jamais de vraie donnée patient/PII dans les fixtures ou les captures (→ `flo-medical`).
- ❌ Jamais de test dépendant de l'ordre d'exécution.
- ❌ Jamais remplacer les tests unitaires : Playwright couvre l'E2E.

## 🥇 Priorité
Niveau **10**. Skill de **validation** : il **rapporte** des faits (passe/échoue, régression) et ne dicte ni le design ni l'architecture. Un échec signale un problème ; la correction revient au skill propriétaire du domaine.

## 🔗 Interactions
- **Exécute** les parcours définis par `frontend-design`.
- **Produit** les captures consommées par `design-taste`.
- **Valide** l'implémentation de `flo-ui`/`flo-nextjs`/`flo-supabase`.
- **Obéit** à `flo-medical` (fixtures anonymisées) ; **applique** `flo-dev-standards`.
