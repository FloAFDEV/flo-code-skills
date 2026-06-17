# Versionnement des skills

Chaque skill porte un champ `version` (SemVer `X.Y.Z`) dans le frontmatter de son `SKILL.md`,
un `CHANGELOG.md` dédié, et contribue au `CHANGELOG.md` global. Objectif : **faire évoluer un skill
sans casser les projets qui l'utilisent déjà**.

## SemVer appliqué aux skills

Un skill est un contrat de règles. On lit le numéro comme une promesse de compatibilité :

| Incrément | Quand | Effet sur les projets existants |
|-----------|-------|----------------------------------|
| **MAJOR** (`2.0.0`) | Suppression/retrait d'une responsabilité (`owns`), **renversement** d'une règle, durcissement qui peut invalider du code conforme à l'ancienne règle | **Cassant** — migration requise |
| **MINOR** (`1.1.0`) | Nouvelle responsabilité, nouvelle règle additive, nouveau pattern — sans contredire l'existant | Rétro-compatible |
| **PATCH** (`1.0.1`) | Clarification, reformulation, exemple, correction de typo — **sens inchangé** | Transparent |

> Règle d'or : si du code qui respectait la version précédente devient non-conforme, c'est un **MAJOR**.

## Procédure d'évolution (non cassante par défaut)

1. **Préférer l'additif.** Ajouter une règle (MINOR) plutôt que réécrire une règle existante.
2. **Déprécier avant de retirer.** Pour supprimer/changer une règle :
   - marquer la règle `⚠️ Déprécié (depuis X.Y.Z) — voir <remplacement>` ;
   - la conserver **au moins un cycle MINOR** ;
   - la retirer ensuite dans un MAJOR documenté.
3. **Tokens `owns` immuables.** Ne jamais réaffecter un token à un autre skill (la CI échouerait). Pour déplacer une responsabilité : déprécier dans le skill source (MAJOR à terme), créer le nouveau token dans le skill cible (MINOR).
4. **Documenter systématiquement** : entrée dans `skills/<skill>/CHANGELOG.md` **et** dans le `CHANGELOG.md` global, avec la raison et la migration si MAJOR.
5. **Vérifier** : `npm run check:overlaps` doit rester vert (zéro chevauchement, `version` présente et SemVer).

## Comment un projet « épingle » une version

Les skills sont **copiés** dans `~/.claude/skills/` ou `<projet>/.claude/skills/`. Un projet utilise
donc la version qu'il a copiée : une évolution du dépôt **n'impacte pas** un projet tant qu'il n'a pas
re-synchronisé. Pour mettre à jour en connaissance de cause :

```bash
# Voir ce qui a changé avant de mettre à jour
less CHANGELOG.md
# Mettre à jour un skill précis
./install.sh --only flo-ui
```

Recommandation : versionner le dossier `.claude/skills/` **dans le repo applicatif** (ou noter les
versions installées), pour savoir exactement quelles règles s'appliquaient à un instant donné.

## Politique de dépréciation (résumé)

`Actif` → `⚠️ Déprécié (MINOR, motif + remplacement)` → `Retiré (MAJOR, migration documentée)`.
Aucune règle ne disparaît silencieusement.
