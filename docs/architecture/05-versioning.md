# 5 — Stratégie de versioning

> Objectif : **faire évoluer FloStack sans casser les projets existants**. On prolonge la philosophie
> déjà écrite dans [`docs/VERSIONING.md`](../VERSIONING.md) (additif → dépréciation → MAJOR) en
> l'adaptant à des **packages publiés/consommés** (et non plus seulement à des fichiers copiés).

---

## 5.1 Deux régimes de versioning, assumés

| Régime | Pour quoi | Mécanisme | Comment un projet « épingle » |
|--------|-----------|-----------|-------------------------------|
| **Skills** (existant) | `skills/flo-*` | SemVer par skill + `CHANGELOG.md` ; vérifié par `check-overlaps` | Fichiers **copiés/symlinkés** : le projet utilise la version qu'il a synchronisée (cf. `docs/VERSIONING.md`). |
| **Packages** (nouveau) | `packages/@flostack/*`, `cli` | SemVer indépendant via **Changesets** | Dépendance npm épinglée (`"@flostack/ui": "^2.3.0"`) dans le `package.json` du projet. |

> Les deux suivent **la même règle d'or** : *si du code conforme à l'ancienne version devient
> non-conforme, c'est un MAJOR.* La cohérence philosophique est préservée ; seul l'outil diffère.

---

## 5.2 SemVer appliqué aux packages

| Incrément | Quand | Effet projet |
|-----------|-------|--------------|
| **MAJOR** `2.0.0` | suppression d'export, signature changée, renversement de comportement, durcissement invalidant l'usage existant | **Cassant** — migration requise (codemod fourni si possible) |
| **MINOR** `1.1.0` | nouvel export, nouvelle option **rétro-compatible**, nouveau composant | Sûr |
| **PATCH** `1.0.1` | correction de bug sans changement d'API, perf, doc | Transparent |

**Procédure non cassante par défaut** (identique aux skills) :
1. **Préférer l'additif** (nouvelle option avec défaut sûr plutôt que signature modifiée).
2. **Déprécier avant de retirer** : marquer `@deprecated` (JSDoc) au moins **un cycle MINOR**, puis
   retirer en MAJOR documenté.
3. **Changeset obligatoire** sur toute PR qui modifie un package : il génère bump + changelog.
4. Tout MAJOR fournit une **note de migration** (et un **codemod** quand c'est automatisable).

---

## 5.3 La « release train » FloStack (méta-version)

Les packages sont versionnés **indépendamment** (un correctif `seo` ne bouge pas `ui`). Mais un
utilisateur veut un repère simple : *« je suis sur FloStack 2 »*. On introduit donc une **méta-version**.

- **`flostack` = un meta-package** (ou un tag de release) qui **épingle un ensemble cohérent** de
  versions de packages testées ensemble → c'est ce qu'un template installe.
- Exemple de **matrice de compatibilité** (vit dans `docs/`), mise à jour à chaque train :

  | FloStack | `@flostack/core` | `@flostack/ui` | `@flostack/supabase` | `@flostack/seo` | `@flostack/next` |
  |----------|------------------|----------------|----------------------|-----------------|------------------|
  | **1.x**  | 1.x | 1.x | 1.x | 1.x | 1.x |
  | **2.x**  | 2.x | 2.x | 1.x | 2.x | 2.x |

- Un projet peut **soit** suivre le train (`flostack@2`), **soit** épingler des packages à la carte.
  Les deux marchent ; le train est juste un raccourci recommandé.

---

## 5.4 Ce qui protège les projets existants

1. **Rien n'est modifié en place.** Un projet généré dépend de versions **figées** dans son
   `package.json`. Publier une nouvelle version de package **n'impacte aucun projet** tant qu'il ne
   met pas à jour volontairement (`pnpm up`). Même garantie que les skills aujourd'hui.
2. **Plages SemVer respectées.** `^2.3.0` n'attrape jamais un `3.0.0`. Un MAJOR ne se propage jamais
   tout seul.
3. **`flostack upgrade` (CLI, Phase 5)** : met à jour de façon *assistée* — lit la matrice, applique
   les codemods des MAJOR, affiche les notes de migration. Jamais une mise à jour aveugle.
4. **LTS / fenêtres de support.** On documente les trains supportés (ex. *N* et *N-1*) ; les
   dépréciations vivent au moins un MINOR avant retrait.
5. **Changelogs partout.** Chaque package, chaque train, le repo global. Aucune évolution silencieuse.

---

## 5.5 Politique de publication (à trancher en Phase 4)

- **Option A — publier sur npm** sous `@flostack/*` (scope public). Avantage : projets *hors dépôt*
  consommables. Coût : gestion d'accès/2FA/release.
- **Option B — packages internes** (`workspace:*`, non publiés). Avantage : zéro friction au début.
  Limite : seuls les projets *du monorepo* en profitent.

> **Recommandation** : commencer **B** (interne) en Phase 4, basculer **A** (npm public) quand un
> projet externe doit consommer les packages. Le code ne change pas ; seul le mode de distribution évolue.

---

## 5.6 Versioning des templates et de la CLI

- **Templates** : suivent la release train (un template = un point d'entrée vers un train cohérent).
  Mettre à jour un template = pointer vers le train suivant + note de migration.
- **CLI** : SemVer propre. `create-flostack` doit toujours pouvoir générer le **dernier train stable**
  et idéalement le **N-1**. Un MAJOR CLI ne change que l'expérience de scaffolding, pas les projets déjà créés.

---

## 5.7 Résumé

> **Versions indépendantes par package (Changesets)** + **release train FloStack (méta-version + matrice)**
> + **projets qui épinglent leurs dépendances** + **dépréciation avant retrait** + **`flostack upgrade`
> avec codemods**. Résultat : FloStack peut avancer (même en MAJOR) **sans jamais casser un projet qui
> n'a pas demandé à bouger** — exactement la garantie déjà offerte aux skills, étendue au code.
