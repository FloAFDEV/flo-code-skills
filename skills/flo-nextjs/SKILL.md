---
name: flo-nextjs
version: 2.1.0
description: Règles Next.js 15+ (App Router). À activer pour routes, layouts, Server/Client Components, data fetching serveur, caching/revalidation, Server Actions, next/image, next/font, middleware et configuration de rendu. Possède la mécanique de l'API Metadata (pas son contenu, qui appartient à flo-seo).
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

## Objectif

Concevoir et implémenter correctement les routes, le rendu et la performance d'une application Next.js 15+ avec l'App Router. S'active pour toute décision sur les routes, les composants (Server vs Client), le data fetching, le cache, les Server Actions ou la configuration de build.

## Périmètre

**Possède :** App Router (`app/`, layouts, route groups, fichiers spéciaux `loading`/`error`/`not-found`), décision Server vs Client Component et sa frontière, data fetching serveur et stratégies de cache, Server Actions, optimisations natives (`next/image`, `next/font`, `next/dynamic`), middleware, performance Next.js, mécanique de l'API Metadata (`generateMetadata`).

**Délègue :** contenu des metadata, OG, JSON-LD → `flo-seo` · style, composants, tokens → `flo-ui` · RLS et requêtes data → `flo-supabase` · conventions de code générales → `flo-dev-standards` · diagnostic de bug ou de problème de performance runtime → `flo-debug`.

## Contraintes

**Server vs Client :** Server Component par défaut. `'use client'` uniquement si state, effets, événements navigateur ou API browser — jamais sur un layout ou une page entière pour contourner une erreur. Ne jamais passer de secret, fonction non-sérialisable ou instance serveur en prop à un Client Component.

**Cache :** chaque data fetch a une stratégie de cache documentée et intentionnelle (statique, `revalidate: N`, `no-store`). Laisser Next décider par défaut sans intention consciente est une erreur de conception.

**Server Actions :** toute Server Action valide ses entrées (Zod) et vérifie l'autorisation côté serveur — jamais de confiance dans le payload client. Après mutation : `revalidatePath`/`revalidateTag` ciblé.

**Build :** ne jamais désactiver les vérifications TypeScript ou ESLint dans `next.config`.

**Analytics (Umami) :** quand un projet intègre Umami (défaut recommandé par `flo-dev-standards`, qui fixe le choix — pas la mécanique), le script de suivi se charge via `next/script` dans le layout racine, jamais derrière un `'use client'` dédié pour ce seul besoin. L'identifiant de site vient d'une variable d'environnement publique (`NEXT_PUBLIC_UMAMI_WEBSITE_ID`) — jamais codé en dur ; ce n'est pas un secret (identifiant public), mais il reste piloté par variable d'environnement comme tout paramètre d'intégration tierce. Activation en production uniquement : variable absente en développement = script absent, pas de condition supplémentaire à écrire. Si le projet instrumente des événements/objectifs personnalisés, ils restent déclenchés côté client au moment de l'interaction, sans dupliquer une logique métier serveur — même principe que n'importe quel script tiers, pas un cas spécial.

**Exception offline-first (assumée) :** les lectures depuis le store IndexedDB côté client relèvent de `flo-offline` et ne violent pas « Server Component par défaut » — c'est une exception documentée propre à cette architecture.

## Autorité

Niveau 4. Cède devant `flo-medical`, `flo-supabase`, `flo-dev-standards`. Tranche sur le rendu et le routing face à `flo-offline`, `flo-ui` et `flo-seo`.

## Définition de terminé

Toutes les routes utilisent l'App Router. Les stratégies de cache sont documentées et intentionnelles. Aucun secret ne transite vers un Client Component. Les Server Actions valident et autorisent côté serveur. Si Umami est intégré, il l'est via `next/script` dans le layout racine, avec son identifiant de site en variable d'environnement.

## Références

Consomme `flo-supabase` pour les données. Héberge les composants de `flo-ui`. Branche la metadata de `flo-seo`. Applique `flo-dev-standards`. Se coordonne avec `flo-offline` pour les lectures locales (exception client-side assumée).
