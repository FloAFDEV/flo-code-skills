---
name: playwright
version: 2.0.0
description: Validation fonctionnelle automatisée avec Playwright. À activer pour tests E2E, smoke tests, parcours critiques, régressions UI, captures d'écran, responsive, accessibilité de base et vérification des erreurs console/réseau. Étape ante-validation dans le pipeline — produit des faits, ne juge pas l'esthétique.
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

## Objectif

Valider automatiquement que les parcours critiques fonctionnent sur l'app réelle et détecter les régressions. S'active avant la validation finale d'une feature, pour écrire des tests E2E, mettre en place une régression visuelle, ou vérifier la santé runtime d'un parcours (console, réseau, a11y de base).

## Périmètre

**Possède :** tests E2E et smoke tests, validation des parcours critiques, régression UI par snapshots, captures d'écran (matériau pour `design-taste`), tests responsive (viewports clés), a11y de base automatisable, vérification des erreurs console et des appels réseau.

**Délègue :** jugement esthétique des captures → `design-taste` · tests unitaires et logique pure → `flo-dev-standards` · définition des parcours à couvrir → `frontend-design`.

## Contraintes

**Priorité :** parcours critiques d'abord (auth, action métier centrale, paiement). Smoke test minimal sur chaque déploiement. Pas de couverture exhaustive des cas cosmétiques.

**Sélecteurs :** `getByRole`, `getByLabel`, `data-testid` uniquement. Jamais de sélecteur basé sur les classes CSS, l'ordre DOM ou la structure du markup — ils cassent à chaque refactor visuel.

**Attentes :** auto-waiting et `expect` Playwright uniquement. Jamais de `waitForTimeout` fixe — c'est un test flaky en attente d'exploser.

**Isolation :** chaque test crée et nettoie son propre état. Indépendant de l'ordre d'exécution. Rejouable à l'infini.

**Données :** anonymisées (exigence de `flo-medical`) — jamais de vraie donnée patient dans les fixtures ou captures. Secrets via variables d'environnement.

**Santé runtime :** une erreur `console.error` inattendue pendant un parcours fait échouer le test. Vérifier les statuts réseau attendus et l'absence de 4xx/5xx non gérés.

## Autorité

Niveau 10 — validation. Rapporte des faits (passe/échoue, régression) sans dicter le design ni l'architecture. Un échec signale un problème ; la correction revient au skill propriétaire du domaine.

## Définition de terminé

Les parcours critiques passent. Aucune régression sur les snapshots existants. Aucune erreur console inattendue pendant les parcours. La suite est intégrée en CI avec des échecs actionnables (trace, screenshot, vidéo).

## Références

Exécute les parcours définis par `frontend-design`. Produit les captures consommées par `design-taste`. Valide l'implémentation de `flo-ui`, `flo-nextjs`, `flo-supabase`. Obéit à `flo-medical` (données anonymisées). Applique `flo-dev-standards`. Position dans le pipeline : `Code → verify → playwright → design-taste → validation finale`.
