---
name: flo-seo
version: 1.0.0
description: Stratégie de découvrabilité et SEO technique. À activer pour le CONTENU des metadata (titre/description), OpenGraph/Twitter Cards, données structurées JSON-LD, sitemap, robots, canonical/hreflang, sémantique d'indexation et budget Core Web Vitals. Possède le QUOI ; la mécanique de l'API Next appartient à flo-nextjs.
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

## ▶️ When To Invoke
- Rédiger le **contenu** des metadata (`title`, description) d'une page.
- Définir **OpenGraph / Twitter Cards**, images de partage.
- Écrire des **données structurées JSON-LD**, gérer **sitemap**, **robots**, canonical/hreflang.
- Décider la **structure des headings** pour le crawl, le `alt` orienté pertinence, le budget CWV.

## ⏹️ When NOT To Invoke
- *Mécanique* de l'API Metadata (`generateMetadata`, `sitemap.ts`) → `flo-nextjs`.
- Optimisation technique images/polices → `flo-nextjs`.
- Style, a11y, animations → `flo-ui`.
- Décider si une page peut être publique → `flo-supabase`/`flo-medical`.

## 🎯 Scope (responsabilités)
- **Contenu des metadata** : `<title>`, meta description par page.
- **OpenGraph / Twitter Cards** : valeurs, images de partage.
- **Données structurées JSON-LD**.
- **`sitemap.xml`, `robots.txt`, canonical, hreflang**.
- **SEO technique** : headings (h1 unique), maillage interne, `alt` orienté pertinence, budget Core Web Vitals (cible).

## 🚫 Hors-scope (délégué)
- **Mécanique** de l'API Metadata → `flo-nextjs`.
- **Optimisation technique des images/polices** → `flo-nextjs`.
- **Style, animations, a11y** → `flo-ui`.
- **Décision de rendre une page publique** → `flo-supabase` (sécurité) / `flo-medical` (santé).

## ✅ Règles strictes

### Metadata de contenu
1. **`title` unique** (≤ ~60 car.) et **description** unique (~150–160 car.) par page indexable.
2. Template de titre cohérent au layout (`%s | Marque`).
3. **`canonical`** systématique ; `hreflang` si multilingue.

### Partage social
4. **OpenGraph complet** : `og:title/description/image` (1200×630), `og:url`, `og:type`. Twitter `summary_large_image`.
5. Image OG par page significative ; fallback de marque sinon.

### Données structurées
6. **JSON-LD** adapté au type de page, valide schema.org, cohérent avec le contenu visible.
7. Pas de structured data trompeuse ou invisible (risque de pénalité).

### Crawl & sémantique
8. **Un seul `<h1>` par page**, hiérarchie de headings continue.
9. `sitemap.xml` à jour, `robots.txt` cohérent ; **noindex** explicite sur les pages non publiques.
10. URLs propres, stables (`kebab-case`) ; 301 sur changement d'URL.
11. `alt` **descriptif et pertinent** pour les images de contenu (coordonné avec l'a11y de `flo-ui`).

### Performance SEO
12. Budget **Core Web Vitals** (LCP < 2.5s, CLS < 0.1, INP < 200ms) comme objectif ; la *réalisation* est exécutée par `flo-nextjs`.

## ⛔ Anti-règles (jamais)
- ❌ Jamais exiger qu'une page soit indexable si `flo-supabase`/`flo-medical` la protège — **noindex + auth gagnent**.
- ❌ Jamais réécrire la mécanique de l'API Next.
- ❌ Jamais de keyword stuffing, structured data invisible ou cloaking.
- ❌ Jamais imposer du style ou des animations (→ `flo-ui`).
- ❌ Jamais indexer comptes, dashboards ou contenus sensibles.

## 🥇 Priorité
Niveau **8**. Cède devant tous les skills de sécurité/correction/structure. Le SEO ne justifie jamais d'affaiblir la sécurité, l'a11y ou la correction du rendu.

## 🔗 Interactions
- **Fournit** les valeurs de metadata à `flo-nextjs`.
- **Partage le DOM** avec `flo-ui` : seo = sémantique + metadata ; ui = style + a11y.
- **Cadré** par `frontend-design` (l'IA produit influence headings/maillage).
- **Soumis** à `flo-supabase`/`flo-medical` pour l'indexabilité.
- **Applique** `flo-dev-standards`.
