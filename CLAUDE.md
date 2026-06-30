# CLAUDE.md — pilotage des agents sur ce dépôt

> Contexte permanent pour tout agent (Claude Code) travaillant sur `flo-code-skills`.
> Court par construction. Les détails vivent dans [`CONTRIBUTING.md`](./CONTRIBUTING.md) et
> [`docs/git-workflow.md`](./docs/git-workflow.md) — **ne pas les recopier ici**.

Ce dépôt est la **source de vérité unique** de l'écosystème FloStack : skills Claude Code
(`skills/`), starter SaaS (`templates/flostack-saas/`), documentation (`docs/`), outillage (`tools/`).

---

## 🔒 Règle Git permanente (anti-dérive)

**`origin/main` est la seule source de vérité.** Après chaque fusion d'une Pull Request, l'agent doit :

1. **Considérer `origin/main` comme la seule référence** : se resynchroniser dessus (`git fetch origin`)
   avant toute nouvelle action.
2. **Toujours créer les nouvelles branches depuis `origin/main`** — jamais depuis une branche de
   feature ni une branche déjà fusionnée.
3. **Ne jamais réutiliser une ancienne branche** comme base d'une nouvelle PR, **sauf demande explicite**
   de l'utilisateur.
4. **Proposer la suppression de la branche fusionnée** (distante + locale) dès que la PR est mergée.
5. **Signaler toute PR devenue redondante** (contenu déjà présent dans `main`) et proposer de la fermer.

> Cette règle existe pour empêcher la réapparition du problème de troncs multiples : une seule branche
> de vérité (`main`), des PR courtes à objectif unique, supprimées après merge.

---

## ✅ Avant d'ouvrir une PR

- PR à **objectif unique** ; découper les grosses évolutions en plusieurs PR.
- Lancer les vérifications adaptées à la zone touchée (voir `docs/git-workflow.md` §4).
- Garder la PR **petite et réversible**.

## 🧭 Skills

Les règles de qualité/architecture vivent dans `skills/*/SKILL.md` (invoquer le skill concerné,
ne pas les redécrire). `flo-dev-standards` s'applique à tout le code ; `flo-nextjs` cadre le starter.
