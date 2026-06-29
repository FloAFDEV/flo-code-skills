# Dossier d'architecture — FloStack (mono-dépôt)

> **Statut : PROPOSITION — à valider avant toute implémentation.**
> Ce dossier ne contient **aucun code métier, aucun composant, aucune page, aucune boilerplate**.
> Il décrit *comment* faire évoluer ce dépôt pour qu'il devienne la **source de vérité unique**
> de l'écosystème de développement (skills Claude Code, boilerplate FloStack, templates,
> packages, CLI, documentation).

---

## Pourquoi ce dossier

Le dépôt `flo-code-skills` est aujourd'hui un **système de skills Claude Code** mûr (12 skills,
cohérence vérifiée par CI, versioning SemVer, distribution par symlinks). L'objectif est de
**l'élargir** sans le casser : y faire cohabiter, dans **un seul dépôt GitHub**, tout l'outillage
de développement — du conseil agentique (skills) jusqu'au code exécutable (packages, boilerplate, CLI).

Un seul dépôt = **zéro duplication**, une seule histoire Git, une seule CI, une cohérence garantie
entre *ce que les skills recommandent* et *ce que le code produit*.

---

## Comment lire ce dossier

Les documents suivent l'ordre des 7 livrables demandés. Chacun est autonome et pourra être
validé / discuté séparément, puis implémenté par **petites Pull Requests à objectif unique**.

| # | Document | Répond à |
|---|----------|----------|
| 0 | [`00-audit.md`](./00-audit.md) | **Audit** du dépôt actuel : ce qui existe, forces, contraintes à préserver |
| 1 | [`01-arborescence-cible.md`](./01-arborescence-cible.md) | **Nouvelle arborescence** claire et évolutive (+ choix techniques argumentés) |
| 2 | [`02-placement-des-briques.md`](./02-placement-des-briques.md) | **Place** des skills, docs, templates, packages et CLI |
| 3 | [`03-avantages-inconvenients.md`](./03-avantages-inconvenients.md) | **Avantages / inconvénients** de l'organisation retenue |
| 4 | [`04-roadmap.md`](./04-roadmap.md) | **Roadmap** en 5 phases (restructuration → FloStack → templates → packages → CLI) |
| 5 | [`05-versioning.md`](./05-versioning.md) | **Stratégie de versioning** : faire évoluer FloStack sans casser l'existant |
| 6 | [`06-mutualisation-skills-flostack.md`](./06-mutualisation-skills-flostack.md) | Ce qui **migre** vers FloStack vs ce qui **reste** dans les skills |
| 7 | [`07-revue-mvp.md`](./07-revue-mvp.md) | **Revue critique** : sur-ingénierie, reports pilotés par déclencheur, **MVP livrable en quelques jours** |

> 🟢 **Par où commencer :** le doc 07 prime sur les docs 04–05 pour le court terme. Il recommande de
> livrer d'abord un **MVP minimal** (un seul template Next.js réel, sans packages/CLI/outillage) et de
> ne différer le reste que jusqu'à un déclencheur objectif. Les docs 00–06 restent le **cap long terme**.

---

## Décisions clés proposées (résumé exécutif)

1. **Mono-dépôt = monorepo géré** par **pnpm workspaces + Turborepo**. Un seul dépôt, plusieurs
   espaces (`skills/`, `packages/`, `templates/`, `apps/`, `cli/`, `docs/`).
2. **`skills/` ne bouge pas de la racine.** La distribution actuelle (symlinks via `tools/skills-sync.sh`)
   dépend du chemin `skills/*/SKILL.md` : on le préserve pour ne **rien casser**.
3. **Séparation nette « règle » vs « code »** : les **skills** restent la *spécification* (ce que
   Claude doit faire), les **packages** deviennent l'*implémentation* exécutable (ce que le code fait).
   Ils se référencent mutuellement mais ne se dupliquent jamais.
4. **FloStack = la marque de l'écosystème** : un *golden path* (boilerplate de référence) +
   des *packages* partagés + des *templates* dérivés + une *CLI* de scaffolding.
5. **Versioning indépendant par package via Changesets**, une **« release train » FloStack** (méta-version)
   et une **matrice de compatibilité**. Les projets épinglent des versions ; rien n'est cassé en place.

> ⚠️ Tout ce qui suit est une **proposition d'architecture**. Aucune implémentation ne démarre
> tant que ce dossier n'est pas validé.
