# Scorecard d'audit projet

Grille d'évaluation d'un projet sur **10 dimensions**. Chaque dimension est notée **0–5** et
**possédée par le(s) skill(s) compétent(s)** : c'est le skill qui fournit le verdict, `flo-project-audit`
qui **collecte et agrège**. Aucune dimension n'est jugée par l'orchestrateur lui-même.

## Échelle (par dimension)

| Note | Signification |
|------|---------------|
| 0 | Absent / cassé |
| 1 | Présent mais problématique (risques sérieux) |
| 2 | En dessous des standards |
| 3 | Correct, conforme aux règles du skill |
| 4 | Solide, peu de réserves |
| 5 | Niveau production exemplaire (référence du domaine) |

## Les 10 dimensions → skill(s) contributeur(s)

| # | Dimension | Skill propriétaire du verdict | Ce qui est évalué |
|---|-----------|-------------------------------|-------------------|
| 1 | **Architecture** | `flo-dev-standards` (+ `flo-nextjs` pour la structure app) | feature-first, découpage, frontières, dépendances |
| 2 | **Qualité de code** | `flo-dev-standards` | TS strict, typage, erreurs typées, lisibilité, duplication |
| 3 | **UI** | `flo-ui` | design system/tokens, responsive, états, micro-interactions |
| 4 | **UX** | `frontend-design` | parcours, architecture d'information, hiérarchie, friction |
| 5 | **SEO** | `flo-seo` | metadata, OG, structured data, sitemap/robots, sémantique |
| 6 | **Accessibilité** | `flo-ui` (a11y) + `playwright` (vérif auto) | focus, clavier, contraste AA, ARIA, labels |
| 7 | **Performance** | `flo-nextjs` (build) + `flo-debug` (diagnostic) + `flo-seo` (budget CWV) | rendu, bundle, cascades, LCP/CLS/INP |
| 8 | **Sécurité** | `flo-supabase` + `flo-medical` + `flo-dev-standards` (code) | RLS, secrets, auth, conformité, validation des entrées |
| 9 | **Offline** | `flo-offline` | synchro, file de mutations, conflits, intégrité locale |
| 10 | **Qualité perçue** | `design-taste` | finition, cohérence, absence d'artefacts IA, niveau SaaS premium |

> Diagnostic transverse : `flo-debug` alimente surtout **Performance** (et la santé de #1/#2 via les
> causes racines des bugs). Validation : `playwright` étaye **Accessibilité** et **Performance** par des
> faits mesurés.

## Restitution

`flo-project-audit` produit un tableau de notes + une **moyenne pondérée** (les pondérations dépendent
du type de projet — ex. médical : Sécurité ×2 ; vitrine : SEO/Qualité perçue ×2) + une **feuille de
route priorisée** où chaque action est rattachée au skill propriétaire et à un critère de « fait ».

```
Dimension          Note  Propriétaire        Action prioritaire
Architecture        4/5  flo-dev-standards   —
Qualité de code     3/5  flo-dev-standards   Éliminer les `any` résiduels (12)
UI                  4/5  flo-ui              —
UX                  3/5  frontend-design     Réduire le parcours d'onboarding (5→3 étapes)
SEO                 2/5  flo-seo             Ajouter metadata + JSON-LD sur les pages clés
Accessibilité       3/5  flo-ui/playwright   Focus visible manquant sur la modale
Performance         3/5  nextjs/debug/seo    Paralléliser les fetchs du dashboard
Sécurité            4/5  supabase/medical    RLS OK ; ajouter audit log
Offline             —    flo-offline         N/A (pas d'offline)
Qualité perçue      2/5  design-taste        Retirer gradients génériques + badges inutiles
```

## Pondérations suggérées par type de projet

| Type | Dimensions à pondérer ×2 |
|------|--------------------------|
| App médicale | Sécurité, Accessibilité |
| SaaS premium | Qualité perçue, UX, Performance |
| Vitrine / landing | SEO, Qualité perçue |
| App offline-first | Offline, Performance |
