---
title: Standards — Index
tier: 1
status: draft
last-reviewed: 2026-06-30
---

# Tier 1 — Standards

> **Les lois normatives du Flo OS.** Un Standard est une exigence **universelle, mesurable,
> vérifiable** (« DOIT / NE DOIT PAS »), vraie pour **tous** les projets. Les Skills (Tier 2)
> l'**appliquent** côté agent ; les Checklists (Tier 3) le **vérifient** ; les Artifacts (Tier 4)
> l'**incarnent**.

## Rôle de cette couche

- Rendre **explicites** les exigences aujourd'hui **dissoutes dans les « règles strictes » des skills**.
- Mesurer la conformité (modèle existant : [`../docs/scorecard.md`](../docs/scorecard.md), 10 dimensions).
- Servir de spécification **indépendante de l'agent**, réutilisable par tous les boilerplates.

## Règle anti-duplication (stricte)

> Un Standard **référence** la source qui porte déjà la règle — il ne la **recopie pas**. Tant qu'une
> exigence vit dans un `SKILL.md`, ce tableau **pointe** vers elle (`statut : implicite`). On ne crée un
> fichier de Standard dédié que lorsqu'on l'**extrait** réellement (passage par le
> [flywheel](../knowledge/flywheel.md)).

## Carte des standards (référence → source actuelle)

| Standard | Famille | Défini aujourd'hui dans | Statut |
|----------|---------|--------------------------|--------|
| Qualité de code | socle | [`../skills/flo-dev-standards/SKILL.md`](../skills/flo-dev-standards/SKILL.md) | implicite (dans le skill) |
| Sécurité du code | socle | `../skills/flo-dev-standards/SKILL.md` | implicite |
| Architecture | socle | `../skills/flo-dev-standards/SKILL.md` + [`../docs/architecture/`](../docs/architecture/) | à expliciter |
| Sécurité d'accès / données (RLS, secrets) | données | [`../skills/flo-supabase/SKILL.md`](../skills/flo-supabase/SKILL.md) | implicite |
| Supabase / Edge Functions | stack | `../skills/flo-supabase/SKILL.md` | implicite |
| Next.js (App Router, rendu) | stack | [`../skills/flo-nextjs/SKILL.md`](../skills/flo-nextjs/SKILL.md) | implicite |
| Offline / synchronisation | stack | [`../skills/flo-offline/SKILL.md`](../skills/flo-offline/SKILL.md) | implicite |
| UX / conception | expérience | [`../skills/frontend-design/SKILL.md`](../skills/frontend-design/SKILL.md) | à expliciter |
| UI / design system / a11y | expérience | [`../skills/flo-ui/SKILL.md`](../skills/flo-ui/SKILL.md) | implicite |
| Qualité perçue (anti-« IA ») | expérience | [`../skills/design-taste/SKILL.md`](../skills/design-taste/SKILL.md) | à expliciter |
| SEO | expérience | [`../skills/flo-seo/SKILL.md`](../skills/flo-seo/SKILL.md) | implicite |
| Performance | transverse | nextjs / seo / [`../skills/flo-debug/SKILL.md`](../skills/flo-debug/SKILL.md) | à expliciter |
| Conformité santé | domaine | [`../skills/flo-medical/SKILL.md`](../skills/flo-medical/SKILL.md) | implicite |
| Audit / scoring | cycle | [`../skills/flo-project-audit/SKILL.md`](../skills/flo-project-audit/SKILL.md) + `../docs/scorecard.md` | **modèle de référence** |
| Livraison / Git | cycle | [`../CONTRIBUTING.md`](../CONTRIBUTING.md) + [`../docs/git-workflow.md`](../docs/git-workflow.md) | ✅ explicite |
| Documentation | cycle | — | gap → à créer |
| Maintenance | cycle | `../skills/flo-debug/SKILL.md` (partiel) | gap → à créer |
| Observabilité | transverse | — | gap → à créer |
| Design d'API | stack | — | gap (seul vrai candidat *skill* : `flo-api-design`) |

> Légende — **implicite** : la règle existe dans un skill, à exposer en Standard plus tard ;
> **à expliciter** : exigence diffuse à formaliser ; **gap** : exigence absente ;
> **✅ explicite** : déjà un document normatif autonome.

## Voir aussi
- Frontières & hiérarchie d'autorité : [`../docs/skill-boundaries.md`](../docs/skill-boundaries.md)
- Mécanique de promotion : [`../knowledge/flywheel.md`](../knowledge/flywheel.md)
- Constitution : [`../manifesto/FLO_MANIFESTO.md`](../manifesto/FLO_MANIFESTO.md)
