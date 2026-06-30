---
title: Skills — Index
tier: 2
status: stable
last-reviewed: 2026-06-30
---

# Tier 2 — Skills (runtime agent)

> **Le comportement de l'agent.** Un Skill est **impératif** (« quand X, fais Y »), **chargé en
> contexte** par Claude Code, et possède des responsabilités **disjointes** (`owns`) vérifiées en CI.
> Il **applique** les Standards (Tier 1) — il ne les redéfinit pas.
>
> ℹ️ Ce fichier est un **index**, pas un skill (aucun `SKILL.md`) : `tools/check-overlaps.ts` n'itère
> que sur les **sous-dossiers** contenant un `SKILL.md`, il l'ignore donc — la distribution
> (`skills-sync.sh`) n'est pas affectée.

## Les 12 skills (carte de navigation)

| Skill | Phase | Autorité | Rôle | Source |
|-------|-------|----------|------|--------|
| flo-project-audit | méta | hors échelle | orchestre l'audit, sélectionne les skills (ne juge pas) | [SKILL](./flo-project-audit/SKILL.md) |
| flo-debug | transverse | hors échelle | diagnostic runtime, défère le correctif au propriétaire | [SKILL](./flo-debug/SKILL.md) |
| flo-dev-standards | socle | 3 | qualité de code, archi, erreurs, sécurité code, tests unitaires | [SKILL](./flo-dev-standards/SKILL.md) |
| flo-medical | contrainte | 1 (max) | données santé, conformité RGPD/HDS | [SKILL](./flo-medical/SKILL.md) |
| flo-supabase | build | 2 | RLS, Edge, auth, accès données | [SKILL](./flo-supabase/SKILL.md) |
| flo-nextjs | build | 4 | App Router, rendu, Server Actions, perf Next | [SKILL](./flo-nextjs/SKILL.md) |
| flo-offline | build | 5 | IndexedDB, Dexie, synchro offline-first | [SKILL](./flo-offline/SKILL.md) |
| frontend-design | plan | 6 | UX, IA, parcours, structure d'écran | [SKILL](./frontend-design/SKILL.md) |
| flo-ui | build | 7 | composants, Tailwind, a11y, tokens, animations | [SKILL](./flo-ui/SKILL.md) |
| flo-seo | build | 8 | metadata, OG, JSON-LD, sitemap, robots | [SKILL](./flo-seo/SKILL.md) |
| design-taste | audit | 9 | critique visuelle, détection « rendu IA » | [SKILL](./design-taste/SKILL.md) |
| playwright | audit | 10 | E2E, smoke, régressions, captures | [SKILL](./playwright/SKILL.md) |

> Hiérarchie d'autorité complète, matrice des responsabilités et règles d'arbitrage :
> [`../docs/skill-boundaries.md`](../docs/skill-boundaries.md) (source de vérité, vérifiée par CI).

## Quand créer un nouveau skill (anti-prolifération)

Un nouveau skill est justifié **uniquement** s'il **change un comportement runtime** avec une
responsabilité **non déjà possédée**. Au moindre doute « skill ou autre tier ? » → **ce n'est pas un
skill** (→ Standard, Knowledge ou Artifact). Seul candidat identifié à ce jour : `flo-api-design`.

Procédure d'ajout : voir le README du dépôt et `../docs/skill-boundaries.md` (§ « Ajouter un skill »).

## Voir aussi
- Standards appliqués : [`../standards/INDEX.md`](../standards/INDEX.md)
- Versioning des skills : [`../docs/VERSIONING.md`](../docs/VERSIONING.md)
- Constitution : [`../manifesto/FLO_MANIFESTO.md`](../manifesto/FLO_MANIFESTO.md)
