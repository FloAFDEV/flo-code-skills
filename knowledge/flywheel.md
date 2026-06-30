---
title: Flywheel d'extraction
tier: 3
status: stable
last-reviewed: 2026-06-30
---

# Le Flywheel — comment un savoir devient un standard

> La mécanique vivante du Flo OS. Elle transforme ce qu'un **projet réel** prouve (ex. Garage Mendonça,
> projet *externe*) en éléments réutilisables du système — **sans standardisation prématurée**.

## Le cycle

```
   ┌──────────────── PROJET RÉEL (externe) ────────────────┐
   │                                                        │
   ▼                                                        │
 1. ÉMERGENCE    une solution / un pattern se répète         │
 2. MATURITÉ     franchit la PORTE DE MATURITÉ (voir plus bas)│
 3. PROMOTION    → devient Pattern / Anti-pattern / Checklist /
                   Standard (+ un ADR qui acte le « pourquoi »)
 4. INCARNATION  → injecté dans un Artifact (boilerplate, template)
 5. RÉUTILISATION → le projet suivant démarre déjà au standard ┘
```

## Porte de maturité (anti-standardisation prématurée)

Rien n'est promu en `stable` sans franchir cette porte :

- **Usage** : éprouvé sur **≥ 2 projets réels**, **ou** validation explicite de l'auteur.
- **Stabilité** : aucune question ouverte, aucune variante concurrente non tranchée.
- **Provenance** : la source réelle est citée (ADR).

Tant que la porte n'est pas franchie, l'élément existe en statut **`provisional`** (utilisable mais
non garanti). Un élément issu d'**un seul** projet reste `provisional` par défaut.

## Pourquoi cette discipline

- Évite de figer en « standard » une idée vue **une seule fois** (coût de revirement élevé).
- Même esprit que le « déclencheur » de la roadmap MVP ([`../docs/architecture/07-revue-mvp.md`](../docs/architecture/07-revue-mvp.md))
  et que la règle `flo-dev-standards` « chercher l'existant avant de créer ».

## Statuts (cycle de vie d'un savoir)

`provisional` → `stable` (porte franchie) → `deprecated` (remplacé, jamais supprimé silencieusement).

## Voir aussi
- Index Knowledge : [`INDEX.md`](./INDEX.md) · Standards : [`../standards/INDEX.md`](../standards/INDEX.md)
- Mémoire des décisions : [`adr/`](./adr/)
