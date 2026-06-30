# Cycle de développement Git

> Le « comment » au quotidien. Les **règles** de gouvernance vivent dans
> [`../CONTRIBUTING.md`](../CONTRIBUTING.md) ; ce document décrit le **cycle** étape par étape.

Principe directeur : **on part toujours de `origin/main`, on livre par petites PR, on supprime la
branche après merge, on revient sur `main`.**

---

## Schéma du workflow

```
        origin/main (unique vérité)
             │
             │  1. git fetch origin
             │  2. git switch -c feat/sujet origin/main
             ▼
        feat/sujet  ── 3. développement (commits atomiques)
             │
             │  4. vérifications locales : lint · typecheck · build
             │  5. git push -u origin feat/sujet
             ▼
        Pull Request  ── objectif unique ── revue ──►  6. merge dans main
             │                                              │
             │  7. git push origin --delete feat/sujet      │
             │     (suppression de la branche)              │
             ▼                                              ▼
        git switch main ── 8. git pull --ff-only ──►  origin/main (à jour)
                              + git fetch --prune
```

---

## Étapes détaillées

### 1. Se synchroniser sur la vérité
```bash
git fetch origin
```

### 2. Créer la branche depuis `origin/main`
```bash
git switch -c <type>/<sujet-court> origin/main
```
- `type` : `feat` · `fix` · `docs` · `chore` · `refactor`.
- **Jamais** depuis une autre branche de feature ou une branche déjà fusionnée.

### 3. Développer
- Commits **atomiques**, [Conventional Commits](https://www.conventionalcommits.org/), impératif présent.
- Un objectif unique par branche ; si le périmètre grossit, **découper en plusieurs PR**.

### 4. Vérifier localement (avant la PR)
Selon la zone touchée :

| Zone | Commandes |
|------|-----------|
| `skills/**` | `npm run check:overlaps` |
| `templates/flostack-saas/**` | `cd templates/flostack-saas && pnpm install && pnpm lint && pnpm typecheck && pnpm build` |
| `docs/**`, `*.md` | relecture du rendu + vérification des liens relatifs |

> La règle `flo-dev-standards` s'applique à tout le code ; `flo-nextjs` cadre le starter (App Router,
> Server Components, build sans désactiver les vérifs TS/ESLint).

### 5. Pousser la branche
```bash
git push -u origin <type>/<sujet-court>
```

### 6. Ouvrir la Pull Request
- **Base : `main`.** Titre clair, description = l'objectif unique + le périmètre.
- Joindre le résultat des vérifications de l'étape 4.
- Garder la PR petite et **réversible**.

### 7. Merger puis supprimer la branche
- Une fois la PR approuvée et la CI verte : merger dans `main`.
- **Immédiatement après**, supprimer la branche :
```bash
git push origin --delete <type>/<sujet-court>   # distante
git branch -d <type>/<sujet-court>              # locale
```

### 8. Revenir sur `main` à jour
```bash
git switch main
git pull --ff-only origin main
git fetch --prune        # purge les références de branches supprimées
```

---

## Anti-dérive (rappels)

- ❌ Ne pas rouvrir ni réutiliser une branche fusionnée comme base d'une nouvelle PR.
- ❌ Ne pas laisser ouverte une PR dont le contenu est déjà dans `main` → la fermer.
- ❌ Ne pas accumuler des branches mortes → `git fetch --prune` régulièrement.
- ✅ Une intention = une branche = une PR = un merge = une suppression.
