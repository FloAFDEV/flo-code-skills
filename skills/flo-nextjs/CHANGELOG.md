# Changelog — flo-nextjs

## 2.1.0 — 2026-08-13
- Ajout (additif) : principes d'intégration technique Umami en App Router — chargement via `next/script` dans le layout racine, identifiant de site via `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, activation implicite en production uniquement. La politique (pourquoi Umami) reste dans `flo-dev-standards` ; ce skill ne documente que la mécanique.

## 1.0.0 — 2026-06-17
- Première version versionnée.
- *When NOT To Invoke* : diagnostic d'un bug/perf runtime → `flo-debug` (ici = *construire* du Next performant).
- Périmètre : App Router, Server/Client Components, mécanique Metadata, next/image, perf, patterns React Next.
