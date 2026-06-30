---
title: Artifacts — Index
tier: 4
status: draft
last-reviewed: 2026-06-30
---

# Tier 4 — Artifacts

> **Le concret exécutable / copiable.** Ce qui démarre un vrai projet : boilerplates runnables,
> gabarits de documents, exemples réels. Les Artifacts **incarnent** Standards (Tier 1) et Patterns
> (Tier 3) — ils ne les redéfinissent pas.

## Catégories

| Dossier | Rôle | Test (1 question) |
|---------|------|-------------------|
| [`boilerplates/`](./boilerplates/) | Projets exécutables de démarrage | *Est-ce « clone et lance » ?* |
| [`templates/`](./templates/) | Gabarits de **documents** à remplir | *Est-ce un squelette de fichier à compléter ?* |
| [`examples/`](./examples/) | Preuves concrètes tirées d'un vrai projet | *Est-ce un extrait réel, daté ?* |

## Mapping avec l'existant (référence, pas copie)

- **Boilerplates de code** : le starter [`../templates/flostack-saas`](../templates/flostack-saas) vit
  déjà à la racine du dépôt (`/templates/`). `artifacts/boilerplates/` est le **catalogue** qui pointe
  vers lui — on ne le déplace pas (la gouvernance et les références existantes en dépendent).
- **Gabarits de documents** : l'ADR a son gabarit dans [`../knowledge/adr/TEMPLATE.md`](../knowledge/adr/TEMPLATE.md).
- **Examples** : extraits **assainis** issus de projets réels (ex. Garage Mendonça, *externe*) — jamais
  de secret ni de données réelles.

## Voir aussi
- Patterns incarnés : [`../knowledge/patterns/`](../knowledge/patterns/)
- Standards incarnés : [`../standards/INDEX.md`](../standards/INDEX.md)
- Promotion via le [flywheel](../knowledge/flywheel.md).
