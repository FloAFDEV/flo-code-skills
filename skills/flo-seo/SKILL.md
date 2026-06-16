---
name: flo-seo
description: Stratégie de découvrabilité et référencement. À activer pour le CONTENU des metadata (titre/description), OpenGraph/Twitter Cards, données structurées JSON-LD, sitemap, robots, canonical/hreflang, sémantique d'indexation et budget Core Web Vitals. Possède le QUOI ; la mécanique de l'API Next appartient à flo-nextjs.
---

# flo-seo

> Comment on est trouvé et partagé. Le contenu et la sémantique d'indexation.

## 🎯 Scope
- **Contenu des metadata** : `<title>`, meta description par page.
- **OpenGraph / Twitter Cards** : valeurs, images de partage.
- **Données structurées JSON-LD** (Article, Organization, BreadcrumbList, MedicalClinic, etc.).
- **`sitemap.xml`, `robots.txt`, canonical, hreflang**.
- **Sémantique d'indexation** : structure des headings (h1 unique, hiérarchie), liens internes, `alt` orienté pertinence.
- **Budget Core Web Vitals** comme exigence (cibles), impact ranking.

## 🚫 Hors-scope (délégué)
- **Mécanique** de l'API Metadata (`generateMetadata`, fichiers `sitemap.ts`/`robots.ts`) → `flo-nextjs`.
- **Optimisation technique des images/polices** (`next/image`, `next/font`) → `flo-nextjs`.
- **Style, animations, a11y** → `flo-ui` (seo n'écrit pas de CSS).
- **Décision de rendre une page publique** → soumise à `flo-medical`/`flo-supabase`.

## ✅ Règles strictes

### Metadata de contenu
1. **Chaque page indexable a un `title` unique** (≤ ~60 car.) et une `description` unique (~150–160 car.), rédigés pour l'humain ET le mot-clé.
2. Template de titre cohérent au niveau layout (`%s | Marque`) ; valeurs par défaut définies, surchargées par page.
3. **`canonical`** systématique pour éviter le contenu dupliqué ; `hreflang` si multilingue.

### Partage social
4. **OpenGraph complet** : `og:title`, `og:description`, `og:image` (1200×630, < ~1 Mo), `og:url`, `og:type`. Twitter Card `summary_large_image`.
5. Image OG par page significative (générée dynamiquement si pertinent) ; fallback de marque sinon.

### Données structurées
6. **JSON-LD** adapté au type de page (Organization/MedicalClinic global, Article/FAQ/Breadcrumb par page). Valide selon schema.org, cohérent avec le contenu visible.
7. Pas de structured data trompeuse ou non visible à l'utilisateur (risque de pénalité).

### Crawl & sémantique
8. **Un seul `<h1>` par page**, hiérarchie de headings logique et continue (pas de saut h1→h3).
9. `sitemap.xml` à jour (priorités, `lastmod`), `robots.txt` cohérent ; **noindex** explicite sur les pages non destinées au public.
10. URLs propres, lisibles, stables (slug `kebab-case`) ; redirections 301 sur changement d'URL.
11. `alt` d'image **descriptif et pertinent** pour les images de contenu (coordonné avec l'a11y de `flo-ui`).

### Performance SEO
12. Définir un **budget Core Web Vitals** (LCP < 2.5s, CLS < 0.1, INP < 200ms) comme objectif ; signaler les régressions. La *réalisation technique* (rendu, images) est exécutée par `flo-nextjs`.

## ⛔ Anti-règles (jamais)
- ❌ Jamais exiger qu'une page soit publique/indexable si `flo-medical` ou `flo-supabase` la protège — **noindex + auth gagnent toujours**.
- ❌ Jamais réécrire la mécanique de l'API Next (seo fournit les valeurs, nextjs les branche).
- ❌ Jamais de keyword stuffing, de structured data invisible ou de cloaking.
- ❌ Jamais imposer du style ou des animations (→ `flo-ui`).
- ❌ Jamais indexer des pages de compte, dashboards ou contenus utilisateur sensibles.

## 🥇 Priorité
Niveau **7** (le plus bas). Cède devant **tous** les autres skills. Le SEO ne justifie jamais d'affaiblir la sécurité, la conformité, l'a11y ou la correction du rendu.

## 🔗 Interactions
- **Fournit** les valeurs de metadata à `flo-nextjs` qui les expose via l'API.
- **Partage le DOM** avec `flo-ui` : seo possède la sémantique d'indexation et l'`alt` orienté pertinence ; ui possède le style et l'a11y. Pas de conflit : un `alt` bien écrit sert les deux.
- **Soumis** à `flo-medical`/`flo-supabase` pour ce qui est indexable.
- **Applique** `flo-dev-standards` pour le code des helpers SEO.
