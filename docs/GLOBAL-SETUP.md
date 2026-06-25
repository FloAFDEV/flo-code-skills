# Système GLOBAL de gestion des skills (rapport + référence)

> Objectif : **tous** tes projets utilisent tes skills Claude Code, sans config par repo, sans copie
> manuelle, et sans dépendre d'un scope GitHub. Source de vérité unique = un clone local du repo,
> exposé à Claude Code via des **liens symboliques**, tenu à jour par un **hook `SessionStart`**.

---

## 1. Audit de l'existant (point de départ)

| Élément | Constat |
|---|---|
| Chargement des skills | Natif : Claude Code lit tout dossier contenant `SKILL.md` dans `~/.claude/skills/` (global) ou `<projet>/.claude/skills/` (par projet). |
| Mécanisme installé | `install.sh` / `install.ps1` qui **copient** les 12 skills vers la cible. |
| Limite n°1 | La copie devient **périmée** : il faut `git pull && ./install.sh` **à la main** après chaque MAJ. |
| Limite n°2 | Le scope GitHub qui posait problème vient du mécanisme **plugin/marketplace** (accès repo requis au démarrage), pas des skills eux-mêmes. |
| Skills présents | `flo-project-audit, flo-dev-standards, flo-debug, flo-medical, flo-nextjs, flo-supabase, flo-offline, flo-seo, frontend-design, flo-ui, design-taste, playwright`. |

---

## 2. Architecture retenue

```
~/.claude/
├── flo-code-skills/                 # clone unique = SOURCE DE VÉRITÉ locale
│   ├── skills/flo-nextjs/SKILL.md
│   └── tools/skills-sync.sh         # moteur : pull throttlé + (re)lien des symlinks
├── skills/
│   ├── flo-nextjs   ──► ~/.claude/flo-code-skills/skills/flo-nextjs   (symlink)
│   ├── flo-supabase ──► …/skills/flo-supabase
│   └── … (un symlink par skill)
└── settings.json                    # hook SessionStart → skills-sync.sh --quiet
```

**Trois propriétés clés**

1. **Indépendant du repo courant** — les skills vivent dans `~/.claude`, donc visibles par *tous* les
   projets et *tous* les agents, sans rien ajouter dans chaque repo.
2. **Zéro copie manuelle** — `git pull` dans le clone met à jour *tous* les projets instantanément
   (les symlinks pointent vers le clone). Le hook le fait automatiquement.
3. **Zéro scope GitHub** — c'est un `git pull` d'un repo public local, sans rapport avec le scope du
   projet GitHub ouvert. On évite totalement le mécanisme plugin/marketplace qui, lui, cassait.

---

## 3. Ce qui a été créé

| Fichier | Rôle |
|---|---|
| `bootstrap.sh` | **Installation one-shot** : clone → liens → hook. Idempotent. |
| `tools/skills-sync.sh` | **Moteur** : `git pull` throttlé (1×/jour, `timeout 30`, non-bloquant) + (re)création des symlinks. Appelé par le hook et par bootstrap. Modes : `--list`, `--force`, `--link-only`, `--unlink`, `--quiet`. |
| `install.sh` (modifié) | Ajout du flag `--link` (délègue à `skills-sync.sh`) + en-tête qui pointe vers `bootstrap.sh`. Le mode **copie** reste disponible (Windows sans symlinks, install dans un seul projet). |
| `INSTALL.md` (modifié) | Nouvelle section « ⭐ 0bis. Installation GLOBALE recommandée ». |
| `docs/GLOBAL-SETUP.md` | Ce rapport. |

**Emplacements sur ta machine après `./bootstrap.sh`**

- Clone : `~/.claude/flo-code-skills/`
- Liens : `~/.claude/skills/<skill>` (symlinks)
- Hook : entrée `SessionStart` dans `~/.claude/settings.json` (les autres réglages sont **préservés** ;
  un backup `settings.json.bak.<horodatage>` est créé avant toute modification).

---

## 4. Installation

```bash
git clone https://github.com/FloAFDEV/flo-code-skills.git
cd flo-code-skills
./bootstrap.sh
```

Puis **redémarre Claude Code**.

> Override avancé : `FLO_SKILLS_REPO=~/dev/flo-code-skills ./bootstrap.sh` pour utiliser un clone que
> tu maintiens ailleurs.

---

## 5. Vérifier le bon fonctionnement

```bash
# a) Les 12 skills sont-ils liés ?
bash ~/.claude/flo-code-skills/tools/skills-sync.sh --list
#   → ✓ flo-nextjs (v1.0.0) → ~/.claude/flo-code-skills/skills/flo-nextjs … (×12)

# b) Le hook est-il bien en place ?
jq '.hooks.SessionStart' ~/.claude/settings.json

# c) Un skill est-il lisible à travers le lien ?
head -3 ~/.claude/skills/flo-nextjs/SKILL.md
```

Dans Claude Code : tape **`/`** → les skills `flo-*` apparaissent dans la liste des skills disponibles.
Sinon, demande une tâche qui doit en déclencher un (ex. « audite ce projet » → `flo-project-audit`).
Les **agents** Claude Code héritent de la même liste : un skill lié est utilisable par eux aussi.

> Note : la liste des skills est construite au **démarrage** de session. Après un `bootstrap.sh` ou
> l'ajout d'un skill, **redémarre Claude Code** pour qu'il les voie.

---

## 6. Ajouter un nouveau skill à l'avenir

1. Crée le dossier dans le repo : `skills/flo-monskill/SKILL.md` (suis le format de `ARCHITECTURE.md`,
   frontmatter `name` / `version` / `description` / `owns` / `excludes`).
2. Commit + push sur `main`.
3. Sur chaque machine : **rien à faire**. Le hook `SessionStart` fera le `git pull` (≤ 24 h) et créera
   le symlink automatiquement. Pour l'avoir tout de suite :
   ```bash
   bash ~/.claude/flo-code-skills/tools/skills-sync.sh --force
   ```
4. Redémarre Claude Code → le nouveau skill apparaît.

> Le moteur **découvre** les skills en scannant `skills/*/SKILL.md` : aucune liste à maintenir dans
> les scripts pour les nouveaux skills (la liste figée de `install.sh` ne concerne que le mode copie).

---

## 7. Désinstaller / revenir en arrière

```bash
bash ~/.claude/flo-code-skills/tools/skills-sync.sh --unlink   # retire les liens (garde tes autres skills)
# supprime le hook : édite ~/.claude/settings.json (ou restaure un .bak.*)
rm -rf ~/.claude/flo-code-skills                               # supprime le clone
```

---

## 8. FAQ rapide

- **Ça casse mes skills existants ?** Non. Le moteur ne touche que les dossiers présents dans le repo ;
  tes autres skills dans `~/.claude/skills/` sont laissés intacts.
- **Hors-ligne ?** Le `git pull` a un `timeout` et avale les erreurs réseau : la session démarre quand
  même avec la dernière version locale.
- **Windows ?** Les symlinks demandent le mode développeur / des droits. Sinon, utilise `install.sh`
  (mode copie) décrit dans `INSTALL.md`, et relance-le après chaque `git pull`.
- **Plusieurs machines ?** Lance `bootstrap.sh` sur chacune ; elles partagent le même repo distant.
