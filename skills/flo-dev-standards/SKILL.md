---
name: flo-dev-standards
version: 2.0.0
description: Socle universel de qualité de code pour tous les projets (Next.js, Vite/React, Node, scripts). À activer pour toute écriture ou revue de code TypeScript/JavaScript — typage strict, architecture des dossiers, gestion d'erreurs, sécurité du code et tests unitaires. Aucune règle spécifique à un framework.
owns:
  - typescript-strict
  - code-architecture
  - folder-structure
  - error-handling
  - refactoring
  - project-conventions
  - code-security
  - code-review
  - unit-testing
excludes:
  - server-components
  - data-access-security
  - design-tokens
  - cache-strategies
  - metadata-content
---

# flo-dev-standards

> Le socle. Tout autre skill s'appuie dessus ; lui ne dépend de personne.

## Objectif

Garantir la correction, la lisibilité et la sécurité du code TypeScript/JavaScript sur l'ensemble du projet, indépendamment du framework. S'applique à toute écriture ou revue de code, à toute décision d'architecture de dossiers ou de nommage, à la définition de patterns d'erreur et aux tests unitaires.

## Périmètre

**Possède :** configuration TypeScript strict, architecture et arborescence (feature-first), conventions de nommage, gestion d'erreurs générique (`Result<T, E>`), sécurité du code (validation, injection, secrets), revue de code, tests unitaires / logique pure.

**Délègue :** rendu/routing → `flo-nextjs` · accès données et sécurité d'accès → `flo-supabase` · style, composants, tokens → `flo-ui` · persistance locale → `flo-offline` · metadata/SEO → `flo-seo` · conformité santé → `flo-medical` · structure/UX → `frontend-design` · diagnostic runtime → `flo-debug` · audit global → `flo-project-audit`.

## Contraintes

**TypeScript :** `strict: true` obligatoire avec `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`. `any` interdit — `unknown` + narrowing. `@ts-ignore` interdit (`@ts-expect-error` avec justification uniquement). Données externes (API, formulaires, `process.env`) validées au runtime avant usage — via Zod ou équivalent, jamais par cast.

**Architecture :** organisation feature-first (par domaine métier, pas par nature de fichier). Imports absolus via alias `@/` — pas de chemins relatifs profonds. Barrels (`index.ts`) uniquement pour l'API publique d'une feature, jamais pour éviter de chercher un fichier.

**Gestion d'erreurs :** logique métier faillible → `Result<T, E>`, pas de `throw`. `throw` réservé à l'irrécupérable (bug de programmation, état impossible). Jamais de `catch` vide ni qui avale silencieusement. Jamais de secret, PII ou stack trace interne dans un message d'erreur exposé au client.

**Sécurité du code :** valider et échapper toute entrée externe au point d'entrée. Jamais de secret en dur. Jamais d'`eval` ni d'injection de commande.

## Autorité

Niveau 3. Cède devant `flo-medical` (conformité) et `flo-supabase` (sécurité d'accès). Prime sur tout le reste pour les questions de correction et de qualité du code.

## Définition de terminé

Le code compile en mode `strict` sans `any` ni `@ts-ignore` non justifié. Les erreurs sont typées et propagées explicitement. Aucun secret en dur. Les données externes sont validées au point d'entrée.

## Références

Consulté par tous les autres skills pour typage, architecture et patterns d'erreur. Ne consulte personne — agnostique du framework par construction.
