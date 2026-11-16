# Changelog — flo-dev-standards

## 2.2.0 — 2026-11-13
- Ajout (additif, `project-conventions`/`code-review`) : validation performance obligatoire avant livraison — inventaire des appels réseau par parcours critique, détection des requêtes redondantes et cascades, comparaison systématique avant/après, vérification des régressions fonctionnelles/visuelles/sécurité, distinction mesure locale / simulation / production. Jamais un build réussi ne vaut preuve de performance.
- Checklist réutilisable en 7 étapes, applicable à tout projet.
- Exemple chiffré anonymisé (Garage Mendonça, mesures locales simulées) : 153 → 32 appels Supabase sur le même scénario, illustrant la méthode sans en faire un objectif universel.

## 2.1.0 — 2026-08-13
- Ajout (additif, `project-conventions`) : convention analytics par défaut — Umami recommandé pour un nouveau site Next.js, GA4 conservé comme option complémentaire (Google Ads, écosystème Google, besoins marketing avancés, demande client, reporting déjà instrumenté). Jamais présenté comme un remplacement obligatoire.
- Précise que la stratégie UTM (`utm_source/medium/campaign/content/term`) est indépendante du provider d'analytics.
- Précise l'absence de migration automatique pour les projets existants sous GA4.
- Précise l'absence d'affirmation juridique absolue sur le consentement — évaluation au cas par cas selon hébergement, données collectées, configuration et contexte du projet.

## 1.0.0 — 2026-06-17
- Première version versionnée.
- *When NOT To Invoke* clarifié : diagnostic runtime/stack trace → `flo-debug` (ici = *pattern* d'erreur) ; audit projet/orchestration → `flo-project-audit`.
- Responsabilités : typescript-strict, code-architecture, folder-structure, error-handling, refactoring, project-conventions, code-security, code-review, unit-testing.
