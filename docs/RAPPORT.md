# Rapport final — évolution du socle flo-code-skills

## 1. Choix effectués

- **10 skills, organisés en pipeline** plutôt qu'en liste plate :
  `PLAN (frontend-design) → BUILD (nextjs, ui, supabase, offline, seo) → AUDIT (playwright, design-taste) → VALIDATION`,
  avec deux transverses : `flo-dev-standards` (tout le code) et `flo-medical` (si données santé).
- **Frontmatter machine-lisible** (`owns` / `excludes`) sur chaque skill : c'est la version
  vérifiable des sections Scope / Hors-scope. 77 responsabilités canoniques, **toutes disjointes**.
- **Trio design séparé par phase** (la décision la plus structurante) :
  - `frontend-design` = structure/UX/IA, *avant les pixels*, ne code pas ;
  - `flo-ui` = implémentation (composants, tokens, a11y, animation) ;
  - `design-taste` = audit visuel *après rendu*, ne code pas, renvoie ses corrections en amont.
- **design-taste = auditeur final** avec la checklist anti-IA en autorité **exclusive**
  (gradients excessifs, badges inutiles, animations gadgets, cartes répétitives, CTA artificiels,
  composants template) + benchmark **Linear / Stripe / Notion / Vercel**.
- **playwright niveau production SaaS** : E2E, smoke, parcours critiques, régressions UI, captures,
  responsive, a11y de base, erreurs console, vérifs réseau — positionné avant la validation finale.
- **`flo-medical` réintégré** en autorité maximale, en posture « exigence » (il ne réimplémente ni
  la RLS ni le chiffrement : il les *impose* à supabase/offline/nextjs/seo/playwright).
- **Sections When To / When NOT To Invoke** ajoutées partout pour piloter l'activation par Claude.

## 2. Conflits éliminés

| Conflit potentiel | Résolution |
|-------------------|------------|
| frontend-design vs flo-ui | structure/intention (plan) vs implémentation (build) |
| flo-ui vs design-taste | ui construit, taste juge ; checklist anti-IA *uniquement* dans taste |
| design-taste vs playwright | playwright **produit** les captures, taste les **interprète** |
| frontend-design vs flo-seo | IA produit (navigation) vs sémantique d'indexation (headings/JSON-LD) |
| flo-medical vs flo-supabase | exigence vs mise en œuvre (RLS/Edge/chiffrement) |
| dev-standards vs flo-supabase | sécurité du code vs sécurité d'accès aux données |
| nextjs vs flo-seo | mécanique de l'API Metadata vs contenu |
| nextjs vs flo-offline | cache HTTP/`revalidate` vs cache local IndexedDB |
| dev-standards vs playwright | tests unitaires vs E2E |

Aucune responsabilité `owns` n'est partagée : garanti par `tools/check-overlaps.ts` (vert, 0 conflit).

## 3. Améliorations apportées

- **Vérification automatique** des chevauchements (`tools/check-overlaps.ts`) + **GitHub Action**
  qui échoue sur toute PR introduisant un doublon de responsabilité.
- **Cartographie unique** (`docs/skill-boundaries.md`) : matrice Mission / Couvre / Ne couvre PAS /
  Dépendances / Risques, hiérarchie d'autorité, pipeline.
- **README** réorienté production (activation par type de projet, pipeline, benchmark premium).
- **Hiérarchie d'autorité explicite** sur 10 niveaux pour trancher tout conflit déterministiquement.
- **Posture anti-« rendu IA »** désormais formalisée et opposable (design-taste).

## 4. Extensions futures possibles

- `flo-testing` (unitaire/intégration) si la frontière E2E/unitaire mérite son propre skill.
- `flo-analytics` (events, tracking, privacy-aware) — devra exclure les données sensibles (medical).
- `flo-i18n` (internationalisation) — frontière nette avec seo (hreflang) et ui (formats).
- `flo-emails` (templates transactionnels) — coordonné avec supabase (Edge) et design-taste (rendu).
- `flo-payments` (Stripe) — coordonné avec supabase (webhooks/Edge) et medical (si facturation santé).

> Procédure d'ajout dans `docs/skill-boundaries.md` § « Ajouter un skill » : tokens `owns` nouveaux,
> placement dans la hiérarchie, ligne de matrice, et `npm run check:overlaps` qui doit rester vert.

## 5. État de la vérification

```
10 skills · 77 responsabilités canoniques uniques
✅ Aucun chevauchement critique : chaque responsabilité appartient à un seul skill.
```
