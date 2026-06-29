# 3 — Avantages & inconvénients

> Décision honnête : un monorepo d'écosystème a un coût réel. On l'expose, et on dit comment on le
> maîtrise. Aucune décision n'est gratuite.

---

## 3.1 Avantages

| Avantage | En quoi c'est concret ici |
|----------|---------------------------|
| **Zéro duplication** | Un design token, une règle RLS, un helper SEO existent **une seule fois** : dans un package, consommé par tous les templates. Exigence n°1 du projet. |
| **Cohérence skills ⇄ code garantie** | Les skills *décrivent* ce que les packages *exécutent*, **dans le même commit / la même PR**. Impossible que le conseil et le code divergent silencieusement. |
| **Une seule histoire Git, une seule CI** | Un changement transverse (ex. nouveau token) se voit et se teste d'un bloc. Refactor atomique multi-packages possible (impossible en multi-repos). |
| **Onboarding & DX** | `npx create-flostack` part des templates qui consomment déjà tout. Un nouveau projet hérite *par construction* des standards (TS strict, a11y, RLS, SEO). |
| **Réutilise la culture existante** | La discipline « propriété unique + autorité + versioning non cassant + CI » est déjà là pour les skills ; on l'étend, on ne l'invente pas. |
| **Évolutif sans réorganisation** | Ajouter package/template/app = ajouter un dossier. Les voisins ne bougent pas (doc 01 §1.3). |
| **Versioning indépendant** | Chaque package évolue à son rythme (Changesets) ; un projet épingle ce dont il a besoin (doc 05). |
| **Un seul endroit à sécuriser/auditer** | Une CI, un Dependabot, une politique de secrets, une licence. |

---

## 3.2 Inconvénients (et mitigation)

| Inconvénient | Risque | Mitigation proposée |
|--------------|--------|---------------------|
| **Complexité d'outillage** | pnpm + Turbo + Changesets à apprendre/maintenir | Introduits **progressivement** (doc 04). Config racine minimale ; aucun outil tant que la Phase qui l'exige n'est pas atteinte. |
| **Dépôt qui grossit** | Clone plus lourd, CI plus longue | `apps/`/`templates/` restent légers ; cache Turbo + jobs CI ciblés par chemin (comme `check-overlaps.yml` déjà filtré sur `SKILL.md`). |
| **Couplage perçu** | « tout est lié, j'ai peur de tout casser » | Versioning indépendant + matrice de compatibilité (doc 05) : on touche un package sans publier les autres. Tests par package (cache Turbo). |
| **Risque pour la distribution des skills** | Casser `skills-sync.sh` en réorganisant | **Contrainte dure** : `skills/` ne bouge pas, scripts inchangés (doc 00 §0.4, Phase 1 doc 04). |
| **Versioning hétérogène** | Skills (copiés) vs packages (publiés npm) = deux modèles | Assumé et documenté : skills gardent leur SemVer/CHANGELOG ; packages passent à Changesets. La frontière est nette (doc 06). |
| **Frontière skills ⇄ packages floue avec le temps** | Du code qui rampe dans un skill, ou de la prose dans un package | Règle explicite (doc 06) + check d'outillage en `tools/` (un skill ne contient pas de code ; un package matérialise un skill déclaré). |
| **Charge de gouvernance** | Reviews plus exigeantes (impacts transverses) | Petites PR à objectif unique (méthode déjà choisie) + `code-review` ciblé. |
| **Publication npm** | Gérer un scope `@flostack/*`, accès, 2FA | N'arrive qu'en Phase 4. Option de repli : packages internes (`workspace:*`) non publiés tant que non nécessaire. |

---

## 3.3 Alternatives écartées (et pourquoi)

| Alternative | Pourquoi écartée |
|-------------|------------------|
| **Multi-dépôts (un repo par brique)** | Viole l'exigence « un seul dépôt / zéro duplication ». Synchronisation manuelle, versions qui dérivent, conseil et code dans des histoires séparées. |
| **Tout copier dans chaque template (pas de packages)** | Duplication massive ; un correctif de sécurité RLS devrait être répliqué *N* fois. C'est exactement ce qu'on fuit. |
| **Nx au lieu de Turborepo** | Plus puissant mais plus lourd/opiniâtre. Turbo suffit, plus simple, aligné Vercel/Next. Réévaluable si l'échelle l'exige. |
| **Publier les skills sur npm** | Casse la distribution par symlinks (`skills-sync.sh`) qui fait la valeur actuelle (un `git pull` met tout à jour, hors ligne, multi-projets). |
| **Versionner tout le repo d'un seul numéro** | Forcerait un MAJOR global pour le changement d'un seul package. Changesets (versions indépendantes) évite ce couplage. |

---

## 3.4 Verdict

Le monorepo est **le bon outil pour cette exigence** (un dépôt, zéro duplication, cohérence
conseil ⇄ code). Son coût principal — l'outillage — est **maîtrisé par l'introduction progressive**
de la roadmap (doc 04) : on ne paie chaque outil qu'au moment où une phase en a besoin, et la
contrainte « ne rien casser » protège l'acquis (les skills) à chaque étape.
