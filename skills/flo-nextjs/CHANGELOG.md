# Changelog — flo-nextjs

## 2.2.0 — 2026-11-13
- Ajout (additif, `nextjs-performance`) : pratiques de performance App Router — frontière Server/Client, Server Actions redondantes, audit du prefetch automatique (interfaces admin), ISR/cache, invalidation `revalidatePath`/`revalidateTag` ciblée vs mise à jour locale, waterfalls de requêtes, région d'exécution Vercel vs localisation des données, coût de `next/image`.
- Documente explicitement les cas où ces optimisations ne doivent pas être appliquées (cohérence immédiate requise).
- Le diagnostic de cause racine d'une lenteur reste hors périmètre (`flo-debug`) ; ce skill documente la construction, pas le diagnostic.

## 2.1.0 — 2026-08-13
- Ajout (additif) : principes d'intégration technique Umami en App Router — chargement via `next/script` dans le layout racine, identifiant de site via `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, activation implicite en production uniquement. La politique (pourquoi Umami) reste dans `flo-dev-standards` ; ce skill ne documente que la mécanique.

## 1.0.0 — 2026-06-17
- Première version versionnée.
- *When NOT To Invoke* : diagnostic d'un bug/perf runtime → `flo-debug` (ici = *construire* du Next performant).
- Périmètre : App Router, Server/Client Components, mécanique Metadata, next/image, perf, patterns React Next.
