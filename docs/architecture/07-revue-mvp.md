# 7 — Revue d'architecture & MVP FloStack

> Revue critique des docs 00–06 **avant toute implémentation**. Objectif : repérer la sur-ingénierie,
> reporter ce qui n'est pas encore justifié, et définir un **MVP livrable en quelques jours** — un socle
> minimal, stable et immédiatement utilisable, pas un framework complet.

> **Ce document prime sur les docs 04 (roadmap) et 05 (versioning) pour le court terme.** Les docs 00–06
> restent la **cible long terme** ; celui-ci dit *par où commencer petit*.

---

## 7.1 Verdict en une phrase

La cible (monorepo, packages, CLI, release train) est **juste comme destination**, mais **prématurée
comme point de départ** : la quasi-totalité de sa valeur repose sur **un seul livrable** — un template
FloStack réel qui incarne les skills. Tout le reste est de l'outillage qui ne se justifie qu'**après**
l'apparition d'une vraie duplication ou d'un vrai consommateur externe.

---

## 7.2 Risques de sur-ingénierie identifiés

| # | Élément proposé (doc) | Pourquoi c'est de la sur-ingénierie *maintenant* | Recommandation |
|---|------------------------|--------------------------------------------------|----------------|
| 1 | **8 packages** dès la Phase 4 (01, 02, 06) | Un package ne se justifie qu'avec **≥ 2 consommateurs**. Avec 1 seul template, **0 package** n'est justifié : on créerait des abstractions sans preuve d'usage. | **Reporter.** Tout vit *dans* le template au départ. Extraire à la 1ʳᵉ duplication réelle. |
| 2 | **Turborepo** (01) | Le cache de tâches n'a de valeur qu'avec plusieurs packages/apps qui buildent. Sur 1 app, c'est une couche d'outillage à maintenir pour ~0 gain. | **Reporter** jusqu'au 2ᵉ ou 3ᵉ package. |
| 3 | **Changesets + release train + matrice de compatibilité + LTS** (05) | Machinerie de versioning multi-packages **publiés**. Tant qu'il n'y a ni package, ni consommateur externe, c'est du process sans objet. | **Reporter.** MVP versionné par **tag git** (cf. 7.6). |
| 4 | **CLI `create-flostack` + `flostack upgrade` + codemods** (02, 04, 05) | `degit`/`git clone` fait déjà « créer un projet depuis un template ». Les codemods de migration supposent des MAJOR de packages… qui n'existent pas encore. | **Reporter** en dernier (cf. 7.7). |
| 5 | **3 templates** (saas, landing, offline) (01, 04) | 2 templates sur 3 ne servent pas le besoin immédiat et **multiplient par 3** la surface à maintenir avant même d'avoir validé le premier. | **Garder 1 seul** (saas) pour le MVP. |
| 6 | **`apps/docs` (Nextra/Starlight)** (01, 04) | Un site de doc pour un écosystème encore inexistant. Le Markdown dans `docs/` suffit. | **Reporter** (déjà marqué « phase tardive », bien). |
| 7 | **Méta-package `flostack` + garde-fou outillé skill⇄package** (05 §5.3, 06 §6.4) | Gouvernance avancée (vérifier qu'un package respecte les invariants de son skill) avant d'avoir un seul package. Discipline manuelle suffit à 1 personne. | **Reporter.** Discipline humaine + revue d'abord. |
| 8 | **Renommage du dépôt, scope npm `@flostack/*`** (01 §1.4, 05 §5.5) | Décisions de distribution publique. Aucune urgence tant que rien n'est publié. | **Reporter** (déjà recommandé). |

> **Fil rouge** : presque tout le risque vient d'**outiller avant d'avoir un usage**. Le remède n'est
> pas d'abandonner la cible, mais de **différer chaque brique jusqu'à son déclencheur** (7.4).

---

## 7.3 Ce qui mérite d'être gardé dès maintenant (le strict utile)

| Élément | Pourquoi le garder | Coût |
|---------|--------------------|------|
| **Les skills, inchangés** | Déjà la valeur du dépôt. Zéro travail, zéro risque. | nul |
| **Un dossier `templates/`** + 1 template réel | C'est **le** livrable à valeur immédiate (clone → build → utilisable). | quelques jours |
| **Un `pnpm-workspace.yaml` minimal** déclarant `templates/*` | Très peu cher, évite un re-travail si on ajoute un 2ᵉ template/package plus tard. Pas besoin de Turbo pour ça. | minutes |
| **Discipline « le code remonte quand ça se répète »** (en règle, pas en outil) | Garde la porte ouverte aux packages **sans** les créer prématurément. | nul |
| **Le dossier d'architecture 00–06** comme cap | Sert de boussole ; on n'implémente pas tout, mais on sait où on va. | déjà fait |

---

## 7.4 Report piloté par déclencheur (pas « jamais », mais « quand »)

Chaque brique reportée a un **déclencheur objectif** d'activation. C'est ce qui transforme « MVP » en
trajectoire saine plutôt qu'en dette.

| Brique reportée | Déclencheur d'activation |
|-----------------|--------------------------|
| **1ᵉʳ package** (ex. `config-typescript`, `ui` tokens) | Quand un **2ᵉ template** ou un **projet externe** duplique le même code → on extrait *ce* code précis. |
| **Turborepo** | Quand il y a **≥ 3 cibles** qui buildent et que la CI devient lente. |
| **Changesets / versioning multi-packages** | Quand un **package est consommé hors du monorepo** (publié npm ou lié ailleurs). |
| **CLI** | Quand le **clone manuel devient un point de friction récurrent** (≥ 2–3 templates, ou prompts de config non triviaux). |
| **2ᵉ/3ᵉ templates** | Quand un **vrai besoin** (un projet landing/offline concret) se présente. |
| **Site de doc** | Quand la doc Markdown devient trop volumineuse pour être lue dans le repo. |
| **Garde-fou outillé skill⇄package** | Quand il y a **≥ 3 packages** et que la discipline manuelle ne suffit plus. |

---

## 7.5 MVP FloStack — périmètre

> **Nom de travail : « FloStack Starter ».** Un template Next.js réel, sobre, qui **incarne les skills**,
> clonable et buildable tel quel. Pas de packages, pas de CLI, pas de Turbo, pas de Changesets.

### Dans le MVP (`templates/flostack-saas/`)
- **Next.js 15 App Router**, TypeScript strict — conforme `flo-dev-standards` + `flo-nextjs`.
- **Config inline** (tsconfig strict, ESLint, Tailwind preset + tokens) **dans le template**, pas en packages.
- **Supabase** : client `anon` côté navigateur, accès serveur, **RLS activée**, 1 exemple d'auth — conforme `flo-supabase`.
- **Socle UI** : tokens + quelques primitives a11y et les 4 états (loading/empty/error/success) — conforme `flo-ui`.
- **SEO de base** : metadata, OpenGraph, sitemap/robots — conforme `flo-seo`.
- **`env.ts` validé (Zod)**, `Result<T,E>` — conforme `flo-dev-standards`.
- **README du template** : comment cloner, configurer, lancer ; quels skills il active.

### Hors MVP (reporté, cf. 7.4)
- ❌ Packages partagés, ❌ Turborepo, ❌ Changesets/release train, ❌ CLI, ❌ templates landing/offline,
  ❌ site de doc, ❌ méta-version, ❌ garde-fous outillés, ❌ renommage/publication npm.

### Pourquoi c'est **stable**
- C'est une **application Next.js standard** : aucune abstraction maison, aucune couche d'outillage
  exotique à casser. Ce qui ne dépend de rien ne se brise pas.

### Pourquoi c'est **immédiatement utilisable**
- `degit`/`git clone` du dossier → `pnpm install` → `pnpm dev`. Aucun build de package, aucune CLI à apprendre.

---

## 7.6 Découpage indicatif (quelques jours)

> Toujours en **petites PR à objectif unique**. (Périmètre, pas un engagement de durée.)

| Jour | Objectif | Sort quand |
|------|----------|------------|
| **J1** | `templates/` + `pnpm-workspace.yaml` minimal + squelette `flostack-saas` (Next 15, TS strict, ESLint, Tailwind+tokens) | `pnpm dev` démarre, build vert |
| **J2** | Supabase (client anon/serveur, RLS, 1 flux auth) + `env.ts` validé + `Result` | auth d'exemple marche, RLS testée |
| **J3** | Socle UI (tokens, primitives a11y, 4 états) + SEO de base (metadata/OG/sitemap/robots) | page d'exemple conforme `flo-ui`/`flo-seo` |
| **J4** | README du template + passage au crible des skills (scorecard) + corrections | audit sans contradiction, doc à jour |

**Versioning du MVP** : un simple **tag git** (`flostack-starter-v0.1.0`) sur le dépôt. Pas de SemVer
multi-packages tant qu'il n'y a pas de package.

---

## 7.7 Roadmap révisée (MVP-first)

```
ÉTAPE 0  Skills (déjà là)                          ─ inchangé
ÉTAPE 1  MVP « FloStack Starter » (7.5/7.6)        ─ 1 template réel, 0 outillage      ◀── on commence ICI
─────────────────────────────────────────────────────────────────────────────────────
   ↓ (seulement si déclencheur 7.4 atteint)
ÉTAPE 2  Extraire le 1ᵉʳ package dupliqué          ─ quand 2ᵉ consommateur apparaît
ÉTAPE 3  2ᵉ template + packages au fil de l'eau    ─ quand un vrai besoin existe
ÉTAPE 4  Outillage (Turbo, Changesets)             ─ quand l'échelle le justifie
ÉTAPE 5  CLI + site de doc                          ─ quand la friction le justifie
```

Comparaison avec la roadmap d'origine (doc 04) : on **inverse la logique**. Le doc 04 construisait
l'échafaudage puis le remplissait (FloStack → templates → packages → CLI). Ici on livre **d'abord la
valeur** (un starter utilisable), puis on n'ajoute de l'outillage **que quand un déclencheur objectif
le réclame**. La cible finale est la même ; le chemin évite de payer l'outillage avant l'usage.

---

## 7.8 Recommandation

1. **Valider ce périmètre MVP (7.5)** comme première étape concrète, en gelant explicitement le reste.
2. Implémenter le MVP en **4 petites PR** (7.6), chacune à objectif unique.
3. **Ne rien outiller** (packages, Turbo, Changesets, CLI) tant qu'un **déclencheur de 7.4** n'est pas atteint.
4. Garder les docs 00–06 comme **cap long terme**, pas comme to-do immédiate.
