# 2 — Place de chaque brique

> Définition précise de **où vit quoi**, **ce que la brique contient**, **ce qu'elle ne contient pas**,
> et **de quoi elle dépend**. Même discipline « une responsabilité, un propriétaire » que les skills,
> étendue à tout le dépôt.

---

## 2.1 Les skills — `skills/`

- **Rôle** : *conseiller* Claude Code. Spécification déclarative des règles, frontières, anti-règles,
  hiérarchie d'autorité. C'est le **quoi/pourquoi**, jamais le code.
- **Contient** : `skills/flo-*/SKILL.md` + `CHANGELOG.md`. Inchangé.
- **Ne contient pas** : aucun code exécutable, aucune dépendance npm, aucun composant. Une règle qui
  *aurait besoin de code pour exister* appartient à un **package** (doc 06).
- **Dépend de** : rien. Distribuable seul via `skills-sync.sh` (contrainte dure, doc 00 §0.4).
- **Versionné** : SemVer par skill (déjà en place), hors du flux Changesets des packages.

## 2.2 Les packages — `packages/`

- **Rôle** : *matérialiser* en code réutilisable ce que les skills prescrivent. C'est le **comment**.
- **Contient** : du TypeScript publiable (`@flostack/*`), chaque package avec son `package.json`,
  son `tsconfig`, son `CHANGELOG.md`, ses tests unitaires.
- **Ne contient pas** : de prose normative (ça reste dans les skills), de page/route applicative
  (ça vit dans les templates), de logique spécifique à un seul projet.
- **Dépend de** : d'autres `packages/*` (via `workspace:*`) et de libs externes. Jamais de `templates/*`.
- **Versionné** : SemVer indépendant par package, via **Changesets** (doc 05).
- **Cartographie initiale** (le détail skill→package est en doc 06) :

  | Package | Matérialise | Contenu (résumé) |
  |---------|-------------|------------------|
  | `config-typescript` | flo-dev-standards | bases `tsconfig` strictes |
  | `config-eslint` | flo-dev-standards | règles ESLint partagées |
  | `config-tailwind` | flo-ui | preset Tailwind + design tokens |
  | `core` | flo-dev-standards | `Result<T,E>`, validation `env` (Zod), utils agnostiques |
  | `ui` | flo-ui | composants du design system, a11y, états |
  | `supabase` | flo-supabase | helpers client/serveur, patterns d'accès, modèles de migration/RLS |
  | `seo` | flo-seo | helpers metadata, JSON-LD, sitemap/robots |
  | `next` | flo-nextjs | presets `next.config`, conventions de rendu |

## 2.3 La boilerplate FloStack & les templates — `templates/`

- **Rôle** : des **starters prêts à cloner**. FloStack = le *golden path* (template phare) ; les autres
  sont des variantes spécialisées.
- **Contient** : `templates/flostack-saas/` (référence Next.js + Supabase), `templates/flostack-landing/`
  (marketing/SEO), `templates/flostack-offline/` (Vite/React offline). Chacun **consomme** `packages/*`
  et **respecte** les skills.
- **Distinction FloStack ⇄ templates** : « FloStack » est le **nom du système** (packages + conventions
  + golden path). `flostack-saas` est sa **matérialisation de référence** ; les autres templates en sont
  des déclinaisons. Un même mécanisme de scaffolding (la CLI) sert tous les templates.
- **Ne contient pas** : de logique réutilisable *générique* — dès qu'un bout de code mériterait d'être
  partagé entre deux templates, il **remonte** dans un `package`. Le template ne garde que l'assemblage
  et le spécifique.
- **Dépend de** : `packages/*` (versions épinglées, doc 05). Jamais l'inverse.
- **Versionné** : chaque template suit la « release train » FloStack (doc 05).

## 2.4 La CLI — `cli/create-flostack/`

- **Rôle** : automatiser la création d'un projet : choisir un template, l'instancier, injecter les bons
  packages, configurer (env, Supabase, etc.). Plus tard : `flostack upgrade` (migrations de version).
- **Contient** : le code de la CLI (`npx create-flostack`), publié comme package npm à part.
- **Ne contient pas** : les templates eux-mêmes (ils vivent dans `templates/`, la CLI les **lit**) ;
  aucune règle métier (elle orchestre, comme `flo-project-audit` orchestre sans juger).
- **Dépend de** : `templates/*` et `packages/core`. Point d'entrée utilisateur de l'écosystème.
- **Versionné** : SemVer propre, alignée sur la release train FloStack.

## 2.5 La documentation — `docs/` (+ `apps/docs/` plus tard)

- **Rôle** : expliquer l'écosystème. Source de vérité **écrite**.
- **Contient** : `docs/architecture/` (ce dossier), les docs existantes (boundaries, versioning,
  scorecard…), puis `docs/guides/` (FloStack, templates, CLI). En phase tardive, `apps/docs/` peut
  *publier* ce Markdown en site, **sans le dupliquer** (il lit `docs/`).
- **Ne contient pas** : de règles exécutables (ça reste dans skills/packages) — la doc *référence*,
  ne *redéfinit* pas (même principe que `examples/CLAUDE.md`).
- **Dépend de** : rien fonctionnellement ; pointe vers tout.

## 2.6 L'outillage du dépôt — `tools/`

- **Rôle** : faire tourner le **monorepo lui-même** (pas les projets utilisateurs).
- **Contient** : `check-overlaps.ts` et `skills-sync.sh` (existants, inchangés), plus les futurs
  scripts de validation transverse (ex. vérifier qu'un package ne contredit pas le skill qu'il
  matérialise — voir doc 06 §6.4).
- **Distinction avec `cli/`** : `tools/` sert les mainteneurs du dépôt ; `cli/` sert les utilisateurs
  finaux qui créent des projets.

---

## 2.7 Règle de circulation des dépendances (récapitulatif)

```
        skills/   ──(décrit, ne dépend de rien)──▶  [conseil pur, distribuable seul]
           ▲ référence (doc)                              │ matérialisé par
           │                                              ▼
        docs/  ◀── référence ──  packages/  ◀──consomme──  templates/  ◀──lit──  cli/
                                    ▲                                              │
                                    └──────────── apps/docs (publie docs) ─────────┘
```

- **Sens unique du code** : `cli → templates → packages` ; jamais l'inverse.
- **Les skills restent en surplomb** : ils *inspirent* tout le reste mais n'en dépendent pas, ce qui
  garantit qu'on peut toujours les installer seuls dans n'importe quel projet externe.
- **Anti-duplication généralisée** : tout code partagé entre deux consommateurs **remonte** d'un cran
  (template → package). C'est la version « code » de la règle skills « une responsabilité, un propriétaire ».
