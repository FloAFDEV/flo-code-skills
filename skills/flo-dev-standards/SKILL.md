---
name: flo-dev-standards
description: Socle universel de qualité de code, valable sur TOUS les projets (Next.js, Vite/React, Node, scripts). À activer pour toute écriture ou revue de code TypeScript/JavaScript — typage strict, architecture des dossiers, nommage, gestion d'erreurs, conventions Git et règles de refactoring. Ne contient AUCUNE règle spécifique à un framework.
---

# flo-dev-standards

> Le socle. Tout autre skill s'appuie dessus ; lui ne dépend de personne.

## 🎯 Scope
- Configuration **TypeScript strict** et discipline de typage.
- **Arborescence** des dossiers et conventions de **nommage**.
- **Gestion d'erreurs** générique (pattern, propagation, logging).
- **Conventions Git** (branches, commits) et **règles de refactoring**.
- Qualité transverse : lisibilité, fonctions pures, immutabilité, tests.

## 🚫 Hors-scope (délégué)
- Tout ce qui touche au **rendu / routing** → `flo-nextjs`.
- **Accès données & sécurité** → `flo-supabase`.
- **Style, composants visuels, animations** → `flo-ui`.
- **Persistance locale** → `flo-offline`.
- **Metadata/SEO** → `flo-seo`.

## ✅ Règles strictes

### TypeScript
1. `strict: true` obligatoire + `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`.
2. **`any` interdit.** Utiliser `unknown` + narrowing, ou un type précis. `// @ts-ignore` interdit (`@ts-expect-error` + commentaire justifié uniquement).
3. Préférer `type` pour les unions/compositions, `interface` pour les contrats d'objet extensibles.
4. Pas d'assertion `as` sauf à une frontière typée (parsing) — préférer un validateur (Zod) qui *produit* le type.
5. Données externes (API, formulaire, env) → **validées au runtime** avant usage. `process.env` accédé via un module `env.ts` typé et validé.

### Architecture & nommage
6. **Feature-first**, pas type-first : regrouper par domaine métier (`features/patients/…`) plutôt que par nature (`components/`, `hooks/` globaux). Le partagé vit dans `shared/` ou `lib/`.
7. Nommage : `PascalCase` composants/types, `camelCase` variables/fonctions, `SCREAMING_SNAKE` constantes, `kebab-case` fichiers non-composants. Fichier de composant = nom du composant.
8. Une responsabilité par fichier. Au-delà de ~200 lignes ou >1 export majeur, **scinder**.
9. Imports absolus via alias (`@/…`). Pas de `../../../`. Barrels (`index.ts`) uniquement pour une API publique de feature, jamais pour contourner les cycles.

### Gestion d'erreurs
10. Erreurs **typées et explicites**. Pour la logique métier faillible, retourner un `Result<T, E>` (`{ ok: true, data } | { ok: false, error }`) plutôt que `throw`. `throw` réservé à l'exceptionnel/irrécupérable.
11. **Jamais de `catch` vide ni de catch qui avale.** On logge avec contexte *ou* on remonte. Jamais les deux silencieusement.
12. Pas de secret, PII ni stack interne dans un message d'erreur exposé au client.

### Discipline générale
13. **Immutabilité par défaut** : `const`, pas de mutation de paramètres, `readonly` sur les structures partagées.
14. Fonctions courtes et pures quand c'est possible ; effets de bord isolés et nommés.
15. Code mort, imports inutilisés, `console.log` de debug → supprimés avant commit.

### Git & refactoring
16. Commits **atomiques**, impératif présent (`add`, `fix`, `refactor`), format Conventional Commits.
17. **Un refactoring ne change pas le comportement** et voyage dans son propre commit, séparé des changements fonctionnels.
18. Avant d'ajouter du code : chercher l'existant à réutiliser. La duplication est un signal de refactoring, pas une fatalité.

## ⛔ Anti-règles (jamais)
- ❌ Jamais introduire une règle liée à un framework précis (Next, React Router, etc.) — ça appartient au skill du framework.
- ❌ Jamais imposer un choix de style/visuel (couleurs, espacements) — c'est `flo-ui`.
- ❌ Jamais désactiver `strict` ni élargir `any` « pour gagner du temps ».
- ❌ Jamais committer du code commenté « au cas où » : git est l'historique.

## 🥇 Priorité
Niveau **2** dans la hiérarchie. Cède devant `flo-supabase` (sécurité d'accès), prime sur tout le reste sur les questions de **correction du code**.

## 🔗 Interactions
- **Consulté par tous** les autres skills (typage, archi, erreurs).
- Ne consulte personne : il est le plus bas niveau et reste agnostique.
- Quand un autre skill a besoin d'une convention de code, il **applique** ces règles sans les redéfinir.
