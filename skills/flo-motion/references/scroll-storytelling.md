# Scroll storytelling (sticky) — méthode

À utiliser quand une suite d'étapes **réelles** (workflow produit, process) doit être comprise
dans l'ordre. Implémentation de référence : `flo-creative-frontend/library/patterns/scroll-story/`.

## Anatomie

```
section (piste) height = N × ~90vh            ← donne la durée de scroll
└─ div sticky top-0 h-[100svh]                 ← la scène reste à l'écran
   ├─ colonne récit : n° d'étape, titre, texte (AnimatePresence, déclenché)
   ├─ scène visuelle : écran produit de l'étape (cross-fade + léger scale/translate)
   └─ progression : rail + étapes cliquables (scrollTo l'étape)
```

## Règles

1. **Une étape = une idée.** 3 à 5 temps ; un temps peut enchaîner plusieurs écrans. Titre ≤ 6 mots, texte ≤ 25 mots.
   **Part de scroll par écran** selon son poids narratif : le contexte passe vite, la valeur prend son temps.
   Si une démo interactive suit, le récit ne rejoue pas le geste qu'elle fera faire.
2. Texte **déclenché** (change d'un bloc au seuil), visuel éventuellement **scrubbé** (zoom/translation).
3. Le visuel montre le vrai produit ; un focus (zoom, halo) désigne l'élément dont parle le texte.
4. Progression visible et navigable (boutons → `scrollIntoView`/`scrollTo` sur l'ancre de l'étape).
5. Les étapes existent dans le DOM (liste ordonnée) : lecteurs d'écran et SEO lisent tout, sans scroll.
   La région qui change porte `aria-live="polite"` au plus — ou rien si les étapes sont déjà lues.
6. **Mobile (< 768 px) / reduced motion** : pas de pin. Séquence verticale : étape → écran → étape,
   avec reveal discret. Même contenu, autre mise en scène.
7. Hauteur de piste raisonnable (≤ 90vh par étape) : pas de « tunnel » de scroll.
8. Sortie claire : la dernière étape mène au CTA principal.

## Anti-patterns

Pin > 7 écrans · texte qui défile pendant qu'il est lu · étape inaccessible sans scroll exact ·
captures floues (zoom au-delà de la résolution source) · mockups inventés quand le vrai produit existe ·
même écran montré deux fois (vide puis rempli) au lieu d'un changement d'état · voile sombre qui ternit le produit.
