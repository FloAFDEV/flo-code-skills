---
name: flo-art-direction
version: 1.0.0
description: Direction artistique frontend des projets perso/vitrines — méthode pour décider hiérarchie visuelle, typographie, échelle d'espacement, grille, couleurs, profondeur, surfaces, rythme entre sections, hero, CTA, cards, navigation, footer, mobile. Couche créative OPT-IN — n'activer que si le projet déclare flo-creative-frontend ou sur demande explicite de direction artistique. N'impose aucun style : la direction déclarée par le projet prime toujours.
owns:
  - art-direction
  - visual-composition
  - visual-rhythm
  - section-visual-transitions
excludes:
  - design-tokens
  - design-system
  - screen-structure
  - visual-critique
  - accessibility
---

# flo-art-direction

> Des principes et une méthode, pas un style maison.

## Objectif

Produire une direction visuelle **cohérente et argumentée** pour un projet où la couche créative est
active : décisions écrites, traduites ensuite en tokens par `flo-ui`, auditées par `design-taste`.

## Quand le projet a déjà une direction

`.flo/creative-frontend.md`, un thème/design system existant, une app existante ou une référence Lovable
**sont** la direction. Ce skill ne fait alors que : relever ce qui existe (tokens, typo, rayons, ombres,
composants), l'étendre aux nouvelles surfaces sans le contredire, et signaler les incohérences.
Jamais de nouvelle palette, police ou rayon si le projet en a déjà.

## Méthode (CRÉATION ou extension)

1. **Intention** : une phrase (« un outil d'audit sérieux qui se révèle simple »). Toute décision s'y rapporte.
2. **Inventaire** : tokens et composants existants (`flo-ui`) — on compose avec eux d'abord.
3. **Échelles** : typo modulaire (ratio 1.2–1.333, 2 familles max, 3 graisses utiles), espacement 4/8,
   rayons cohérents par niveau (contrôle < card < surface), ombres en 2–3 niveaux de profondeur.
4. **Rythme** : alterner densité (sections denses / respirantes), largeur (texte ≤ 70ch, visuels pleins),
   fonds (2 surfaces max en alternance). Une section = une idée, un point focal.
5. **Hiérarchie** : 1 élément dominant par vue (taille, contraste, position) ; 1 CTA primaire par vue
   (décidé avec `frontend-design`) ; le reste en secondaire/tertiaire.
6. **Transitions de sections** : continuité par la grille, le fond ou un élément porteur ; pas de
   séparateurs décoratifs. Mouvement éventuel → `flo-motion`.
7. **Mobile d'abord pensé, pas déduit** : ordre de lecture, tailles tactiles, visuels recadrés plutôt que
   réduits illisiblement.

Grilles de décision par type de section : [`references/sections.md`](./references/sections.md).

## Règles strictes

1. Direction projet > référence > ce skill (priorité : `flo-creative-frontend`).
2. Toute valeur décidée devient un token nommé via `flo-ui` — jamais de valeur magique.
3. Contraste AA et focus visibles sont des contraintes d'entrée, pas des retouches (`flo-ui`).
4. Montrer le vrai produit / vrai contenu plutôt qu'illustrations génériques.

## Anti-patterns

Style « template SaaS » plaqué sur un produit qui a déjà une identité · dégradés et glow sans fonction ·
grille de cards identiques · 3 polices · espacements non multiples · section hero qui ne dit pas ce que
fait le produit · badges décoratifs.

## Autorité

Couche opt-in, niveau 7a (sous `frontend-design` pour la structure et `flo-ui` pour a11y/tokens ;
au-dessus de `design-taste`, qui audite **contre** la direction décidée ici).

## Définition de terminé

Intention écrite. Décisions (typo, espacement, surfaces, profondeur, rythme) listées avec leur raison,
mappées sur des tokens existants ou nouveaux. Desktop et mobile décrits.
