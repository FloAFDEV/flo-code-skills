---
name: flo-nextjs
description: Règles Next.js 15+ (App Router). À activer pour tout travail sur des routes, layouts, Server/Client Components, data fetching serveur, caching/revalidation, Server Actions, next/image, next/font, middleware et configuration de rendu. Possède la MÉCANIQUE de l'API Metadata (mais pas son contenu, qui appartient à flo-seo).
---

# flo-nextjs

> Comment l'app est routée, rendue et buildée. App Router strict.

## 🎯 Scope
- **App Router** exclusivement : `app/`, layouts, route groups, `loading.tsx`, `error.tsx`, `not-found.tsx`.
- **Décision Server vs Client Component** et frontière entre les deux.
- **Data fetching** côté serveur, `fetch` cache, `revalidate`, `cache()`, streaming/Suspense.
- **Server Actions** et mutations.
- Optimisations natives : **`next/image`**, **`next/font`**, `next/link`, `next/dynamic`.
- Middleware, `route handlers` (`route.ts`), config (`next.config`).
- **Mécanique** de l'API Metadata (`generateMetadata`, `Metadata`).

## 🚫 Hors-scope (délégué)
- **Contenu** des metadata, OG, JSON-LD, sitemap → `flo-seo`.
- Tout **style, composant visuel, animation** → `flo-ui`.
- **Requêtes Supabase, RLS, secrets** → `flo-supabase` (nextjs *appelle* mais n'écrit pas les règles d'accès).
- **Typage, archi de dossiers générale, erreurs** → `flo-dev-standards`.
- **Décision de protéger/authentifier une route pour cause de données sensibles** → `flo-supabase` prime.

## ✅ Règles strictes

### Server / Client Components
1. **Server Component par défaut.** `'use client'` uniquement si le composant a besoin de state, d'effets, d'events navigateur ou d'API browser.
2. Pousser `'use client'` **le plus bas possible** dans l'arbre (composants feuilles interactifs), jamais sur un layout/page entier.
3. Ne **jamais** passer de fonction non-sérialisable, de secret ou d'instance serveur en prop à un Client Component.
4. Fetch des données dans les Server Components ; passer aux Client Components des **props sérialisées**, pas des promesses de data côté client quand le serveur peut le faire.

### Data fetching & cache
5. Fetcher au plus près du composant qui consomme (colocation), pas tout en haut « par commodité ».
6. Choisir explicitement la stratégie : statique (défaut), `revalidate: N` (ISR), ou `cache: 'no-store'`/`dynamic` (temps réel). **Documenter le choix** par un commentaire.
7. Paralléliser les fetchs indépendants (`Promise.all`) ; ne pas créer de **cascade** de `await`.
8. Utiliser `<Suspense>` + `loading.tsx` pour streamer ; isoler les parties lentes.

### Server Actions & mutations
9. Mutations via **Server Actions** (`'use server'`), pas de route handler ad hoc quand une action suffit.
10. Toute Server Action **valide ses entrées** (Zod) et **vérifie l'autorisation** (déléguée à supabase) avant d'agir — jamais de confiance dans le payload client.
11. Après mutation : `revalidatePath`/`revalidateTag` ciblé, pas d'invalidation globale.

### Optimisations natives
12. Images via **`next/image`** uniquement : `width`/`height` ou `fill`, `sizes` correct, `priority` sur le LCP, `placeholder="blur"` quand pertinent. Jamais de `<img>` brut.
13. Polices via **`next/font`** (self-host, `display: swap`). Pas de `<link>` Google Fonts manuel.
14. `next/dynamic` pour le code lourd non-critique ; `next/link` pour la navigation interne (jamais `<a>` interne).

### Structure & metadata (mécanique)
15. Respecter les fichiers spéciaux : `layout`, `page`, `loading`, `error`, `not-found`, `route`. `error.tsx` est un Client Component.
16. Exposer la metadata via `export const metadata` ou `generateMetadata` — **le contenu vient de `flo-seo`**, nextjs ne fait que brancher l'API.
17. `next.config` : activer les optimisations utiles, ne pas désactiver les vérifs TS/ESLint au build.

## ⛔ Anti-règles (jamais)
- ❌ Jamais `getServerSideProps`/`getStaticProps`/Pages Router : App Router only.
- ❌ Jamais `'use client'` sur un layout racine ou par défaut « pour éviter les erreurs ».
- ❌ Jamais de `useEffect` pour fetcher des données accessibles côté serveur.
- ❌ Jamais exposer une clé secrète à un Client Component (préfixe `NEXT_PUBLIC_` = public assumé).
- ❌ Jamais définir des tokens de design, des classes utilitaires de style ou des animations (→ `flo-ui`).
- ❌ Jamais écrire le *contenu* SEO d'une page (→ `flo-seo`).

## 🥇 Priorité
Niveau **3**. Cède devant supabase et dev-standards. Tranche sur les questions de rendu/routing face à offline, ui et seo (ex. : une exigence de présentation ne justifie pas de casser la frontière Server/Client).

## 🔗 Interactions
- **Consomme** `flo-supabase` pour les données (appelle les helpers, n'écrit pas les policies).
- **Héberge** les composants de `flo-ui` et **branche** la metadata de `flo-seo`.
- **Applique** `flo-dev-standards` pour typage/archi/erreurs.
- **Obéit** à `flo-supabase` quand une route touche des données protégées (auth requise, no-cache).
