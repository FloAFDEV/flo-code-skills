---
title: Knowledge — Index
tier: 3
status: draft
last-reviewed: 2026-06-30
---

# Tier 3 — Knowledge

> **La jurisprudence et le savoir réutilisable.** Non impératif : on **consulte** la Knowledge à la
> demande (elle n'est pas chargée en permanence comme un Skill). Elle **explique**, **catalogue** et
> **mémorise**. Elle référence les Standards/Skills — elle ne les recopie jamais.

## Catégories

| Dossier | Rôle | Test (1 question) |
|---------|------|-------------------|
| [`patterns/`](./patterns/) | Solutions réutilisables éprouvées | *Est-ce une solution « voici comment faire » ?* |
| [`anti-patterns/`](./anti-patterns/) | Pièges récurrents à proscrire (miroir des patterns) | *Est-ce un piège « jamais ainsi, car… » ?* |
| [`playbooks/`](./playbooks/) | Procédures pas-à-pas pour scénarios récurrents | *Est-ce une séquence « pour faire X : 1, 2, 3 » ?* |
| [`checklists/`](./checklists/) | Portes de vérification avant/après une action | *Est-ce un « confirmer que… ✔ » ?* |
| [`adr/`](./adr/) | Mémoire des décisions et de leur pourquoi | *Est-ce « on a choisi X parce que… » ?* |

## Convention commune

Chaque document porte un frontmatter minimal :

```yaml
---
title: ...
type: pattern | anti-pattern | playbook | checklist | adr
status: provisional | stable | deprecated
related-skills: [flo-supabase, ...]   # liens vers Tier 2
last-reviewed: AAAA-MM-JJ
---
```

- **Single-source** : un fait vit à un seul endroit ; on **référence**, on ne **duplique** pas.
- **Provenance** : tout savoir promu suit la [porte de maturité](./flywheel.md).
- **Fraîcheur** : `last-reviewed` permettra un futur « knowledge-lint » (Phase 3).

## Savoir existant à rattacher (référence, pas copie)

- [`../docs/scorecard.md`](../docs/scorecard.md) → modèle de **checklist** (10 dimensions).
- [`../docs/architecture/`](../docs/architecture/) → **guides/ADR** d'écosystème déjà rédigés.
- [`../docs/skill-boundaries.md`](../docs/skill-boundaries.md) → cartographie (référencée par Tier 2).

## Voir aussi
- Mécanique de promotion : [`flywheel.md`](./flywheel.md)
- Standards : [`../standards/INDEX.md`](../standards/INDEX.md) · Constitution : [`../manifesto/FLO_MANIFESTO.md`](../manifesto/FLO_MANIFESTO.md)
