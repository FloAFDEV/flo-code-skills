# Cartographie des responsabilités (skill boundaries)

> Source de vérité des frontières entre skills. Vérifiée automatiquement par
> `tools/check-overlaps.ts` (et la CI `check-overlaps`). Chaque **responsabilité
> canonique** (`owns`) appartient à **un seul** skill ; aucune n'est dupliquée.

## Pipeline produit

```
  ┌─ ORCHESTRATEUR (méta, ne juge pas) ─┐   ┌─ DIAGNOSTIC transverse ─┐
  │         flo-project-audit            │   │        flo-debug         │
  └──────────────────────────────────────┘   └──────────────────────────┘
            ┌──────────── SOCLE (tout le code) ────────────┐
            │            flo-dev-standards                  │
            └───────────────────────────────────────────────┘
            ┌──────── CONTRAINTE (si données santé) ────────┐
            │                flo-medical                    │
            └───────────────────────────────────────────────┘

  PLAN ──────────────▶ BUILD ─────────────────▶ AUDIT ──────────▶ VALIDATION
  frontend-design      flo-nextjs               playwright         (feature OK)
                       flo-ui                   design-taste
                       flo-supabase
                       flo-offline
                       flo-seo

  Boucle qualité : Code → verify → playwright → design-taste → validation finale
  flo-debug intervient à la demande (bug/perf) ; flo-project-audit orchestre l'ensemble.
```

Voir aussi : [`scorecard.md`](./scorecard.md) (évaluation 10 dimensions),
[`VERSIONING.md`](./VERSIONING.md) (évolution non cassante),
[`AUDIT-PHASE2.md`](./AUDIT-PHASE2.md) (revue & corrections).

## Hiérarchie d'autorité (résolution de conflits)

| # | Skill | Tranche sur |
|---|-------|-------------|
| 1 | **flo-medical** | conformité / données santé (autorité max) |
| 2 | **flo-supabase** | sécurité d'accès aux données |
| 3 | **flo-dev-standards** | correction du code |
| 4 | **flo-nextjs** | correction framework / rendu |
| 5 | **flo-offline** | intégrité persistance locale |
| 6 | **frontend-design** | structure UX / IA / intention de hiérarchie |
| 7 | **flo-ui** | implémentation visuelle/interaction (**a11y non négociable**) |
| 8 | **flo-seo** | découvrabilité |
| 9 | **design-taste** | qualité perçue / véto esthétique *(dans ses limites)* |
| 10 | **playwright** | validation fonctionnelle *(rapporte, ne dicte pas)* |

> Plus le numéro est petit, plus l'autorité est forte. `design-taste` peut exiger une
> reprise visuelle mais ne casse jamais a11y/sécurité/correction. `playwright` rapporte
> des faits ; la correction revient au skill propriétaire.
>
> **Hors échelle (non-autoritaires)** :
> - `flo-project-audit` — **méta-coordinateur (niveau 0)** : orchestre, ne juge pas, défère aux niveaux 1–10.
> - `flo-debug` — **diagnostic transverse** : trouve la cause sur tout le stack, défère le correctif au skill propriétaire.

## Matrice Skill → Mission / Couvre / Ne couvre PAS / Dépendances / Risque

| Skill | Mission | Couvre (`owns`) | Ne couvre PAS (`excludes` → propriétaire) | Dépend de | Risque de chevauchement → résolution |
|-------|---------|-----------------|-------------------------------------------|-----------|--------------------------------------|
| **flo-dev-standards** | Socle qualité code | typescript-strict, code-architecture, folder-structure, error-handling, refactoring, project-conventions, code-security, code-review, unit-testing | server-components→nextjs, data-access-security→supabase, design-tokens→ui, cache-strategies→offline, metadata-content→seo | — | « sécurité » : dev = code (validation/secrets), supabase = accès données |
| **flo-medical** | Contrainte santé (autorité max) | medical-apps, sensitive-data-protection, data-separation, health-business-logic, regulatory-compliance | rls→supabase, edge-functions→supabase, cache-strategies→offline, metadata-content→seo | contraint supabase/offline/nextjs/seo/playwright | exigence vs implémentation : medical exige, les autres codent |
| **flo-supabase** | Données & sécurité backend | rls, edge-functions, supabase-auth, data-access-security, data-patterns, sql-migrations | caching-revalidation→nextjs, cache-strategies→offline, regulatory-compliance→medical, error-handling→dev | dev-standards | auth : supabase = sécurité, nextjs = où l'appeler |
| **flo-nextjs** | Framework & rendu | app-router, server-components, client-components, metadata-api-mechanics, next-image, next-font, data-fetching-server, caching-revalidation, server-actions, nextjs-performance, react-patterns-next | metadata-content→seo, design-tokens→ui, rls→supabase, code-architecture→dev | dev-standards, supabase | metadata : nextjs = mécanique, seo = contenu |
| **flo-offline** | Persistance locale | indexeddb, dexie, offline-sync, offline-first, conflict-resolution, cache-strategies | data-access-security→supabase, accessibility→ui, error-handling→dev, caching-revalidation→nextjs | supabase, dev-standards | cache : offline = local, nextjs = HTTP/serveur |
| **flo-seo** | Découvrabilité | seo-technical, opengraph, twitter-cards, structured-data, sitemap, robots, metadata-content | metadata-api-mechanics→nextjs, next-image→nextjs, accessibility→ui, data-access-security→supabase | nextjs | `alt` : seo = pertinence, ui = a11y |
| **frontend-design** | Conception produit/UX | ux, information-architecture, user-flows, content-hierarchy, screen-structure, section-organization, information-prioritization, conceptual-wireframes | ui-components→ui, design-system→ui, design-tokens→ui, visual-critique→design-taste, metadata-content→seo | dev-standards | hiérarchie : frontend-design = intention, ui = système qui la réalise |
| **flo-ui** | Implémentation UI | ui-components, tailwind, responsive, accessibility, animations, micro-interactions, design-system, design-tokens, interface-patterns | screen-structure→frontend-design, information-architecture→frontend-design, perceived-quality-audit→design-taste, ai-artifact-detection→design-taste, metadata-content→seo, server-components→nextjs | frontend-design, dev-standards | vs frontend-design (structure) & design-taste (jugement) |
| **design-taste** | Auditeur final | visual-critique, perceived-quality-audit, ai-artifact-detection, simplification, refinement, product-consistency, premium-saas-analysis | ui-components→ui, design-tokens→ui, screen-structure→frontend-design, test-screenshots→playwright, e2e-tests→playwright | observe ui & frontend-design | vs playwright : taste interprète, playwright produit |
| **playwright** | Validation auto (prod SaaS) | e2e-tests, smoke-tests, critical-journey-validation, ui-regression, test-screenshots, responsive-testing, basic-a11y-testing, console-error-checks, network-checks | perceived-quality-audit→design-taste, ai-artifact-detection→design-taste, unit-testing→dev, user-flows→frontend-design | l'app construite | vs design-taste : mécanisme vs jugement |
| **flo-project-audit** | Orchestrateur (méta) | project-audit, skill-orchestration, roadmap-prioritization, scorecard-evaluation | code-review→dev, visual-critique→design-taste, error-diagnosis→debug, e2e-tests→playwright, ux→frontend-design | tous (coordonne) | « audit » : project-audit = projet/orchestration, code-review = code, design-taste = visuel |
| **flo-debug** | Diagnostic transverse | error-diagnosis, stack-trace-analysis, react-debugging, nextjs-debugging, supabase-debugging, dexie-debugging, performance-diagnosis | error-handling→dev, nextjs-performance→nextjs, unit-testing→dev, rls→supabase, e2e-tests→playwright | l'app + tous | « erreur » : debug = diagnostic runtime, dev = pattern ; « perf » : debug = pourquoi, nextjs = construire, seo = budget |

## Les frontières à risque — comment elles sont tranchées

1. **frontend-design ↔ flo-ui** — *structure/intention* vs *implémentation*. frontend-design s'arrête au wireframe.
2. **flo-ui ↔ design-taste** — ui **construit**, design-taste **juge**. La checklist anti-IA vit *uniquement* dans design-taste.
3. **design-taste ↔ playwright** — playwright **produit** les captures, design-taste les **interprète**.
4. **frontend-design ↔ flo-seo** — IA *produit* (navigation) vs sémantique *d'indexation* (headings, JSON-LD).
5. **flo-medical ↔ flo-supabase** — *exigence* vs *mise en œuvre* (RLS/Edge).
6. **flo-dev-standards ↔ flo-supabase** — sécurité *du code* vs sécurité *d'accès aux données*.
7. **flo-dev-standards ↔ flo-debug** — `error-handling` = *pattern* de conception ; `error-diagnosis` = *diagnostic runtime*. `unit-testing` (dev) ≠ debug.
8. **flo-debug ↔ flo-nextjs ↔ flo-seo** (performance) — debug = *pourquoi c'est lent* ; nextjs = *construire performant* ; seo = *budget/cible CWV*.
9. **flo-project-audit ↔ flo-dev-standards ↔ design-taste** (« audit ») — project-audit = *projet/orchestration/roadmap* ; code-review = *code (change-level)* ; design-taste = *visuel*. L'orchestrateur **ne juge pas**, il route.

## Vérification

```bash
npm run check:overlaps      # ou : npx tsx tools/check-overlaps.ts
```

Le script échoue (exit ≠ 0) si une responsabilité `owns` est revendiquée par plus
d'un skill, si un skill exclut une responsabilité qu'il possède, ou si un frontmatter
est invalide. Il avertit (sans échouer) sur les références `excludes` orphelines.
Exécuté en CI à chaque PR touchant un `SKILL.md`.

## Ajouter un skill

1. Crée `skills/flo-<domaine>/SKILL.md` avec le frontmatter complet (`name`, `description`, `owns`, `excludes`).
2. Choisis des tokens `owns` **nouveaux** (jamais déjà possédés) — sinon la CI échoue.
3. Place le skill dans la hiérarchie d'autorité ci-dessus.
4. Ajoute sa ligne à la matrice et déclare ses interactions.
5. `npm run check:overlaps` doit rester vert.
