# 1 — Arborescence cible

> Une organisation **claire** (chaque chose à une place évidente) et **évolutive** (ajouter une brique
> ne déplace rien). On part des contraintes dures (doc 00 §0.4) : `skills/` ne bouge pas.

---

## 1.1 Choix techniques (argumentés)

| Décision | Choix | Pourquoi ce choix |
|----------|-------|-------------------|
| **Type de dépôt** | **Monorepo** géré | Un seul dépôt exigé (zéro duplication). Le monorepo permet *N* paquets versionnés indépendamment dans une seule histoire Git, une seule CI, une cohérence garantie skills ⇄ code. |
| **Gestionnaire** | **pnpm workspaces** | Liens symboliques natifs entre packages, `node_modules` économe, `workspace:*` pour le développement local. Standard de fait des monorepos TS. |
| **Orchestrateur de tâches** | **Turborepo** | Cache de build/lint/test par package, graphe de dépendances, parallélisme. Écosystème Vercel → cohérent avec Next.js (cf. `flo-nextjs`). Alternative notée : Nx (plus lourd, non retenu au départ). |
| **Versioning multi-packages** | **Changesets** | SemVer + changelogs par package, release train, PR de version automatisée. Prolonge la politique `docs/VERSIONING.md` déjà en place (doc 05). |
| **Langage d'outillage** | **TypeScript** (déjà `type: module`) | Cohérent avec `tools/check-overlaps.ts` et `flo-dev-standards` (TS strict). |
| **Site de documentation** *(phase tardive)* | **Nextra** ou **Astro Starlight** sous `apps/docs` | Optionnel ; n'apparaît qu'en doc 04. La doc reste d'abord en Markdown dans `docs/`. |

> Ces choix sont **réversibles tant que rien n'est implémenté**. Ils sont là pour donner une cible
> concrète à valider, pas pour verrouiller. Si pnpm/Turbo/Changesets ne conviennent pas, seuls les
> fichiers de configuration racine changent — l'arborescence logique ci-dessous tient quand même.

---

## 1.2 Arborescence proposée

```
flo-code-skills/                  # (le dépôt — renommage en "flostack" possible, voir 1.4)
│
├── skills/                       # ⟵ INCHANGÉ. Source de vérité des skills Claude Code.
│   └── flo-*/SKILL.md            #    Reste à la racine (contrainte dure : skills-sync.sh).
│
├── packages/                     # Briques de CODE réutilisables, versionnées indépendamment.
│   ├── config-typescript/        #   tsconfig de base (strict) — matérialise flo-dev-standards
│   ├── config-eslint/            #   règles ESLint partagées            ┘
│   ├── config-tailwind/          #   preset Tailwind + design tokens — matérialise flo-ui
│   ├── core/                     #   utils agnostiques : Result<T,E>, env validé (Zod), helpers
│   ├── ui/                       #   design system (composants) — matérialise flo-ui
│   ├── supabase/                 #   helpers client/serveur, patterns RLS — matérialise flo-supabase
│   ├── seo/                      #   metadata, JSON-LD, sitemap helpers — matérialise flo-seo
│   └── next/                     #   presets next.config, conventions — matérialise flo-nextjs
│
├── templates/                    # Starters prêts à cloner (consomment packages/* + suivent les skills).
│   ├── flostack-saas/            #   ⭐ le golden path : SaaS Next.js + Supabase (= "FloStack")
│   ├── flostack-landing/         #   marketing / SEO-first
│   └── flostack-offline/         #   Vite/React offline-first (Dexie)
│
├── cli/                          # La CLI de l'écosystème (publiée séparément).
│   └── create-flostack/          #   `npx create-flostack` : scaffolding depuis templates/* + packages/*
│
├── apps/                         # Applications internes du dépôt (pas livrées à l'utilisateur final).
│   └── docs/                     #   (phase tardive) site de documentation
│
├── tools/                        # ⟵ EXISTANT, enrichi. Outillage du dépôt lui-même.
│   ├── check-overlaps.ts         #   (existant) cohérence des skills — inchangé
│   └── skills-sync.sh            #   (existant) distribution des skills — inchangé
│
├── docs/                         # ⟵ EXISTANT, enrichi. Documentation de l'écosystème.
│   ├── architecture/             #   CE dossier
│   ├── skill-boundaries.md       #   (existant)
│   ├── VERSIONING.md             #   (existant — devient la base de 05)
│   ├── guides/                   #   (à venir) guides FloStack / templates / CLI
│   └── …
│
├── .changeset/                   # (Phase 4) configuration Changesets
├── .github/workflows/            # ⟵ EXISTANT, enrichi (lint/build/test/version en plus de overlaps)
│
├── pnpm-workspace.yaml           # (Phase 1) déclare skills off, packages/templates/cli/apps on
├── turbo.json                    # (Phase 1) pipeline de tâches
├── package.json                  # racine : scripts, devDeps partagées (reste private)
├── bootstrap.sh / install.sh / install.ps1   # ⟵ INCHANGÉS (distribution skills)
└── README.md / README.fr.md / LICENSE / CHANGELOG.md
```

---

## 1.3 Principes de l'arborescence

1. **Séparation par *nature*, pas par *domaine*** au premier niveau : `skills/` (conseil),
   `packages/` (code partagé), `templates/` (starters), `cli/` (outil), `apps/` (apps internes),
   `docs/` (savoir), `tools/` (outillage repo). Chaque dossier répond à *une* question.
2. **Le code descend, jamais ne remonte.** `templates/*` dépendent de `packages/*` ; `packages/*` ne
   dépendent jamais de `templates/*`. La CLI lit `templates/*`. `skills/` ne dépend de **rien** (c'est
   du conseil, pas du code) — il reste autonome et distribuable seul.
3. **Frontière franche skills ⇄ packages.** Un skill **décrit** une règle ; un package **l'exécute**.
   Jamais de logique métier dans `skills/`, jamais de prose normative dans `packages/` (doc 06).
4. **Ajouter ne déplace pas.** Nouveau package → un dossier dans `packages/`. Nouveau template → un
   dossier dans `templates/`. Aucune réorganisation des voisins. C'est la définition d'« évolutif ».
5. **`flo-*` = convention de nommage transverse.** Skills `flo-*`, packages publiés `@flostack/*`
   (scope npm), templates `flostack-*`. Lisible d'un coup d'œil à quel univers appartient une brique.

---

## 1.4 Question ouverte : renommer le dépôt ?

Le dépôt s'appelle `flo-code-skills` mais devient bien plus large. Deux options :

- **A — Garder `flo-code-skills`** : zéro rupture d'URL, de clone, de `skills-sync.sh` (qui pointe
  `FloAFDEV/flo-code-skills.git`). Le nom devient un peu réducteur.
- **B — Renommer en `flostack`** : nom cohérent avec l'écosystème. GitHub redirige les anciennes URLs,
  mais il faut mettre à jour `FLO_SKILLS_URL` par défaut dans `skills-sync.sh` et la doc d'install.

> **Recommandation : A pour démarrer** (ne rien casser pendant la restructuration), **B envisageable
> plus tard** une fois FloStack public et l'outillage stabilisé. À trancher à la validation.
