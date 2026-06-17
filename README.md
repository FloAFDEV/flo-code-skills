<!-- LANGUAGE NAV --> **English** · [Français](./README.fr.md)

# flo-code-skills

> Florian's universal Claude Code skills system — a reference baseline built for **professional production**.
> **Next.js 15+** · **Vite/React** · **Supabase** · **Offline-first (Dexie/IndexedDB)** · **SaaS & medical** · **premium UX/UI** · **advanced SEO** · **Playwright E2E**.

12 skills that are **coherent, non-redundant and free of authority conflicts**, **versioned** and automatically verified.
Product goal: **credible, sober, professional** interfaces on par with **Linear, Stripe, Notion, Vercel** — and zero "AI-looking" output.

> 🚀 **Get productive in under 5 minutes:** clone, then see **[INSTALL.md](./INSTALL.md)** (macOS / Linux / Windows, update, uninstall, verify).

---

## 🎯 Philosophy

1. **Zero redundancy** — each responsibility lives in **exactly one** skill (CI-enforced).
2. **Authority hierarchy** — when rules conflict, a priority order decides.
3. **Product pipeline** — `frontend-design → flo-ui → design-taste`, then `playwright` before validation.
4. **Production-first** — rules that apply to real SaaS, not theory.
5. **Extensible** — adding a skill never breaks the rest (CI guarantees it).

---

## 📦 The 12 skills

| Skill | Phase | Domain |
|-------|-------|--------|
| **flo-project-audit** | meta | Orchestrator: project audit, skill selection, scorecard, roadmap (no business rules) |
| **flo-debug** | cross-cutting | Diagnosis: stack traces, React/Next/Supabase/Dexie bugs, performance issues |
| **flo-dev-standards** | foundation | Code quality: strict TS, architecture, errors, refactoring, conventions, code security, unit tests |
| **flo-medical** | constraint | Health data: protection, separation, business logic, compliance (GDPR/HDS) — max authority |
| **flo-nextjs** | build | App Router, Server/Client Components, Metadata API, next/image, perf, Next-flavored React patterns |
| **flo-supabase** | build | RLS, Edge Functions, Auth, access security, data patterns |
| **flo-offline** | build | IndexedDB, Dexie, sync, offline-first, conflicts, cache strategies |
| **flo-seo** | build | Technical SEO, OpenGraph, Twitter Cards, structured data, sitemap, robots, metadata |
| **frontend-design** | plan | UX, information architecture, flows, content hierarchy, screen structure, wireframes |
| **flo-ui** | build | Components, Tailwind, responsive, a11y, animations, micro-interactions, design system, tokens |
| **design-taste** | audit | Visual critique, perceived quality, **AI-artifact detection**, refinement, premium-SaaS benchmark |
| **playwright** | audit | E2E, smoke, critical journeys, UI regression, screenshots, responsive, basic a11y, console, network |

Detailed boundaries: **[`docs/skill-boundaries.md`](./docs/skill-boundaries.md)** · internal architecture: **[`ARCHITECTURE.md`](./ARCHITECTURE.md)**.

---

## 🔀 Product pipeline

```
  Meta: flo-project-audit (orchestrates, doesn't judge)   ·   Diagnosis: flo-debug (bug/perf)

  PLAN ─────────────▶ BUILD ─────────────────▶ AUDIT ─────────────▶ VALIDATION
  frontend-design     flo-nextjs / flo-ui      playwright           feature OK
  (UX, IA, structure) flo-supabase / offline   design-taste
                      flo-seo                  (Code→verify→playwright→design-taste→✅)

  Cross-cutting: flo-dev-standards (all code) · flo-medical (when health data)
```

Every `SKILL.md` has a **When To Invoke** / **When NOT To Invoke** section so Claude activates the right skill at the right time.

---

## 🚀 Installation (quick)

Full guide — macOS, Linux, Windows, updating, uninstalling, verifying: **[INSTALL.md](./INSTALL.md)**.

```bash
# macOS / Linux — install (or update) ALL skills globally into ~/.claude/skills
./install.sh

# Selected skills only
./install.sh --only flo-nextjs flo-ui design-taste

# Into a specific project's .claude/skills
./install.sh /path/to/project
```

```powershell
# Windows (PowerShell)
./install.ps1
```

Claude Code automatically loads any folder containing a valid `SKILL.md`. Re-running the installer **updates** in place.

---

## 🔌 Activation by project type

| Project type | Skills |
|--------------|--------|
| Next.js premium SaaS | dev-standards · nextjs · supabase · frontend-design · ui · seo · design-taste · playwright |
| Medical app (PatientHub) | **all** (medical mandatory) |
| Vite/React offline | dev-standards · frontend-design · ui · offline · design-taste · playwright |
| Landing / marketing | dev-standards · nextjs · frontend-design · ui · seo · design-taste |

`flo-dev-standards` is **always** present (foundation). `flo-project-audit` and `flo-debug` are **universal** (orchestration & diagnosis): recommended on every project.

---

## ✅ Overlap verification

```bash
npm run check:overlaps        # npx tsx tools/check-overlaps.ts
```

Fails (exit ≠ 0) if two skills claim the same responsibility. Runs in **CI** on every PR touching a `SKILL.md` (`.github/workflows/check-overlaps.yml`).

---

## ➕ Add a skill without breaking anything

1. `skills/flo-<domain>/SKILL.md` with full frontmatter (`name`, `version`, `description`, `owns`, `excludes`).
2. Use **new** `owns` tokens only (otherwise CI fails).
3. Place it in the authority hierarchy (`docs/skill-boundaries.md`).
4. Add its matrix row + declare interactions + When To/NOT Invoke sections.
5. `npm run check:overlaps` must stay green.

---

## 🧮 Evaluate a project (scorecard)

`flo-project-audit` scores a project across **10 dimensions** (Architecture, Code quality, UI, UX, SEO,
Accessibility, Performance, Security, Offline, Perceived quality) — each judged by the competent skill,
then aggregated into a prioritized roadmap. Grid: **[`docs/scorecard.md`](./docs/scorecard.md)**.

## 🏷️ Versioning

Each skill carries a `version` field (SemVer) + its own `CHANGELOG.md`; a global `CHANGELOG.md`
aggregates everything. The **non-breaking** evolution policy (additive → deprecation → MAJOR) lives in
**[`docs/VERSIONING.md`](./docs/VERSIONING.md)**.

## 🗺️ Reference documents

- **[INSTALL.md](./INSTALL.md)** — install / update / uninstall / verify (all OSes).
- **[`examples/CLAUDE.md`](./examples/CLAUDE.md)** — minimal `~/.claude/CLAUDE.md` that uses the skills without duplicating them.
- **[`docs/skill-boundaries.md`](./docs/skill-boundaries.md)** — map, matrix, hierarchy, verification.
- **[`docs/scorecard.md`](./docs/scorecard.md)** — 10-dimension audit grid.
- **[`docs/VERSIONING.md`](./docs/VERSIONING.md)** — versioning & evolution.
- **[`docs/MATURITY.md`](./docs/MATURITY.md)** — maturity report & scores.
- **[`docs/AUDIT-PHASE2.md`](./docs/AUDIT-PHASE2.md)** — quality review & fixes.
- **[`ARCHITECTURE.md`](./ARCHITECTURE.md)** — internal principles and interaction map.
- **[`CHANGELOG.md`](./CHANGELOG.md)** — global history.
- `tools/check-overlaps.ts` — automatic overlap + version checker.
- `skills/*/SKILL.md` — detailed rules per domain.

---

_Français : **[README.fr.md](./README.fr.md)**._
