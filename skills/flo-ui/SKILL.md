---
name: flo-ui
description: Design system implicite et qualité d'interface premium. À activer pour tout travail visuel — composants, design tokens, conventions Tailwind, micro-interactions, hover/transitions, animations, patterns de CTA, états visuels (loading/empty/error) et accessibilité. Possède le STYLE et l'INTERACTION, jamais le rendu serveur/client ni la sémantique SEO.
---

# flo-ui

> À quoi ça ressemble et comment ça réagit. Premium, cohérent, accessible.

## 🎯 Scope
- **Design tokens** implicites (couleurs, espacements, rayons, ombres, typo) et conventions **Tailwind**.
- **Composants** d'interface et leurs variantes/états.
- **Micro-interactions** : hover, focus, press, transitions, animations.
- **Patterns de CTA** et hiérarchie visuelle.
- **États visuels** : loading (skeleton), empty, error, success.
- **Accessibilité** : ARIA, focus, contraste, navigation clavier.

## 🚫 Hors-scope (délégué)
- **Server vs Client Component, `next/image`/`next/font`** → `flo-nextjs` (ui style le composant, nextjs décide du rendu).
- **Sémantique pour le SEO, alt textuel orienté indexation, headings pour le crawl** → `flo-seo` (partage du DOM, frontière nette).
- **Typage des props, archi** → `flo-dev-standards`.
- **Statut de synchro** → fourni par `flo-offline`, rendu par ui.

## ✅ Règles strictes

### Design system & Tailwind
1. **Tokens, jamais de valeurs magiques** : couleurs, espacements et typo viennent de l'échelle du thème (CSS vars / config Tailwind). Pas de `#hex` ni de `13px` arbitraire dans le markup.
2. Utiliser les classes Tailwind via l'échelle du thème ; extraire en composant dès qu'un pattern de classes se répète (pas de copier-coller de longues listes de classes).
3. Cohérence : un seul système d'espacement, de rayons et d'ombres pour toute l'app.

### Micro-interactions & animation
4. Tout élément interactif a des états **hover / focus-visible / active / disabled** visuellement distincts.
5. Transitions **courtes et fonctionnelles** (~150–250 ms, easing standard) ; on anime `transform`/`opacity`, pas `width`/`top` (perf).
6. Animation au service du sens (feedback, continuité), jamais décorative gratuite. **Respecter `prefers-reduced-motion`** : fournir une alternative sobre.
7. Feedback immédiat sur action (press, optimistic) — l'UI ne paraît jamais figée.

### États & CTA
8. Tout écran de données gère **les 4 états** : loading (skeleton, pas spinner nu), empty (message + action), error (message clair + retry), success/contenu.
9. **Un CTA primaire unique** par vue ; hiérarchie claire primary/secondary/tertiary. Le CTA dit l'action (« Enregistrer le patient »), pas « OK ».
10. Cibles tactiles ≥ 44×44px ; espacement suffisant entre actions.

### Accessibilité (non négociable)
11. HTML sémantique d'abord ; ARIA seulement pour combler un manque, jamais en doublon.
12. **Focus visible** toujours présent (jamais `outline: none` sans remplacement). Navigation clavier complète, ordre logique, pièges à focus gérés (modales).
13. Contraste **WCAG AA** minimum (4.5:1 texte courant). Information jamais portée par la seule couleur.
14. Images décoratives `alt=""` ; champs de formulaire avec `label` associé ; live regions pour les messages asynchrones.

## ⛔ Anti-règles (jamais)
- ❌ Jamais décider du Server/Client Component ni du choix d'image/police (→ `flo-nextjs`).
- ❌ Jamais écrire de `alt`/`title`/heading dans un but d'indexation (→ `flo-seo` ; ui assure l'accessibilité, seo la découvrabilité).
- ❌ Jamais de valeur de couleur/espacement en dur hors du système de tokens.
- ❌ Jamais d'animation ignorant `prefers-reduced-motion`.
- ❌ Jamais supprimer le focus visible sans alternative équivalente.
- ❌ Jamais un état de données sans gérer loading/empty/error.

## 🥇 Priorité
Niveau **6**. Cède devant tous les skills de données/sécurité/framework. Prime uniquement sur `flo-seo` pour les questions purement visuelles — mais l'accessibilité (a11y) ne se sacrifie jamais au profit du SEO ou de l'esthétique.

## 🔗 Interactions
- **Vit dans** les composants hébergés par `flo-nextjs`.
- **Partage le DOM** avec `flo-seo` : ui = style + interaction + a11y ; seo = sémantique d'indexation + metadata. Frontière : un `alt` « utile à l'humain » = ui/a11y ; optimisé mots-clés = seo.
- **Consomme** le statut de `flo-offline` pour afficher online/syncing/conflict.
- **Applique** `flo-dev-standards` (typage des props, composants découpés).
