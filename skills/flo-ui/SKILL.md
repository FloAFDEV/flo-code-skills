---
name: flo-ui
version: 1.0.0
description: Implémentation de l'interface — transforme les recommandations de frontend-design en code réel. À activer pour composants, Tailwind, responsive, accessibilité, animations, micro-interactions, design system, tokens et patterns d'interface. Possède le COMMENT (le code), pas la structure (frontend-design) ni le jugement esthétique (design-taste).
owns:
  - ui-components
  - tailwind
  - responsive
  - accessibility
  - animations
  - micro-interactions
  - design-system
  - design-tokens
  - interface-patterns
excludes:
  - screen-structure
  - information-architecture
  - perceived-quality-audit
  - ai-artifact-detection
  - metadata-content
  - server-components
---

# flo-ui

> Phase BUILD. Transforme la structure décidée en interface réelle : premium, cohérente, accessible.

## ▶️ When To Invoke
- **Implémenter** un composant, une variante, un état visuel.
- Écrire du **Tailwind**, définir/étendre le **design system** et les **tokens**.
- Gérer le **responsive**, l'**accessibilité**, les **animations** et **micro-interactions**.
- Réaliser en code la **hiérarchie** décidée par `frontend-design`.

## ⏹️ When NOT To Invoke
- Décider *quoi* mettre à l'écran, l'IA, les parcours → `frontend-design`.
- Juger si le rendu est « beau »/« template »/« IA » → `design-taste`.
- Server/Client Component, `next/image` → `flo-nextjs`.
- `alt`/headings orientés indexation → `flo-seo`.

## 🎯 Scope (responsabilités)
- **Composants** d'interface et leurs variantes/états ; **patterns d'interface** réutilisables.
- **Tailwind** et **design system** / **tokens** (couleurs, espacements, rayons, ombres, typo).
- **Responsive** (mobile-first, breakpoints).
- **Accessibilité** : ARIA, focus, contraste, navigation clavier.
- **Animations** et **micro-interactions** (implémentation).
- **Ergonomie d'implémentation** : réaliser en code la hiérarchie d'intention reçue.

## 🚫 Hors-scope (délégué)
- **Structure d'écran, IA, parcours, hiérarchie (intention)** → `frontend-design`.
- **Jugement de qualité perçue, détection « IA/template »** → `design-taste`.
- **Server/Client, `next/image`/`next/font`** → `flo-nextjs`.
- **Sémantique d'indexation, `alt` SEO, headings crawl** → `flo-seo`.
- **Typage des props, archi** → `flo-dev-standards`. **Statut de synchro** → `flo-offline` (ui le rend).

## ✅ Règles strictes

### Design system & Tailwind
1. **Tokens, jamais de valeurs magiques** : couleurs/espacements/typo viennent de l'échelle du thème. Pas de `#hex` ni de `13px` arbitraire.
2. Extraire en composant dès qu'un pattern de classes se répète.
3. Un seul système d'espacement, de rayons et d'ombres pour toute l'app.
4. **Responsive mobile-first** ; pas de breakpoint magique, on suit l'échelle.

### Micro-interactions & animation
5. Tout élément interactif a des états **hover / focus-visible / active / disabled** distincts.
6. Transitions **courtes et fonctionnelles** (~150–250 ms) ; animer `transform`/`opacity`, pas `width`/`top`.
7. Animation au service du sens, jamais décorative gratuite. **Respecter `prefers-reduced-motion`**.
8. Feedback immédiat sur action (press, optimistic).

### États & CTA
9. Tout écran de données gère **les 4 états** : loading (skeleton), empty (message + action), error (message + retry), success.
10. Implémenter la hiérarchie d'action **décidée par `frontend-design`** (1 primaire/vue) en variantes primary/secondary/tertiary ; le libellé dit l'action.
11. Cibles tactiles ≥ 44×44px.

### Accessibilité (non négociable)
12. HTML sémantique d'abord ; ARIA seulement pour combler un manque.
13. **Focus visible** toujours présent. Navigation clavier complète, pièges à focus gérés.
14. Contraste **WCAG AA** (4.5:1). Information jamais portée par la seule couleur.
15. Images décoratives `alt=""` ; `label` associé aux champs ; live regions pour l'asynchrone.

## ⛔ Anti-règles (jamais)
- ❌ Jamais décider de la structure d'écran, de l'IA ou des parcours (→ `frontend-design`).
- ❌ Jamais juger la qualité perçue de son propre rendu ni le « look IA » (→ `design-taste`).
- ❌ Jamais décider du Server/Client Component ni du choix d'image/police (→ `flo-nextjs`).
- ❌ Jamais écrire de `alt`/`title`/heading dans un but d'indexation (→ `flo-seo`).
- ❌ Jamais de couleur/espacement en dur hors tokens, ni d'animation ignorant `prefers-reduced-motion`.
- ❌ Jamais supprimer le focus visible, ni un état de données sans loading/empty/error.

## 🥇 Priorité
Niveau **7**. Cède devant données/sécurité/framework et devant `frontend-design` (structure). Prime sur `flo-seo` pour le visuel. Son **a11y est non négociable** : même `design-taste` s'incline devant elle.

## 🔗 Interactions
- **Reçoit** de `frontend-design` structure, hiérarchie d'intention et patterns.
- **Audité par** `design-taste` (qui renvoie ses corrections à ui).
- **Validé par** `playwright`.
- **Vit dans** les composants hébergés par `flo-nextjs` ; **partage le DOM** avec `flo-seo`.
- **Consomme** le statut de `flo-offline` ; **applique** `flo-dev-standards`.
