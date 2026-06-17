# Architecture du système flo-code-skills

Principes internes et carte d'interactions. **La matrice de responsabilités complète et la
hiérarchie d'autorité vivent dans [`docs/skill-boundaries.md`](./docs/skill-boundaries.md)**
(source de vérité, vérifiée par CI). Ce document explique *pourquoi* le système tient.

---

## 1. Trois principes

1. **Une responsabilité, un seul propriétaire.** Chaque token `owns` (frontmatter des `SKILL.md`)
   appartient à exactement un skill. `tools/check-overlaps.ts` échoue sinon.
2. **Autorité hiérarchique.** Quand des règles se contredisent, le skill le plus haut l'emporte
   (medical > supabase > dev-standards > nextjs > offline > frontend-design > ui > seo > design-taste > playwright).
3. **Pipeline par phase.** Les skills collaborent dans le temps : `PLAN → BUILD → AUDIT → VALIDATION`.
   C'est ce découpage temporel qui empêche les trois skills de design de se chevaucher.

---

## 2. Le découpage qui évite les collisions

### Le trio design (le point le plus sensible)
- **frontend-design** = *quoi/où/pourquoi* (structure, IA, parcours) — **avant les pixels**. Ne code pas.
- **flo-ui** = *comment* (composants, tokens, a11y, animation) — **transforme la structure en code**.
- **design-taste** = *est-ce bon ?* (critique, anti-IA, raffinement) — **après le rendu**. Ne code pas.

### Les autres frontières classiques
- **Metadata** : nextjs = mécanique de l'API · seo = contenu.
- **Performance** : nextjs = rendu/bundle · seo = budget/ranking · offline = cache local.
- **Sécurité** : medical = exigence · supabase = accès données · dev-standards = code.
- **Cache** : offline = local/IndexedDB · nextjs = HTTP/`revalidate`.
- **Captures** : playwright = produit · design-taste = interprète.
- **Tests** : dev-standards = unitaire · playwright = E2E.

> Détail exhaustif (Couvre / Ne couvre PAS / Dépendances / Risques) → `docs/skill-boundaries.md`.

---

## 3. Carte des interactions

```
        flo-medical ──contraint──▶ supabase · offline · nextjs · seo · playwright
            │ (autorité max, données santé)
            ▼
  ┌───────────────── BUILD ─────────────────┐
  flo-supabase ◀──sync──▶ flo-offline        │   flo-nextjs héberge flo-ui,
  (accès DB)              (cache local)       │   branche flo-seo (metadata)
  └───────────────────────────────────────────┘
            ▲ data            ▲ structure
            │                 │
  PLAN ─────┴─── frontend-design ──▶ flo-ui ──▶ design-taste ──▶ validation
                (UX/IA/structure)   (code)      (audit visuel)
                                       ▲             ▲
                                       └─ playwright ─┘ (E2E + captures)

  Socle transverse : flo-dev-standards (consulté par tous, ne consulte personne)
```

**Lectures clés**
- `flo-medical` **contraint** sans implémenter : il pose les exigences, les autres exécutent.
- `flo-supabase` ↔ `flo-offline` se coordonnent sur la synchro (serveur = vérité, local = cache).
- `frontend-design → flo-ui → design-taste` est un **flux**, pas une hiérarchie de pouvoir : chacun
  intervient à sa phase ; design-taste renvoie ses corrections en amont.
- `playwright` valide le build et **alimente** design-taste en captures.
- `flo-dev-standards` est **consulté par tous** ; il ne dépend de personne.

---

## 4. Format d'un SKILL.md

```markdown
---
name: flo-xxx
description: Quand activer ce skill (déclencheurs concrets).
owns:        # responsabilités canoniques — uniques dans tout le repo
  - token-a
excludes:    # ce qu'il délègue (token possédé par un AUTRE skill)
  - token-b
---

# flo-xxx
## ▶️ When To Invoke      → déclencheurs d'activation
## ⏹️ When NOT To Invoke  → quand déléguer, et à qui
## 🎯 Scope               → responsabilités (miroir de `owns`)
## 🚫 Hors-scope          → délégations (miroir de `excludes`)
## ✅ Règles strictes      → règles numérotées, applicables
## ⛔ Anti-règles          → ce qu'il ne fait JAMAIS
## 🥇 Priorité             → position dans la hiérarchie + arbitrages
## 🔗 Interactions         → qui il consulte / à qui il délègue
```

Le frontmatter `owns`/`excludes` est la version **machine-lisible** des sections Scope/Hors-scope ;
c'est lui que `tools/check-overlaps.ts` analyse.
