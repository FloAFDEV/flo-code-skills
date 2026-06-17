# flo-code-skills

> Système universel de skills Claude Code de Florian — socle de référence orienté **production professionnelle**.
> **Next.js 15+** · **Vite/React** · **Supabase** · **Offline-first (Dexie/IndexedDB)** · **SaaS & médical** · **UX/UI premium** · **SEO avancé** · **E2E Playwright**.

10 skills **cohérents, non redondants et sans conflit d'autorité**, vérifiés automatiquement.
Objectif produit : des interfaces **crédibles, sobres, professionnelles** au niveau de **Linear, Stripe, Notion, Vercel** — et zéro rendu « qui sent l'IA ».

---

## 🎯 Philosophie

1. **Zéro redondance** — chaque responsabilité vit dans **un seul** skill (vérifié par CI).
2. **Autorité hiérarchique** — en cas de conflit, un ordre de priorité tranche.
3. **Pipeline produit** — `frontend-design → flo-ui → design-taste`, puis `playwright` avant validation.
4. **Production-first** — règles applicables à de vrais SaaS, pas de théorie.
5. **Extensible** — ajouter un skill ne casse jamais l'existant (la CI le garantit).

---

## 📦 Les 10 skills

| Skill | Phase | Domaine |
|-------|-------|---------|
| **flo-dev-standards** | socle | Qualité code : TS strict, archi, erreurs, refactoring, conventions, sécurité code, tests unitaires |
| **flo-medical** | contrainte | Données santé : protection, séparation, logique métier, conformité (RGPD/HDS) — autorité max |
| **flo-nextjs** | build | App Router, Server/Client Components, Metadata API, next/image, perf, patterns React Next |
| **flo-supabase** | build | RLS, Edge Functions, Auth, sécurité d'accès, patterns de données |
| **flo-offline** | build | IndexedDB, Dexie, synchro, offline-first, conflits, stratégies de cache |
| **flo-seo** | build | SEO technique, OpenGraph, Twitter Cards, structured data, sitemap, robots, metadata |
| **frontend-design** | plan | UX, architecture d'information, parcours, hiérarchie de contenu, structure d'écran, wireframes |
| **flo-ui** | build | Composants, Tailwind, responsive, a11y, animations, micro-interactions, design system, tokens |
| **design-taste** | audit | Critique visuelle, qualité perçue, **détection artefacts IA**, raffinement, benchmark SaaS premium |
| **playwright** | audit | E2E, smoke, parcours critiques, régressions UI, captures, responsive, a11y de base, console, réseau |

Frontières détaillées : **[`docs/skill-boundaries.md`](./docs/skill-boundaries.md)** · architecture interne : **[`ARCHITECTURE.md`](./ARCHITECTURE.md)**.

---

## 🔀 Pipeline produit

```
  PLAN ─────────────▶ BUILD ─────────────────▶ AUDIT ─────────────▶ VALIDATION
  frontend-design     flo-nextjs / flo-ui      playwright           feature OK
  (UX, IA, structure) flo-supabase / offline   design-taste
                      flo-seo                  (Code→verify→playwright→design-taste→✅)

  Transverse : flo-dev-standards (tout le code) · flo-medical (si données santé)
```

Chaque `SKILL.md` contient une section **When To Invoke** / **When NOT To Invoke** pour que Claude active le bon skill au bon moment.

---

## 🚀 Installation

```bash
# Globale (tous vos projets)
./install.sh
# ou : cp -r skills/* ~/.claude/skills/

# Par projet
cp -r skills/flo-nextjs skills/flo-ui /chemin/projet/.claude/skills/

# Skills choisis seulement
./install.sh --only flo-nextjs flo-ui design-taste
```

Claude Code charge automatiquement tout dossier contenant un `SKILL.md` valide.

---

## 🔌 Activation par type de projet

| Type de projet | Skills |
|----------------|--------|
| Next.js SaaS premium | dev-standards · nextjs · supabase · frontend-design · ui · seo · design-taste · playwright |
| App médicale (PatientHub) | **tous** (medical obligatoire) |
| Vite/React offline | dev-standards · frontend-design · ui · offline · design-taste · playwright |
| Landing / vitrine | dev-standards · nextjs · frontend-design · ui · seo · design-taste |

`flo-dev-standards` est **toujours** présent : c'est le socle.

---

## ✅ Vérification des chevauchements

```bash
npm run check:overlaps        # npx tsx tools/check-overlaps.ts
```

Échoue (exit ≠ 0) si deux skills revendiquent la même responsabilité. Exécuté en **CI** à chaque PR
touchant un `SKILL.md` (`.github/workflows/check-overlaps.yml`).

---

## ➕ Ajouter un skill sans rien casser

1. `skills/flo-<domaine>/SKILL.md` avec frontmatter complet (`name`, `description`, `owns`, `excludes`).
2. Tokens `owns` **nouveaux** uniquement (sinon la CI échoue).
3. Place-le dans la hiérarchie d'autorité (`docs/skill-boundaries.md`).
4. Ajoute sa ligne à la matrice + déclare ses interactions + sections When To/NOT Invoke.
5. `npm run check:overlaps` doit rester vert.

---

## 🗺️ Documents de référence

- **[`docs/skill-boundaries.md`](./docs/skill-boundaries.md)** — cartographie complète, matrice, hiérarchie, vérification.
- **[`ARCHITECTURE.md`](./ARCHITECTURE.md)** — principes internes et carte d'interactions.
- `tools/check-overlaps.ts` — vérificateur automatique de chevauchements.
- `skills/*/SKILL.md` — règles détaillées par domaine.
