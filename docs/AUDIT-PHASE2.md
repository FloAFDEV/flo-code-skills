# Audit Phase 2 — revue des skills

Audit des 10 skills initiaux : responsabilités trop larges/vagues, règles à comportement
imprévisible, contradictions latentes malgré l'absence de chevauchement de tokens. Chaque
constat indique la **correction appliquée** (ou la justification de non-action).

## 1. Responsabilités trop larges

| Skill | Constat | Décision |
|-------|---------|----------|
| `flo-dev-standards` · `code-security` | « sécurité du code » peut sembler empiéter sur supabase/medical et sur-déclencher | **Borné** : design-time (validation entrées, secrets en config, anti-injection). Le *diagnostic* runtime part vers `flo-debug` ; l'*accès données* reste à supabase ; la *conformité* à medical. Frontière ajoutée en *When NOT To Invoke*. |
| `flo-dev-standards` · `error-handling` | Confusion possible avec le débogage d'erreurs | **Distingué** : `error-handling` = *pattern* (Result, boundaries) ; `error-diagnosis` = runtime → nouveau skill `flo-debug`. |
| `frontend-design` · `ux` | Token très large | **Conservé** mais cadré par *When NOT To Invoke* (« s'arrête au wireframe ») ; l'implémentation est exclue explicitement. |
| `flo-nextjs` · `nextjs-performance` | Risque de happer toute question de perf | **Distingué** de `performance-diagnosis` (`flo-debug`) et du `budget CWV` (`flo-seo`) : *construire* vs *diagnostiquer* vs *cibler*. |

## 2. Responsabilités trop vagues

| Skill | Constat | Décision |
|-------|---------|----------|
| `design-taste` | « qualité perçue » est subjectif | Encadré par la **méthode** (constat localisé + correction actionnable rattachée à un skill) et le **benchmark nommé** (Linear/Stripe/Notion/Vercel). |
| `flo-project-audit` (nouveau) | « audit » pourrait recouper code-review et design-taste | **Séparé** : project-audit = *orchestration + scorecard + roadmap* ; code-review = *code (change-level)* ; design-taste = *visuel*. project-audit ne juge pas, il route. |

## 3. Règles à comportement imprévisible

| Skill | Règle | Risque | Correction |
|-------|-------|--------|------------|
| `flo-medical` | « en cas de doute, traiter comme sensible » | Sur-conservatisme hors domaine santé | **Bornée au contexte applicatif santé.** |
| `design-taste` | détection d'artefacts IA | Bannir des patterns légitimes (un gradient peut être voulu) | Règle formulée « bannir **ou justifier** » + jugement **en contexte**, pas catégorique. |
| `flo-debug` (nouveau) | optimisation perf | « optimisation spéculative » non mesurée | Anti-règle : **jamais optimiser sans mesure**, jamais de correctif sans repro. |

## 4. Contradictions latentes (sans chevauchement de tokens)

| Tension | Skills | Résolution |
|---------|--------|------------|
| Simplifier vs accessibilité | `design-taste` (retirer l'ornement) vs `flo-ui` (a11y non négociable) | Hiérarchie : **a11y (ui) > esthétique (taste)**. design-taste s'incline, déjà inscrit dans les deux skills. |
| Page publique (SEO) vs protégée | `flo-seo` vs `flo-supabase`/`flo-medical` | **noindex + auth gagnent toujours** ; inscrit dans seo et medical. |
| Cache local périmé vs UI | `flo-offline` vs `flo-ui` | **Intégrité des données > confort visuel** ; inscrit. |
| Optimiser le rendu vs frontière Server/Client | `flo-nextjs` vs perf | nextjs tranche le rendu ; `flo-debug` diagnostique, ne casse pas la frontière. |

Aucune contradiction **non résolue** : toutes retombent sur la hiérarchie d'autorité.

## 5. Déplacements de responsabilités depuis `flo-dev-standards` (item 6)

Question : faut-il déplacer des responsabilités vers `flo-debug` ou `flo-project-audit` ?

**Conclusion : aucun déplacement de token — frontières affinées à la place.**

- `error-handling` **reste** dans dev-standards (c'est un *pattern* de conception). Le *diagnostic*
  runtime est une responsabilité **nouvelle** (`error-diagnosis`) créée dans `flo-debug` — pas un
  déplacement, une distinction.
- `code-review` **reste** dans dev-standards (revue *au niveau du changement/PR*). L'*audit projet*
  (`project-audit`) est une responsabilité **nouvelle** dans `flo-project-audit` — niveau projet,
  orchestration, pas jugement de code.
- `unit-testing` **reste** dans dev-standards (distinct de `e2e-tests`/playwright et de
  `error-diagnosis`/debug).

Le principe **une responsabilité = un seul propriétaire** est préservé : les nouveaux skills
ajoutent des tokens neufs, ils n'en récupèrent aucun (vérifié par `tools/check-overlaps.ts`).

## 6. Compatibilité Claude Code & surcharge (item 7)

- **Contexte permanent** = uniquement `name` + `description` de chaque skill (≈ 12 lignes courtes).
  Le corps des `SKILL.md` n'est chargé **qu'à l'invocation** du skill concerné.
- Frontmatter `owns`/`excludes`/`version` : ignoré par le loader Claude Code, lu seulement par
  `check-overlaps.ts` → **aucun coût** à l'invocation.
- **Changelogs hors `SKILL.md`** (`CHANGELOG.md` séparés) pour garder les `SKILL.md` lean.
- **Anti-surcharge active** : `flo-project-audit` a pour règle d'invoquer le **minimum** de skills
  nécessaires (jamais « tous par défaut »), et chaque skill a un *When NOT To Invoke* qui évite les
  activations parasites. Descriptions rédigées avec des déclencheurs **spécifiques** (pas génériques)
  pour ne pas se déclencher à tort.

## Verdict

```
12 skills · 88 responsabilités canoniques uniques · 0 chevauchement critique
```
Système cohérent, versionné, mesurable (scorecard) et orchestrable (project-audit), sans dette de
chevauchement et sans surcharge d'invocation.
