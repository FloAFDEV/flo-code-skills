# 6 — Mutualisation : ce qui migre vers FloStack, ce qui reste dans les skills

> Le point le plus délicat. Un skill et un package peuvent parler du **même sujet** (ex. les design
> tokens) sans faire la **même chose**. La règle de partage doit être nette, sinon le code rampe dans
> les skills et la prose rampe dans les packages.

---

## 6.1 La ligne de partage (principe)

> **Un skill décrit une RÈGLE (le quoi/pourquoi, du jugement). Un package fournit une IMPLÉMENTATION
> (le comment, exécutable). On mutualise ce qui a une forme de code ; on garde dans le skill ce qui
> n'en a pas.**

| Reste dans le skill (`skills/`) | Migre vers FloStack (`packages/`) |
|--------------------------------|-----------------------------------|
| Règles, anti-règles, « When To / NOT To Invoke » | Composants, fonctions, configs, presets |
| Hiérarchie d'autorité, arbitrages de conflit | Valeurs concrètes (tokens, schémas, helpers) |
| Frontières (`owns`/`excludes`), boundaries | Code testable unitairement |
| Jugement (« est-ce premium ? », « est-ce sûr ? ») | Échafaudage réutilisable |
| Critères d'audit (scorecard) | — |

**Test décisif** : *« est-ce que ça s'exécute / s'importe ? »* → **package**. *« est-ce que ça se
lit et guide une décision ? »* → **skill**. Un skill ne contient **jamais** de code livrable ; un
package ne contient **jamais** de prose normative.

> Conséquence : skill et package sont **complémentaires**, pas concurrents. Le package *applique* ce
> que le skill *prescrit*. Idéalement, le SKILL.md du domaine **référence** son package (« l'implémentation
> de référence vit dans `@flostack/ui` »), et le package documente quel skill il matérialise.

---

## 6.2 Analyse skill par skill (les 5 ciblés + voisins concernés)

### `flo-dev-standards`  →  `config-typescript`, `config-eslint`, `core`
- **Migre (code)** : base `tsconfig` stricte (`strict`, `noUncheckedIndexedAccess`, …) ; config ESLint
  partagée ; type `Result<T,E>` ; module `env.ts` typé + validé (Zod) ; utilitaires agnostiques.
- **Reste (règle)** : « `any` interdit », « feature-first », « erreurs typées », « commits atomiques »,
  conventions de nommage, discipline de revue. Ce sont des **jugements**, pas du code.
- **Pourquoi** : la *config* est exécutable et dupliquée partout → package. La *discipline* est du
  conseil que Claude applique → skill.

### `flo-nextjs`  →  `next` (presets)
- **Migre (code)** : preset `next.config` (ne pas désactiver les vérifs TS/ESLint, options images/fonts),
  éventuels helpers de conventions de rendu.
- **Reste (règle)** : « Server Component par défaut », « `'use client'` au plus bas », « pas de cascade
  de `await` », « jamais de secret en prop client », mécanique Metadata. Décisions d'architecture de
  rendu → **non codifiables sans contexte** → skill.
- **Pourquoi** : on peut figer une *config*, pas le *jugement* « ce composant doit-il être client ? ».

### `flo-supabase`  →  `supabase` (helpers + modèles)
- **Migre (code)** : helpers client/serveur (clé `anon` côté client uniquement), wrappers d'auth
  serveur, **modèles** de migration et **patterns RLS** réutilisables (templates SQL paramétrables).
- **Reste (règle)** : « RLS sur toutes les tables, sans exception », « `service_role` ne quitte jamais
  le serveur », « toute policy testée (cas autorisé + refusé) », « jamais faire confiance à un `user_id`
  client ». Ce sont des **exigences de sécurité non négociables** → skill (autorité forte).
- **Pourquoi** : on mutualise des *helpers sûrs*, mais la *vigilance* (« cette policy est-elle correcte ? »)
  reste un jugement que le skill impose. ⚠️ Un helper ne doit jamais permettre de **contourner** une règle
  du skill (ex. pas d'export `service_role` côté client) — voir le garde-fou §6.4.

### `flo-ui`  →  `ui`, `config-tailwind`
- **Migre (code)** : **design tokens** (couleurs/espacements/rayons/ombres/typo), preset Tailwind,
  composants du design system avec leurs états (loading/empty/error/success), primitives a11y
  (focus-visible, cibles ≥ 44px, contraste AA).
- **Reste (règle)** : « tokens jamais de valeurs magiques », « 4 états obligatoires », « animer
  transform/opacity », « respecter `prefers-reduced-motion` », a11y **non négociable**. Le skill *exige* ;
  le package *fournit des composants conformes*.
- **Pourquoi** : c'est le cas le plus mutualisable (beaucoup de code partagé), mais le skill reste le
  **garant des invariants** (un composant qui casse l'a11y viole le skill, même s'il vient du package).

### `flo-seo`  →  `seo` (helpers)
- **Migre (code)** : helpers de génération de metadata, builders JSON-LD (schema.org), `sitemap`/`robots`,
  helpers OpenGraph/Twitter Cards.
- **Reste (règle)** : « `title`/description uniques par page », « un seul `<h1>` », « noindex sur pages
  protégées », « pas de keyword stuffing / structured data trompeuse ». Le **contenu** et la pertinence
  sont du jugement éditorial → skill.
- **Pourquoi** : on outille la *mécanique* (générer un JSON-LD valide), pas la *pertinence* (que dire).

### Voisins concernés (hors des 5 ciblés, pour cohérence)
- **`flo-offline`** → futur `packages/offline` (helpers Dexie/sync) ; règles de conflits/source de vérité **restent** skill.
- **`flo-medical`** → **reste presque entièrement skill** : c'est de la *contrainte de conformité*
  (RGPD/HDS), pas du code. Au plus, des *helpers de classification* pourraient être packagés plus tard ;
  l'exigence reste skill (autorité max).
- **`flo-project-audit`, `flo-debug`, `frontend-design`, `design-taste`, `playwright`** → **restent
  100 % skills**. Ce sont du jugement, du diagnostic, de l'orchestration, de la critique : **aucune
  forme de code livrable**. (La config Playwright d'un projet, elle, vivra dans les templates/packages,
  mais la *méthode de test* reste le skill.)

---

## 6.3 Tableau de synthèse

| Skill | Migre vers FloStack (package) | Reste exclusivement skill |
|-------|-------------------------------|---------------------------|
| flo-dev-standards | tsconfig, eslint, `Result`, `env` validé, utils | discipline, nommage, archi, revue |
| flo-nextjs | preset `next.config`, helpers de conventions | décisions Server/Client, data fetching, mécanique Metadata |
| flo-supabase | helpers client/serveur, modèles RLS/migrations | exigences RLS/auth/secrets (non négociables) |
| flo-ui | tokens, preset Tailwind, composants, primitives a11y | invariants a11y, 4 états, règles d'animation |
| flo-seo | helpers metadata/JSON-LD/sitemap/robots | contenu, pertinence, sémantique d'indexation |
| flo-offline *(voisin)* | helpers Dexie/sync (futur) | stratégies de conflit, source de vérité |
| flo-medical *(voisin)* | (rien au départ) | **toute** la conformité (autorité max) |
| audit / debug / frontend-design / design-taste / playwright | rien | **tout** (jugement, diagnostic, orchestration) |

---

## 6.4 Garde-fous pour que la frontière tienne dans le temps

1. **Un package ne contredit jamais son skill.** Si `@flostack/ui` exposait un composant sans
   focus-visible, il violerait `flo-ui`. → Prévoir en `tools/` un check « un package matérialise un
   skill déclaré et respecte ses invariants testables » (prolongement de `check-overlaps`).
2. **Un skill ne contient jamais de code livrable.** Au plus, des *exemples* illustratifs courts,
   jamais une implémentation à importer.
3. **Référencement croisé, pas duplication.** Le SKILL.md pointe vers `@flostack/<x>` (« implémentation
   de référence »), le package pointe vers le skill (« règles dans `skills/flo-<x>` »). Une seule source
   par information.
4. **Le code remonte, la règle reste.** Quand un template duplique du code → il remonte en package (doc 02).
   Quand une règle se précise → elle reste/évolue dans le skill (versioning skill, doc 05 §5.1).
5. **La sécurité prime toujours.** Aucun helper packagé ne doit *faciliter* la violation d'une règle de
   sécurité (`flo-supabase`, `flo-medical`). En cas de tension, la hiérarchie d'autorité existante tranche.

> Résultat : FloStack devient l'**implémentation de référence** des skills, et les skills restent la
> **spécification** de FloStack. Le même dépôt porte les deux, sans jamais les confondre ni les dupliquer.
