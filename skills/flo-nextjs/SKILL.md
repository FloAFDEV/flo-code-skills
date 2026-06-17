---
name: flo-nextjs
version: 1.0.0
description: Règles Next.js 15+ (App Router). À activer pour tout travail sur des routes, layouts, Server/Client Components, data fetching serveur, caching/revalidation, Server Actions, next/image, next/font, middleware et configuration de rendu. Possède la MÉCANIQUE de l'API Metadata (mais pas son contenu, qui appartient à flo-seo).
owns:
  - app-router
  - server-components
  - client-components
  - metadata-api-mechanics
  - next-image
  - next-font
  - data-fetching-server
  - caching-revalidation
  - server-actions
  - nextjs-performance
  - react-patterns-next
excludes:
  - metadata-content
  - design-tokens
  - rls
  - code-architecture
---

# flo-nextjs

> Comment l'app est routée, rendue et buildée. App Router strict.

## ▶️ When To Invoke
- Créer/modifier une **route, un layout, un route group**, un fichier spécial (`loading`/`error`/`not-found`).
- Décider **Server vs Client Component** et la frontière entre les deux.
- **Data fetching serveur**, caching, `revalidate`, streaming, Server Actions.
- Optimiser via **`next/image`**, **`next/font`**, `next/dynamic`, middleware, `next.config`.
- Brancher la **mécanique** de l'API Metadata.

## ⏹️ When NOT To Invoke
- *Contenu* des metadata, OG, JSON-LD → `flo-seo`.
- Style, composants, animations, tokens → `flo-ui`.
- Policies/RLS/requêtes data → `flo-supabase`.
- Conventions de code générales → `flo-dev-standards`.
- **Diagnostiquer** un bug ou un problème de perf runtime (le *pourquoi*) → `flo-debug` (ici = *construire* du Next performant).

## 🎯 Scope (responsabilités)
- **App Router** : `app/`, layouts, route groups, fichiers spéciaux.
- **Server / Client Components** (décision et frontière).
- **Data fetching serveur**, `fetch` cache, `revalidate`, `cache()`, Suspense.
- **Server Actions** et mutations.
- Optimisations natives : **`next/image`**, **`next/font`**, `next/link`, `next/dynamic`.
- **Perf Next.js**, **patterns React** adaptés à Next, middleware, config.
- **Mécanique** de l'API Metadata (`generateMetadata`, `Metadata`).

## 🚫 Hors-scope (délégué)
- **Contenu** des metadata, OG, JSON-LD, sitemap → `flo-seo`.
- **Style, composant visuel, animation, tokens** → `flo-ui`.
- **Requêtes Supabase, RLS, secrets** → `flo-supabase`.
- **Typage, archi générale, erreurs** → `flo-dev-standards`.
- **Décision de protéger une route (données sensibles)** → `flo-supabase`/`flo-medical` priment.

## ✅ Règles strictes

### Server / Client Components
1. **Server Component par défaut.** `'use client'` uniquement si state/effets/events navigateur/API browser.
2. Pousser `'use client'` **le plus bas possible** ; jamais sur un layout/page entier.
3. Ne **jamais** passer de fonction non-sérialisable, de secret ou d'instance serveur en prop à un Client Component.
4. Fetch dans les Server Components ; passer des **props sérialisées** aux Client Components.

### Data fetching & cache
5. Fetcher au plus près du composant (colocation).
6. Stratégie explicite : statique (défaut), `revalidate: N` (ISR), `no-store`/`dynamic`. **Documenter le choix**.
7. Paralléliser les fetchs indépendants (`Promise.all`) ; pas de **cascade** de `await`.
8. `<Suspense>` + `loading.tsx` pour streamer.

### Server Actions & mutations
9. Mutations via **Server Actions** (`'use server'`).
10. Toute Server Action **valide ses entrées** (Zod) et **vérifie l'autorisation** (déléguée à supabase/medical) — jamais de confiance dans le payload client.
11. Après mutation : `revalidatePath`/`revalidateTag` ciblé.

### Optimisations natives
12. Images via **`next/image`** uniquement (`sizes` correct, `priority` sur le LCP). Jamais de `<img>` brut.
13. Polices via **`next/font`** (self-host, `display: swap`).
14. `next/dynamic` pour le code lourd ; `next/link` pour la navigation interne.

### Structure & metadata (mécanique)
15. Respecter les fichiers spéciaux. `error.tsx` est un Client Component.
16. Exposer la metadata via `metadata`/`generateMetadata` — **le contenu vient de `flo-seo`**.
17. `next.config` : ne pas désactiver les vérifs TS/ESLint au build.

## ⛔ Anti-règles (jamais)
- ❌ Jamais Pages Router (`getServerSideProps`/`getStaticProps`) : App Router only.
- ❌ Jamais `'use client'` sur un layout racine « pour éviter les erreurs ».
- ❌ Jamais de `useEffect` pour fetcher des données accessibles côté serveur.
- ❌ Jamais exposer une clé secrète à un Client Component.
- ❌ Jamais définir des tokens de design, des styles ou des animations (→ `flo-ui`).
- ❌ Jamais écrire le *contenu* SEO d'une page (→ `flo-seo`).

## 🥇 Priorité
Niveau **4**. Cède devant medical, supabase, dev-standards. Tranche sur le rendu/routing face à offline, ui et seo.

## 🔗 Interactions
- **Consomme** `flo-supabase` pour les données.
- **Héberge** les composants de `flo-ui` et **branche** la metadata de `flo-seo`.
- **Applique** `flo-dev-standards`.
- **Obéit** à `flo-medical`/`flo-supabase` quand une route touche des données protégées.
- **Se coordonne** avec `flo-offline` en contexte offline-first : les lectures côté client depuis le store local relèvent de `flo-offline` et ne violent **pas** la règle « Server Component par défaut » (exception assumée, propre à l'offline-first).
