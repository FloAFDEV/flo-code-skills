---
name: flo-dev-standards
description: Socle universel de qualité de code, valable sur TOUS les projets (Next.js, Vite/React, Node, scripts). À activer pour toute écriture ou revue de code TypeScript/JavaScript — typage strict, architecture des dossiers, nommage, gestion d'erreurs, conventions Git, refactoring, sécurité du code et tests unitaires. Ne contient AUCUNE règle spécifique à un framework.
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

## ▶️ When To Invoke
- Écrire ou relire **n'importe quel** code TS/JS (composant, fonction, action, script).
- Décider de l'**arborescence**, du nommage, du découpage d'un module.
- Définir un **pattern d'erreur**, un type partagé, un `Result`.
- Faire une **revue de code** ou un refactoring.
- Écrire des **tests unitaires** / de logique pure.

## ⏹️ When NOT To Invoke
- Choix de rendu/routing → `flo-nextjs`.
- Accès données, RLS, secrets → `flo-supabase`.
- Style, composants, tokens → `flo-ui`.
- Tests E2E/parcours → `playwright` (ici = unitaire seulement).
- Décisions de structure d'écran/UX → `frontend-design`.

## 🎯 Scope (responsabilités)
- Configuration **TypeScript strict** et discipline de typage.
- **Architecture** du code et **arborescence** des dossiers, conventions de **nommage**.
- **Gestion d'erreurs** générique (pattern, propagation, logging).
- **Refactoring**, **conventions de projet**, **conventions Git**.
- **Sécurité du code** : validation des entrées, secrets en config, pas d'injection.
- **Revue de code** et **tests unitaires** / logique pure.

## 🚫 Hors-scope (délégué)
- **Rendu / routing** → `flo-nextjs`. **Accès données & sécurité d'accès** → `flo-supabase`.
- **Style, composants, animations, tokens** → `flo-ui`. **Persistance locale** → `flo-offline`.
- **Metadata/SEO** → `flo-seo`. **Conformité santé** → `flo-medical`.
- **Structure/UX d'écran** → `frontend-design`. **Audit visuel** → `design-taste`. **E2E** → `playwright`.

## ✅ Règles strictes

### TypeScript
1. `strict: true` obligatoire + `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`.
2. **`any` interdit.** Utiliser `unknown` + narrowing, ou un type précis. `// @ts-ignore` interdit (`@ts-expect-error` + commentaire justifié uniquement).
3. Préférer `type` pour les unions/compositions, `interface` pour les contrats d'objet extensibles.
4. Pas d'assertion `as` sauf à une frontière typée (parsing) — préférer un validateur (Zod) qui *produit* le type.
5. Données externes (API, formulaire, env) → **validées au runtime** avant usage. `process.env` via un module `env.ts` typé et validé.

### Architecture & nommage
6. **Feature-first**, pas type-first : regrouper par domaine métier plutôt que par nature. Le partagé vit dans `shared/` ou `lib/`.
7. Nommage : `PascalCase` composants/types, `camelCase` variables/fonctions, `SCREAMING_SNAKE` constantes, `kebab-case` fichiers non-composants.
8. Une responsabilité par fichier. Au-delà de ~200 lignes ou >1 export majeur, **scinder**.
9. Imports absolus via alias (`@/…`). Pas de `../../../`. Barrels uniquement pour une API publique de feature.

### Gestion d'erreurs
10. Erreurs **typées et explicites**. Logique métier faillible → `Result<T, E>` plutôt que `throw`. `throw` réservé à l'irrécupérable.
11. **Jamais de `catch` vide ni de catch qui avale.** On logge avec contexte *ou* on remonte.
12. Pas de secret, PII ni stack interne dans un message d'erreur exposé au client.

### Discipline & sécurité du code
13. **Immutabilité par défaut** : `const`, pas de mutation de paramètres, `readonly` sur le partagé.
14. Fonctions courtes et pures quand c'est possible ; effets de bord isolés.
15. Code mort, imports inutilisés, `console.log` de debug → supprimés avant commit.
16. Sécurité du code : valider/échapper toute entrée, jamais de secret en dur, pas de `eval`/injection.

### Git & refactoring
17. Commits **atomiques**, impératif présent, Conventional Commits.
18. **Un refactoring ne change pas le comportement** et voyage dans son propre commit.
19. Avant d'ajouter du code : chercher l'existant à réutiliser.

## ⛔ Anti-règles (jamais)
- ❌ Jamais introduire une règle liée à un framework précis — ça appartient au skill du framework.
- ❌ Jamais imposer un choix de style/visuel — c'est `flo-ui`.
- ❌ Jamais désactiver `strict` ni élargir `any` « pour gagner du temps ».
- ❌ Jamais committer du code commenté « au cas où ».

## 🥇 Priorité
Niveau **3**. Cède devant `flo-medical` (conformité) et `flo-supabase` (sécurité d'accès) ; prime sur tout le reste sur les questions de **correction du code**.

## 🔗 Interactions
- **Consulté par tous** les autres skills (typage, archi, erreurs).
- Ne consulte personne : plus bas niveau, agnostique.
- Quand un autre skill a besoin d'une convention de code, il **applique** ces règles sans les redéfinir.
