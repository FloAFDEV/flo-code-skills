# Changelog global — flo-code-skills

Format inspiré de [Keep a Changelog](https://keepachangelog.com). Versionnement par skill
(SemVer, voir `docs/VERSIONING.md`). Ce fichier agrège les évolutions ; chaque skill tient
aussi son propre `skills/<skill>/CHANGELOG.md`.

## [Workflow visuel — reproduction, adaptation, création] — 2026-10-24

### Added
- Modes REPRODUCTION / ADAPTATION / CRÉATION et priorité des décisions visuelles (contraintes du projet > référence > conventions > recommandations animation > goût générique) dans `docs/skill-boundaries.md`.
- `tools/visual-fidelity/` — kit `@playwright/test` de comparaison référence exécutable ↔ cible (3 viewports, seuil en pixels absolus, masques) ; mode et source obligatoires, refus en CRÉATION et sans baseline.
- `docs/visual-workflow.md` — choix du mode selon la référence disponible, installation épinglée (Playwright MCP, 3 skills Emil Kowalski, Figma conditionnel), boucle de validation, consigne réutilisable.
- ADR 0002 — évaluation des outils design tiers : Playwright MCP et Emil (sélection) retenus, Figma conditionnel, Impeccable différé, Taste écarté.

### Changed
- **flo-ui** 2.0.0 → 2.1.0 — tokens selon le mode : identiques en REPRODUCTION, traduits en ADAPTATION, issus du brief en CRÉATION ; l'a11y prime sur la référence.
- **design-taste** 2.0.0 → 2.1.0 — audit annoncé avec son mode : écart à la référence en REPRODUCTION, cohérence en ADAPTATION, direction artistique en CRÉATION.
- **frontend-design** 2.0.0 → 2.1.0 — structure selon le mode : reprise de la référence en REPRODUCTION, point de départ en ADAPTATION, conçue en CRÉATION.
- **playwright** 2.0.0 → 2.1.0 — mesure selon le mode et le type de référence ; jamais de baseline fabriquée ; MCP = exploration, pas substitut aux tests.

Aucun nouveau skill, aucun nouveau token `owns`. Quatre bumps MINOR additifs.

## [Analytics — Umami par défaut] — 2026-08-13

### Changed
- **flo-dev-standards** 2.0.0 → 2.1.0 — nouvelle convention `project-conventions` : Umami recommandé par défaut pour l'analytics web d'un nouveau site Next.js, GA4 conservé comme option complémentaire lorsqu'un besoin réel le justifie (jamais retiré, jamais présenté comme obligatoire dans un sens ou l'autre). UTM indépendantes du provider. Pas de migration automatique des projets existants. Pas d'affirmation absolue sur le consentement.
- **flo-nextjs** 2.0.0 → 2.1.0 — principes d'intégration technique Umami en App Router (`next/script`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, activation production). Mécanique uniquement ; la politique reste dans `flo-dev-standards`.
- **flo-seo** 2.0.0 → 2.1.0 — clarification de frontière Search Console (SEO/indexation) vs analytics web (Umami/GA4) ; pointeur vers `flo-dev-standards`, aucune duplication de la convention.

Aucun nouveau token `owns`, aucun skill créé (`flo-analytics` explicitement écarté). Trois bumps MINOR, additifs, non cassants.

## [Phase 2] — 2026-06-17

### Added
- **flo-project-audit** v1.0.0 — orchestrateur : audit projet, sélection/séquencement des skills, scorecard, feuille de route priorisée (aucune règle métier).
- **flo-debug** v1.0.0 — diagnostic d'erreurs, stack traces, bugs React/Next/Supabase/Dexie, diagnostic de performance (défère le correctif au propriétaire).
- **Versionnement** : champ `version` dans chaque `SKILL.md`, ce changelog global, un changelog par skill, et `docs/VERSIONING.md` (procédure d'évolution non cassante).
- **Scorecard** : `docs/scorecard.md` — 10 dimensions notées, chaque skill contribue à une part.
- **Audit Phase 2** : `docs/AUDIT-PHASE2.md` — responsabilités trop larges/vagues, règles à risque, contradictions latentes, et corrections appliquées.
- `tools/check-overlaps.ts` valide désormais la présence et le format SemVer du champ `version`.

### Changed
- `flo-dev-standards` 1.0.0 — *When NOT To Invoke* clarifié : diagnostic runtime → `flo-debug`, audit projet → `flo-project-audit` (frontière *pattern d'erreur* vs *diagnostic*).
- `flo-nextjs` 1.0.0 — *When NOT To Invoke* : diagnostic bug/perf runtime → `flo-debug` (vs *construire* du Next performant).
- `flo-medical` 1.0.0 — règle « traiter comme sensible en cas de doute » bornée au **contexte santé** (évite un comportement trop conservateur hors domaine).

## [Phase 1] — 2026-06-16

### Added
- Système initial : 10 skills (`flo-dev-standards`, `flo-medical`, `flo-nextjs`, `flo-supabase`, `flo-offline`, `flo-seo`, `frontend-design`, `flo-ui`, `design-taste`, `playwright`).
- Frontmatter `owns`/`excludes`, sections *When To / When NOT To Invoke*.
- `tools/check-overlaps.ts` + GitHub Action, `docs/skill-boundaries.md`, `README`, `ARCHITECTURE`.
