---
name: flo-seo
version: 2.1.0
description: Stratégie de découvrabilité et SEO technique. À activer pour le contenu des metadata (titre/description), OpenGraph/Twitter Cards, données structurées JSON-LD, sitemap, robots, canonical/hreflang et budget Core Web Vitals. Possède le QUOI ; la mécanique Next appartient à flo-nextjs.
owns:
  - seo-technical
  - opengraph
  - twitter-cards
  - structured-data
  - sitemap
  - robots
  - metadata-content
excludes:
  - metadata-api-mechanics
  - next-image
  - accessibility
  - data-access-security
---

# flo-seo

> Comment on est trouvé et partagé. Le contenu et la sémantique d'indexation.

## Objectif

Définir le contenu des metadata, la structure d'indexation et la stratégie de découvrabilité. S'active pour rédiger les titres et descriptions, configurer OpenGraph, produire des données structurées JSON-LD, gérer sitemap et robots, et poser les Core Web Vitals comme objectif de performance.

## Périmètre

**Possède :** contenu de `<title>` et meta description par page, OpenGraph et Twitter Cards, données structurées JSON-LD, `sitemap.xml`, `robots.txt`, canonical, hreflang, structure des headings pour le crawl (`<h1>` unique, hiérarchie continue), budget CWV.

**Délègue :** mécanique de l'API Metadata Next.js (`generateMetadata`, `sitemap.ts`) → `flo-nextjs` · optimisation technique des images et polices → `flo-nextjs` · style, a11y, animations → `flo-ui` · décision d'indexabilité d'une page protégée → `flo-supabase`/`flo-medical` · choix et configuration de l'analytics web (Umami/GA4) → `flo-dev-standards`.

## Contraintes

**Metadata :** titre unique ≤ ~60 caractères et description unique ~150–160 caractères par page indexable. Template cohérent au layout (`%s | Marque`). Canonical systématique.

**OpenGraph :** `og:title`, `og:description`, `og:image` (1200×630), `og:url`, `og:type` complets. Twitter `summary_large_image`. Image OG dédiée par page significative — fallback de marque sinon.

**Données structurées :** JSON-LD valide schema.org, cohérent avec le contenu visible. Pas de structured data invisible ou trompeuse (risque de pénalité).

**Indexabilité :** pages avec données patient → noindex + authentifiées (exigence de `flo-medical` — inviolable). Sitemap cohérent avec les pages effectivement publiques. `robots.txt` sans contradiction avec le sitemap.

**CWV :** LCP < 2.5s, CLS < 0.1, INP < 200ms comme objectif de conception. La réalisation technique est déléguée à `flo-nextjs`.

Le SEO ne justifie jamais d'affaiblir la sécurité, l'accessibilité ou la conformité médicale.

**Search Console vs analytics :** Search Console relève du `seo-technical` possédé par ce skill — suivi d'indexation, de couverture et de performance sur la recherche Google. Ce n'est pas un outil d'analytics comportemental : avoir Search Console configuré ne signifie pas avoir un outil d'analytics web, et inversement. Le choix et la configuration de l'analytics (Umami par défaut, GA4 en complément si justifié) sont définis par `flo-dev-standards`, pas ici — ne pas dupliquer cette convention dans ce skill.

## Autorité

Niveau 8. Cède devant tous les skills de sécurité, conformité, correction et structure. `flo-supabase`/`flo-medical` tranchent sur l'indexabilité.

## Définition de terminé

Chaque page indexable a un titre et une description uniques dans les limites de longueur. OpenGraph est complet avec image. Les données structurées sont valides selon schema.org. Le sitemap est cohérent avec les pages publiques. Les pages sensibles sont en noindex.

## Références

Fournit les valeurs de metadata à `flo-nextjs` (qui les expose via `generateMetadata`). Partage le DOM avec `flo-ui` (seo = sémantique et metadata ; ui = style et a11y — coordonner le `alt` des images). Cadré par `frontend-design` (l'architecture des écrans influence headings et maillage). Soumis à `flo-supabase`/`flo-medical` pour l'indexabilité.
