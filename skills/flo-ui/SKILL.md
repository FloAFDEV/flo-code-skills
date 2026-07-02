---
name: flo-ui
version: 2.0.0
description: Implémentation de l'interface — transforme les recommandations de frontend-design en code réel. À activer pour composants, Tailwind, responsive, accessibilité, animations, micro-interactions, design system et tokens. Possède le COMMENT (le code), pas la structure (frontend-design) ni le jugement esthétique (design-taste).
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

## Objectif

Implémenter en code l'interface définie par `frontend-design` — composants, design system, tokens, responsive, accessibilité, animations et états de données. S'active pour tout travail sur les composants React, le système Tailwind, ou la réalisation de la hiérarchie visuelle.

## Périmètre

**Possède :** composants et leurs variantes/états, design system et tokens (couleurs, espacements, rayons, ombres, typographie), responsive mobile-first, accessibilité (ARIA, focus, contraste, navigation clavier), animations et micro-interactions, patterns d'interface réutilisables.

**Délègue :** décision de structure d'écran, architecture d'information et parcours → `frontend-design` · jugement de qualité perçue et détection d'artefacts IA → `design-taste` · Server/Client Component, `next/image`/`next/font` → `flo-nextjs` · sémantique d'indexation, `alt` SEO et headings de crawl → `flo-seo` · typage des props et architecture → `flo-dev-standards`.

## Contraintes

**Tokens (non négociable) :** toutes les valeurs de couleur, espacement et typographie viennent du thème Tailwind. Jamais de `#hex`, de valeur numérique arbitraire, ou de classe `[...]` hors de l'échelle définie.

**4 états obligatoires :** tout écran de données implémente loading (skeleton), empty (message + action), error (message + retry), success. Aucun état supprimé pour aller plus vite.

**Accessibilité (non négociable) :**
- Focus visible toujours présent — jamais retiré.
- Contraste WCAG AA minimum (4.5:1 texte, 3:1 UI). Information jamais portée par la seule couleur.
- Cibles tactiles ≥ 44×44px.
- `prefers-reduced-motion` respecté sur toutes les animations sans exception.

**Animations :** au service du sens, jamais décoratives gratuites. Animer `transform`/`opacity`, pas les propriétés qui déclenchent le layout (`width`, `top`, `left`).

**Hiérarchie des CTA :** une seule action primaire par vue — décidée par `frontend-design`, implémentée en variantes primary/secondary/tertiary. Le libellé décrit l'action, pas l'état.

## Autorité

Niveau 7. Cède devant données/sécurité/framework et devant `frontend-design` (structure). Prime sur `flo-seo` pour tout ce qui concerne le visuel. Son a11y est non négociable — même `design-taste` s'incline devant elle.

## Définition de terminé

Tous les composants utilisent des tokens du thème. Les 4 états de données sont implémentés. Le focus est toujours visible. Les contrastes respectent WCAG AA. `prefers-reduced-motion` est respecté partout.

## Références

Reçoit de `frontend-design` la structure, la hiérarchie d'intention et les patterns. Audité par `design-taste` qui renvoie ses corrections ici. Validé par `playwright`. Hébergé par `flo-nextjs`. Consomme le statut de synchro de `flo-offline`. Applique `flo-dev-standards`.
