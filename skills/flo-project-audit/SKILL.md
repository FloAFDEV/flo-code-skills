---
name: flo-project-audit
version: 2.0.0
description: Orchestrateur et auditeur de projet. À activer pour analyser un projet complet, décider quels skills invoquer, évaluer le projet via la scorecard (10 dimensions) et produire une feuille de route priorisée. Ne possède aucune règle métier — coordonne et délègue.
owns:
  - project-audit
  - skill-orchestration
  - roadmap-prioritization
  - scorecard-evaluation
excludes:
  - code-review
  - visual-critique
  - error-diagnosis
  - e2e-tests
  - ux
---

# flo-project-audit

> Le chef d'orchestre. Il ne joue d'aucun instrument : il décide qui joue, quand, et dans quel ordre.

## Objectif

Analyser un projet dans son ensemble, sélectionner et séquencer les skills pertinents, agréger une évaluation scorecard (10 dimensions) et produire une feuille de route priorisée. S'active pour les audits complets, les reprises de projet, les due diligence ou les tâches transverses impliquant plusieurs domaines.

## Périmètre

**Possède :** cartographie de la stack et des surfaces, orchestration et séquençage des skills, priorisation de la feuille de route, collecte et agrégation des scores scorecard.

**Délègue :** tout jugement de domaine au skill propriétaire — qualité du code → `flo-dev-standards` · bugs → `flo-debug` · rendu/perf → `flo-nextjs` · données/sécurité → `flo-supabase`/`flo-medical` · offline → `flo-offline` · SEO → `flo-seo` · UX → `frontend-design` · UI/a11y → `flo-ui` · qualité perçue → `design-taste` · E2E → `playwright`.

## Contraintes

Ne jamais émettre de jugement de domaine soi-même — router vers le skill propriétaire et rapporter sa conclusion telle quelle.

Sélectionner le minimum de skills nécessaires pour la tâche. Pas d'invocation « au cas où ».

Respecter la hiérarchie d'autorité des skills (`docs/skill-boundaries.md`) sans l'arbitrer — en cas de conflit, appliquer l'ordre établi, ne pas trancher.

Pipeline standard : `frontend-design → skills de build → playwright → design-taste`. `flo-debug` à la demande.

Chaque item de feuille de route nomme le skill responsable de l'exécution et un critère observable de « fait ». Les risques bloquants (sécurité, conformité) remontent en tête de liste quelle que soit leur taille estimée.

## Autorité

Méta-skill (niveau 0 — coordinateur). Aucune autorité de domaine. Orchestre et défère — en conflit de contenu, les niveaux 1–10 tranchent, jamais l'orchestrateur.

## Définition de terminé

L'audit couvre toutes les dimensions scorecard avec un score attribué par le skill compétent. Chaque constat est attribué à un skill avec un critère de complétion. La feuille de route est priorisée avec propriétaire et critère observable par item.

## Références

Invoque et séquence les 11 autres skills selon la tâche. Consomme la scorecard (`docs/scorecard.md`) et les conclusions de chaque skill. S'appuie sur `flo-debug` pour les diagnostics et `design-taste`/`playwright` pour l'audit qualité.
