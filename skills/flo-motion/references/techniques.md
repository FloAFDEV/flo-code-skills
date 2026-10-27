# flo-motion — recettes

> Écosystème vérifié : package `motion` (v11.11+ / v12), import `motion/react`. Vérifier la version
> installée (`package.json`) avant d'utiliser une API récente.

## Entrée + stagger

```tsx
const list = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };

<motion.ul variants={list} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
  {items.map((i) => <motion.li key={i.id} variants={item}>{i.label}</motion.li>)}
</motion.ul>
```
Stagger ≤ 80 ms × ≤ 8 éléments ; au-delà, grouper.

## Valeur liée au scroll

```tsx
const ref = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
const y = useTransform(scrollYProgress, [0, 1], [24, -24]);      // parallax léger
const scale = useTransform(scrollYProgress, [0, 0.5], [0.96, 1]); // zoom d'arrivée
```
`offset` : `"start end"` = haut de la cible touche le bas du viewport. Clamp par défaut.
Ajouter `useSpring(v, { stiffness: 300, damping: 40 })` uniquement si le rendu saccade.

## Étape active à partir du scroll (sans re-render par frame)

```tsx
const [step, setStep] = useState(0);
useMotionValueEvent(scrollYProgress, "change", (p) => {
  const next = Math.min(steps.length - 1, Math.floor(p * steps.length));
  setStep((s) => (s === next ? s : next));   // re-render seulement au changement d'étape
});
```

## Transition entre états

```tsx
<AnimatePresence mode="wait" initial={false}>
  <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} />
</AnimatePresence>
```
`layoutId` pour un indicateur qui glisse entre onglets/étapes.

## Focus sur une zone d'un écran

But : rendre la zone **lisible**, pas « dynamiser ». Écran entier d'abord (le lecteur situe la zone),
puis recadrage (`transformOrigin: 0 0`, `scale` + `x`/`y` en %) qui centre la zone sans révéler les bords :

```ts
const scale = clamp(Math.min(90 / w, 90 / h), 1, MAX);              // zone ≈ 90 % du cadre
const shift = (c: number) => clamp(50 - c * scale, 100 - 100 * scale, 0); // en % de l'écran
```
`MAX` ≈ 1.25 pour une capture ×1, ≈ 1.8 pour une capture ×2. Si la zone remplit déjà le cadre,
`scale` = 1 : rien ne bouge. Contour (anneau) plutôt que voile sombre — un voile ternit le produit.
Jamais de micro-zoom décoratif (×1.03) : imperceptible, donc sans fonction.

## CSS scroll-driven (zéro JS)

```css
@supports (animation-timeline: view()) {
  .reveal { animation: reveal linear both; animation-timeline: view(); animation-range: entry 0% cover 30%; }
}
@keyframes reveal { from { opacity: 0; transform: translateY(16px); } }
```
Sans support : élément visible (pas de `opacity:0` hors `@supports`).

## Reduced motion

```tsx
<MotionConfig reducedMotion="user">…</MotionConfig>   // coupe transform/layout, garde opacity
const reduce = useReducedMotion();                      // pour choisir une autre mise en page (pas de sticky)
```

## Sans React (Astro, HTML) — API vanilla

```ts
import { animate, scroll, inView } from "motion";
inView(".step", (el) => { animate(el, { opacity: [0, 1], y: [12, 0] }, { duration: 0.4 }); }, { amount: 0.3 });
scroll(animate(".progress", { scaleY: [0, 1] }), { target: document.querySelector(".track")!, offset: ["start start", "end end"] });
```
Astro : dans un `<script>` du composant (bundlé, exécuté une fois) ; pas d'îlot React pour ça.

## Bundle

```tsx
import { LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";
<LazyMotion features={domAnimation} strict><m.div animate={{ opacity: 1 }} /></LazyMotion>
```
`domMax` seulement si `layout`/drag sont nécessaires.
