---
title: ADR — Architecture Decision Records
type: index
tier: 3
status: stable
last-reviewed: 2026-06-30
---

# ADR — Architecture Decision Records

> **La mémoire technique.** Chaque décision structurante est consignée : son contexte, la décision,
> son statut, ses conséquences. Append-only — on **n'efface jamais** un ADR, on le **remplace** par un
> nouveau qui le supersède.

**Y va** : toute décision durable (« on a choisi X parce que… ») — choix d'architecture, de stack, de
gouvernance, d'amendement du Manifeste.
**N'y va pas** : une explication générale (→ guide), une règle agent (→ Skill).

- **Nommage** : `NNNN-titre-kebab.md` (numérotation croissante, ex. `0001-adoption-flo-os.md`).
- **Gabarit** : [`TEMPLATE.md`](./TEMPLATE.md).
- **Statuts** : `proposé` → `accepté` → `superseded by NNNN` / `déprécié`.

_Frontmatter : voir [`../INDEX.md`](../INDEX.md)._
