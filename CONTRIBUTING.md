# Contribuer à flo-code-skills

> Gouvernance Git du dépôt. Objectif : **une seule source de vérité, zéro dérive**.
> Le cycle de développement détaillé vit dans [`docs/git-workflow.md`](./docs/git-workflow.md).

Ce dépôt héberge l'écosystème **FloStack** : les skills Claude Code (`skills/`), le starter
SaaS (`templates/flostack-saas/`), la documentation (`docs/`) et l'outillage (`tools/`).
Quelle que soit la zone touchée, **les règles Git ci-dessous s'appliquent à tout le monde**.

---

## 1. `main` est l'unique branche de référence

- `main` est la **seule** branche stable et la **seule** source de vérité.
- `main` est toujours dans un état **propre, buildable et cohérent**.
- On ne pousse **jamais** directement du travail en cours sur `main` : tout passe par une Pull Request.

## 2. Toute nouvelle branche part de `origin/main`

```bash
git fetch origin
git switch -c <type>/<sujet-court> origin/main
```

- **Jamais** depuis une autre branche de feature, ni depuis une branche déjà fusionnée.
- Mettre à jour `origin/main` (`git fetch`) **avant** de créer la branche.
- Convention de nom : `feat/...`, `fix/...`, `docs/...`, `chore/...`, `refactor/...`.

## 3. Une Pull Request = un objectif unique et limité

- Une PR répond à **une seule** intention claire, énonçable en une phrase.
- Pas de mélange (ex. ne pas corriger un bug **et** refactorer **et** ajouter une feature dans la même PR).
- Une PR à objectif unique est plus simple à relire, à valider et à **annuler**.

## 4. Les grosses évolutions sont découpées en plusieurs PR

- Une évolution importante se livre en **petites PR successives**, chacune autonome et vérifiable.
- Exemple suivi sur le starter : `J1 squelette → J2 auth → J3 UI → J4 SEO`, une PR par étape.
- Préférer plusieurs PR courtes à une seule PR « fleuve » difficile à relire.

## 5. Chaque PR doit rester facilement réversible

- Commits **atomiques**, messages en [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `docs:`, `chore:`…), à l'impératif présent.
- Un refactoring **ne change pas le comportement** et voyage dans son propre commit.
- Objectif : pouvoir **revert** une PR sans effet de bord sur le reste.

## 6. Une branche fusionnée doit être supprimée

- Dès qu'une PR est mergée, **supprimer sa branche** (distante et locale).

```bash
git push origin --delete <branche>     # distante
git branch -d <branche>                # locale (déjà fusionnée)
git fetch --prune                      # nettoyer les références mortes
```

## 7. Les PR redondantes ne restent jamais ouvertes

- Si le contenu d'une PR est **déjà présent dans `main`** (mergé par ailleurs), la PR est **fermée**
  avec un commentaire expliquant la redondance.
- Pas de doublon fonctionnel ouvert : deux PR ne doivent jamais porter le même changement.

---

## Vérifications avant d'ouvrir une PR

Selon la zone touchée (voir [`docs/git-workflow.md`](./docs/git-workflow.md) pour le détail) :

| Zone modifiée | Vérification |
|---------------|--------------|
| `skills/**` | `npm run check:overlaps` (zéro chevauchement, versions valides) |
| `templates/flostack-saas/**` | `pnpm lint` · `pnpm typecheck` · `pnpm build` (dans ce dossier) |
| `docs/**`, `*.md` | relire le rendu Markdown, vérifier les liens relatifs |

> Ne jamais désactiver une vérification « pour gagner du temps ». Une PR qui casse une vérification
> n'est pas prête.

---

## Pilotage des agents (Claude Code)

Les règles Git permanentes destinées aux agents travaillant sur ce dépôt vivent dans
[`CLAUDE.md`](./CLAUDE.md). Elles reflètent exactement la gouvernance ci-dessus.
