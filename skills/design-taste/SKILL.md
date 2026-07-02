---
name: design-taste
version: 2.0.0
description: Auditeur visuel final. À activer après implémentation pour critiquer la qualité perçue, détecter les artefacts IA et aligner le rendu sur le niveau Linear / Stripe / Notion / Vercel. Produit des recommandations — ne génère ni ne modifie l'interface.
owns:
  - visual-critique
  - perceived-quality-audit
  - ai-artifact-detection
  - simplification
  - refinement
  - product-consistency
  - premium-saas-analysis
excludes:
  - ui-components
  - design-tokens
  - screen-structure
  - test-screenshots
  - e2e-tests
---

# design-taste

> Dernier regard avant livraison : un vrai produit, ou un rendu généré ?

## Objectif

Évaluer la qualité perçue d'une interface réalisée et identifier ce qui trahit une origine IA ou template. S'active après implémentation (`flo-ui`) et avant validation finale, ou à la demande quand un rendu « sonne faux ». Produit des constats et des corrections attribuées — jamais de code.

## Périmètre

**Possède :** critique visuelle sur rendu réel, détection d'artefacts IA (checklist ci-dessous — autorité exclusive), benchmark contre les SaaS de référence (Linear, Stripe, Notion, Vercel), recommandations de simplification et de raffinement, cohérence inter-écrans.

**Délègue :** corrections de code et tokens → `flo-ui` · restructuration d'écran ou de parcours → `frontend-design` · captures et tests → `playwright` · sémantique et metadata → `flo-seo`.

## Contraintes

Auditer uniquement sur le **rendu réel** (capture `playwright` ou page live). Une intention de design ne suffit pas.

Chaque constat nomme le problème précis, sa localisation, et le skill qui corrige. Pas de constat vague.

**Artefacts IA à détecter :**
- Dégradés génériques (violet→bleu, fond gradient gratuit) — préférer des aplats à intention de marque assumée.
- Badges décoratifs (« New », « AI », « Pro ») sans donnée réelle — un badge porte une information, pas une ambiance.
- Animations d'apparition, glow, float, parallax sans fonction sémantique.
- Grilles de cards identiques à ombres uniformes, sans hiérarchie de densité ni variation de traitement.
- Plusieurs CTA de même poids visuel, libellés génériques (« Get Started », « Learn More »).
- Structure cookie-cutter hero + 3 features + pricing sans ancrage dans le vrai contenu et la vraie marque.
- Espacement uniforme sans rythme, une seule graisse typographique, icônes dépareillées, copy générique.

**Standard de référence :** sobriété, densité maîtrisée, typographie hiérarchisée, intention de marque lisible, raffinement par le retrait plutôt que par l'ajout.

## Autorité

Niveau 9 — gate esthétique. Peut bloquer la validation finale sur des défauts visuels dans son domaine. Cède devant `flo-medical`, `flo-supabase`, `flo-dev-standards`, `flo-nextjs`, et `flo-ui` sur l'accessibilité.

## Définition de terminé

Aucun artefact IA détectable. Chaque défaut constaté est attribué à un skill avec une correction concrète. L'intention de marque est lisible et différenciante.

## Références

Pipeline : `frontend-design → flo-ui → playwright → design-taste → validation finale`. Consomme les captures de `playwright`. Renvoie ses corrections à `flo-ui` (code) et `frontend-design` (structure).
