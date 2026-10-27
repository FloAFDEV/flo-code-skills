# scroll-story — récit produit au scroll sur de vrais écrans

- **Statut** : provisional · **Origine** : AuditRef, page d'accueil (2026-10-27) · **Stack d'origine** : Vite + React + `motion` (SPA)
- **Méthode motion** : `flo-motion/references/scroll-storytelling.md` (règles ; ce fichier = le pattern concret).

## Intention

Faire comprendre **comment le produit s'utilise réellement**, étape par étape, en montrant ses vrais
écrans. Pas une démo d'animation : chaque mouvement désigne ce dont parle le texte.

## Quand l'utiliser / ne pas l'utiliser

✅ Un parcours réel de 4 à 7 étapes, des écrans existants, une page vitrine/accueil.
⛔ Pas de produit à montrer (→ section éditoriale) · étapes inventées · > 7 étapes · page applicative.

## Anatomie (3 pièces, à placer dans le dossier de la surface — ex. `components/home/`)

| Pièce | Rôle |
|---|---|
| `steps.ts` | Données : `id, title (≤ 6 mots), text (≤ 25 mots), trail, alt`, et par format `{ src, width, height, focus: {x,y,w,h en %} }`. Aucun import de l'app. |
| `StoryScreen` | Vrai écran dans un cadre neutre + zone de focus (anneau + voile `box-shadow: 0 0 0 200vmax`) + zoom ≤ 1.04 centré sur le focus (`transformOrigin`). |
| `Story` | Choisit la mise en scène : **sticky** si `min-width: 1024px` et pas `useReducedMotion()` ; sinon **séquence verticale** (texte → capture mobile, `whileInView once`). |

## Scène sticky (desktop)

- Piste `height: calc(100svh + N × 70svh)`, enfant `sticky top-0 h-[100svh]`.
- `useScroll({ target: piste, offset: ['start start', 'end end'] })` → étape active via
  `useMotionValueEvent` (setState seulement au changement d'étape).
- Texte : `AnimatePresence mode="wait"` (déclenché). Écrans : tous empilés, opacité animée (pas de remount → pas de flash de décodage).
- Navigation : `<nav><ol>` de boutons `aria-current="step"` → `scrollTo` au milieu du segment de l'étape ; rail de progression `scaleY` = `useSpring(scrollYProgress)`.
- « Trail » : puces cumulées de ce que le produit a enregistré (fil narratif concret).
- A11y : la scène est `aria-hidden`, une `<ol class="sr-only">` porte titres, textes et descriptions des écrans.

## Enseignements (pilote AuditRef, V2)

- **Temps et écrans** : `steps[].frames[]` avec une part de piste (`scroll`, en svh) par écran ;
  l'écran actif = premier dont la fin cumulée dépasse `scrollYProgress`.
- **Lisibilité** : recadrage sur la zone (`focusCrop`, cf. `flo-motion/references/techniques.md`),
  écran entier → zone ; aucun voile sombre ; anneau seul.
- **Fil enregistré** : afficher ce que le produit a enregistré **dans le rail des étapes** (dans le
  regard), pas en puces sous l'écran.
- **Fin du récit** : le dernier temps montre la valeur produite (décision, livrable), jamais un
  écran de navigation ; s'il existe une démo, le rail se termine par « À vous ».
- **Mobile** : vignettes côte à côte pour le contexte, un seul écran lisible par temps clé, aucune
  apparition animée répétée.

## Vrais écrans (pas de mockups)

Capturer l'app avec Playwright en rejouant le vrai parcours sur des données de démo
(navigateur jetable), `deviceScaleFactor: 2`, recadrage autour de la zone utile, WebP q≈82 ;
le script imprime les zones `focus` en % à reporter dans `steps.ts`. Formats : desktop 1024×640,
mobile 390×760. Retirer le hover (`mouse.move(1,1)`) avant chaque capture. Pour une modale,
recadrer sur son panneau (sans le fond assombri), au même ratio que le format.
Référence : `audit_dat/scripts/capture-home-story.cjs`.

## Selon la stack (le pattern s'adapte, la stack ne change pas)

- **Vite + React** : implémentation d'origine telle quelle, dans le dossier de la surface.
- **Next.js** : `Story` et `StoryScreen` en Client Components ; `steps.ts` importable côté serveur.
- **Astro** : section et texte en `.astro` (contenu dans le HTML) ; scène sticky en CSS
  (`position: sticky`) + `scroll()` / `inView()` de `motion` (API vanilla) dans un `<script>` qui bascule
  une classe `is-active` par étape ; îlot React `client:visible` seulement si nécessaire.

## Mobile

Capture **mobile** de l'app (pas la desktop réduite), cadre arrondi type téléphone `max-w-[19rem]`,
alternance gauche/droite à partir de `md`. Même contenu, autre mise en scène.

## Pièges rencontrés

- Clics de statut enchaînés trop vite dans le script de capture → état incomplet : un clic par ligne + courte attente.
- Libellés en `uppercase` CSS : chercher le texte réel (`/^urgent$/i`).
- La hauteur variable du « trail » recentrait la scène : réserver sa hauteur (`min-h`).
