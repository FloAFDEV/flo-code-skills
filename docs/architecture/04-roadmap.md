# 4 — Roadmap en 5 phases

> Principe directeur : **introduction progressive**. Chaque phase livre quelque chose d'utile, ne casse
> jamais la précédente, et se découpe en **petites PR à objectif unique**. Aucun outil n'est introduit
> avant la phase qui l'exige.

> ⚠️ Aucune de ces phases ne démarre tant que ce dossier d'architecture n'est pas validé. Ce qui suit
> est le **plan**, pas un travail en cours.

---

## Phase 1 — Restructuration du dépôt *(socle, non cassant)*

**But** : préparer le monorepo **sans rien casser** ni écrire de code métier.

- [ ] Ajouter `pnpm-workspace.yaml` (déclare `packages/*`, `templates/*`, `cli/*`, `apps/*` — **pas** `skills/`).
- [ ] Ajouter `turbo.json` (pipeline `lint`/`build`/`test`/`typecheck` — vide tant qu'il n'y a pas de package).
- [ ] Étendre `package.json` racine (scripts, devDeps partagées) en restant `private`.
- [ ] Créer les dossiers vides avec un `README.md` d'intention : `packages/`, `templates/`, `cli/`, `apps/`.
- [ ] Enrichir la CI (`.github/workflows/`) : ajouter lint/typecheck **à côté** de `check-overlaps` (filtrés par chemin).
- [ ] Vérifier explicitement : `skills/`, `tools/skills-sync.sh`, `bootstrap.sh`, `install.sh` **intacts**.

**Critère de sortie** : `npm run check:overlaps` toujours vert ; `pnpm install` fonctionne ;
l'installation des skills (symlinks) **inchangée**. Aucun fichier de `skills/` modifié.

---

## Phase 2 — Création de FloStack *(le golden path)*

**But** : un **template de référence** Next.js + Supabase qui incarne tous les skills. C'est la
matérialisation « preuve par l'exemple ».

- [ ] `templates/flostack-saas/` : structure App Router conforme à `flo-nextjs` (Server Components par défaut…).
- [ ] Intégration Supabase conforme à `flo-supabase` (RLS, auth serveur, pas de `service_role` côté client).
- [ ] Base UI conforme à `flo-ui` (tokens, a11y, états loading/empty/error/success).
- [ ] SEO conforme à `flo-seo` (metadata, OG, JSON-LD, sitemap/robots).
- [ ] Config TS/ESLint conforme à `flo-dev-standards`.
- [ ] **À ce stade**, le code commun peut encore vivre *dans* le template ; il **remontera** en packages en Phase 4.

**Critère de sortie** : FloStack se lance, build vert, audité par les skills (scorecard) sans
contradiction. Sert de référence vivante pour valider les futurs packages.

> Note : Phase 2 **avant** Phase 4 volontairement — on découvre *par l'usage* ce qui mérite d'être
> mutualisé (doc 06), plutôt que de spéculer des packages dans le vide.

---

## Phase 3 — Création des templates *(déclinaisons)*

**But** : décliner FloStack en variantes spécialisées.

- [ ] `templates/flostack-landing/` : marketing / SEO-first (sous-ensemble de FloStack).
- [ ] `templates/flostack-offline/` : Vite/React offline-first conforme à `flo-offline` (Dexie).
- [ ] Identifier **ce qui se répète** entre `flostack-saas` et les nouveaux templates → candidats packages.
- [ ] Documenter, pour chaque template, quels skills il active (cf. tableau « Activation par type » du README).

**Critère de sortie** : ≥ 2 templates fonctionnels ; liste explicite du code dupliqué à extraire
(entrée de la Phase 4).

---

## Phase 4 — Création des packages communs *(extraction, anti-duplication)*

**But** : **extraire** vers `packages/*` le code partagé identifié en Phases 2–3. C'est ici que
l'anti-duplication devient réelle.

- [ ] Mettre en place **Changesets** (`.changeset/`) + le flux de version (doc 05).
- [ ] Extraire, dans cet ordre de risque croissant : `config-typescript`, `config-eslint`,
      `config-tailwind` → `core` → `seo` → `ui` → `supabase` → `next`.
- [ ] Réécrire les templates pour **consommer** ces packages (`workspace:*` en dev, versions épinglées en publication).
- [ ] Tests unitaires par package (conformes à `flo-dev-standards`).
- [ ] (Décision) Publier sous le scope `@flostack/*` **ou** rester internes — voir doc 05.

**Critère de sortie** : zéro duplication de code commun entre templates ; chaque package versionné,
testé, avec changelog ; matrice de compatibilité (doc 05) initialisée.

---

## Phase 5 — Création de la CLI *(point d'entrée)*

**But** : `npx create-flostack` — créer un projet en une commande.

- [ ] `cli/create-flostack/` : sélection de template, instanciation, injection des packages, prompts (env, Supabase).
- [ ] `flostack upgrade` (v2) : mise à jour des packages d'un projet existant + application des codemods (doc 05).
- [ ] Tests E2E de scaffolding (conformes à `playwright`/CI).
- [ ] (Optionnel, en parallèle) `apps/docs/` : publier `docs/` en site, sans duplication.

**Critère de sortie** : un projet créé via la CLI démarre, build vert, et passe l'audit scorecard
sans contradiction avec les skills.

---

## Vue d'ensemble

```
Phase 1 ──▶ Phase 2 ──▶ Phase 3 ──▶ Phase 4 ──▶ Phase 5
restructure  FloStack    templates   packages    CLI
(non cassant) (golden)    (variantes) (extraction)(entrée)
   │            │            │           │           │
   └─ outils ───┴── preuve ──┴─ duplica- ┴─ Change-  ┴─ npx create-flostack
      monorepo     par usage    tion vue    sets         + flostack upgrade
```

**Dépendances** : 2 et 3 précèdent 4 (on extrait ce qu'on a vu se répéter). 4 précède 5 (la CLI
assemble des packages stables). 1 est prérequis de tout. Chaque case = plusieurs petites PR.
