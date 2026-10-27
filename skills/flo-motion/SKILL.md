---
name: flo-motion
version: 1.0.0
description: Mise en mouvement avancée avec Motion (ex-Framer Motion) et CSS — choix de technique, animations au scroll (useScroll/useTransform, sticky storytelling, parallax), whileInView/stagger, chorégraphie de workflow, transitions de sections et de pages, budget perf. Agnostique de la stack (React, Astro, vanilla). Couche créative OPT-IN — n'activer que si le projet déclare flo-creative-frontend ou si l'utilisateur demande explicitement ce type d'animation. Les règles de base des animations (transform/opacity, reduced-motion) restent à flo-ui.
owns:
  - motion-choreography
  - motion-technique-selection
  - scroll-driven-motion
  - page-transitions
  - motion-language
excludes:
  - animations
  - micro-interactions
  - accessibility
  - client-components
  - perceived-quality-audit
---

# flo-motion

> Le mouvement explique (ordre, cause, progression, focus) ou il disparaît.

## Objectif

Décider **quelle** technique de mouvement sert une intention, puis l'implémenter proprement :
lisible, interruptible, performante, respectueuse de `prefers-reduced-motion`. S'active dans un
projet où `flo-creative-frontend` est actif, ou sur demande explicite (scroll storytelling, Motion…).

## Arbre de décision (dans l'ordre — s'arrêter au premier qui suffit)

1. **Faut-il bouger ?** Si le mouvement n'explique rien (ordre, relation, état, progression) → rien.
2. **Hover / focus / press** → CSS `transition` (flo-ui). Motion seulement si spring ou geste.
3. **Entrée à l'apparition** → `whileInView` + `viewport={{ once: true, amount }}`, stagger par variants.
   Zéro JS possible : CSS `animation-timeline: view()` derrière `@supports`.
4. **Valeur liée au scroll** (progression, parallax, zoom) → `useScroll({ target, offset })` +
   `useTransform` (+ `useSpring` léger si saccadé). Jamais `scroll` listener + `setState`.
5. **Récit en étapes** (workflow, produit) → **sticky storytelling** : piste haute + scène `sticky`,
   l'étape active dérivée de `scrollYProgress` (`useMotionValueEvent`), transitions *déclenchées*
   (AnimatePresence) plutôt que *scrubbées* pour le contenu lisible. Voir `references/scroll-storytelling.md`.
6. **Changement de layout / état** → `layout`, `layoutId`, `AnimatePresence mode="popLayout"|"wait"`.
7. **Transition de page** → View Transitions selon la stack (CSS `::view-transition-*` ; Astro `<ClientRouter />` ;
   Next `experimental.viewTransition`) ; Motion `AnimatePresence` en SPA React. Sinon animation d'entrée seule.
8. **Timeline complexe impérative** → `animate()` séquence Motion ; GSAP seulement s'il est déjà dans le projet.

Détail des recettes : [`references/techniques.md`](./references/techniques.md).

## Règles strictes

1. Respecter la stack du projet (détection : `flo-creative-frontend`) — jamais de migration :
   - **Vite + React (SPA)** : `motion/react` dans les composants existants, architecture inchangée.
   - **Next.js** : composants animés = Client Components (`"use client"` ou `motion/react-client`), frontière décidée par `flo-nextjs`.
   - **Astro** : d'abord CSS (transitions, `animation-timeline: view()`) ou l'API vanilla de `motion`
     (`animate`, `scroll`, `inView` depuis `"motion"`) dans un `<script>` ; un îlot React `client:visible`
     seulement si l'interaction l'exige. Transitions de page : `<ClientRouter />` (View Transitions Astro).
   - **Autre** : CSS ou API vanilla `motion`.
   Package : `motion` (`framer-motion` = ancien nom : ne pas l'ajouter s'il est absent, ne pas migrer s'il est présent sans demande).
   Une librairie d'animation déjà présente (GSAP…) et une règle projet sur son usage priment.
2. Animer `transform`, `opacity`, `filter` (léger), `clip-path`. Jamais `width/height/top/left` en boucle de scroll.
3. Reduced motion : `<MotionConfig reducedMotion="user">` au niveau de la surface **et** une version
   statique lisible des scènes scroll (toutes les étapes visibles, sans pin). Tester les deux.
4. Contenu lisible jamais conditionné à l'animation : sans JS / avant hydratation, le texte est visible
   (pas d'`initial={{ opacity: 0 }}` sur un H1 / LCP).
5. Durées : micro 120–200 ms, UI 200–350 ms, scène 400–700 ms. Easing sortie `[0.22, 1, 0.36, 1]`
   ou spring `{ type: "spring", bounce: 0–0.2 }`. Les valeurs du projet (`.flo/creative-frontend.md`) priment.
6. Un seul « moment fort » par écran. Le reste : discret.
7. Mobile : pas de parallax multi-couches ni de pin long ; sticky raccourci ou séquence verticale.
   `useScroll` sur cible, jamais sur `window` pour une section.
8. Budget : bundle via `LazyMotion` + `m` + `domAnimation` si Motion n'est utilisé que sur une surface ;
   aucune animation infinie hors écran ; `will-change` posé seulement pendant l'animation.

## Anti-patterns

Fade-up identique sur chaque bloc · parallax décoratif · scroll-jacking (vitesse ou snap imposés) ·
texte scrubbé illisible à mi-course · animation qui retarde l'accès au CTA · état final différent
selon la vitesse de scroll · `AnimatePresence` sans `key` · listener scroll + state React.

## Autorité

Couche opt-in, niveau 7b (sous `flo-ui` 7 : a11y et règles de base priment ; au-dessus de `design-taste`
qui audite). Les skills Emil Kowalski (`review-animations`, `animation-performance`) conseillent la revue ;
ce skill construit.

## Définition de terminé

Chaque animation a une raison écrite (1 ligne). Reduced motion testé. Aucun layout thrash au scroll
(Performance panel / pas de jank à 4× CPU throttling). Mobile vérifié sur 390 px. Contenu lisible sans JS.

## Références

[`references/techniques.md`](./references/techniques.md) · [`references/scroll-storytelling.md`](./references/scroll-storytelling.md) ·
patterns prêts : `flo-creative-frontend/library/`.
