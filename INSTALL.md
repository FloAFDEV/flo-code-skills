<!-- LANGUAGE NAV --> [English](./README.md) · [Français](./README.fr.md)

# Installation guide / Guide d'installation

> 🎯 Goal: clone → operational in **under 5 minutes**.
> Skills are plain folders containing a `SKILL.md`. Claude Code loads any such folder placed in
> `~/.claude/skills/` (global) or `<project>/.claude/skills/` (per-project). Installing = copying.

## 0. Prerequisites

- **Git** (to clone).
- **Claude Code** installed.
- **Node.js ≥ 18** *(only to run the optional overlap checker `npm run check:overlaps`; not required to use the skills).*

```bash
git clone https://github.com/FloAFDEV/flo-code-skills.git
cd flo-code-skills
```

---

## ⭐ 0bis. Installation GLOBALE recommandée (symlinks + auto-update)

Pour que **tous** tes projets voient tes skills sans config par repo, et **sans jamais recopier
à la main**, lance le bootstrap une seule fois :

```bash
./bootstrap.sh
# ou, sans cloner d'abord :
curl -fsSL https://raw.githubusercontent.com/FloAFDEV/flo-code-skills/main/bootstrap.sh | bash
```

Ce qu'il met en place :

1. **Un clone unique** dans `~/.claude/flo-code-skills` (la source de vérité locale).
2. **Des liens symboliques** `~/.claude/skills/<skill>` → clone. Claude Code les charge nativement
   pour tous les projets et tous les agents.
3. **Un hook `SessionStart`** dans `~/.claude/settings.json` qui fait un `git pull` *throttlé*
   (1×/jour) à chaque session → les skills restent à jour tout seuls.

**Pourquoi c'est mieux que la copie** : un seul `git pull` met à jour *tous* les projets d'un coup ;
aucune recopie ; et comme c'est un simple clone local, ça **ne dépend d'aucun scope GitHub** (contrairement
au mécanisme plugin/marketplace). Détails → [`docs/GLOBAL-SETUP.md`](./docs/GLOBAL-SETUP.md).

```bash
# Vérifier / forcer une MAJ / délier
bash ~/.claude/flo-code-skills/tools/skills-sync.sh --list
bash ~/.claude/flo-code-skills/tools/skills-sync.sh --force   # pull immédiat
bash ~/.claude/flo-code-skills/tools/skills-sync.sh --unlink  # retirer les liens
```

> Les sections **1–6** ci-dessous décrivent l'alternative par **copie** (`install.sh`), utile pour :
> Windows sans symlinks, ou installer des skills dans **un seul** projet (`./install.sh /chemin/projet`).

---

## 1. macOS

```bash
# Install (or update) ALL skills globally → ~/.claude/skills
./install.sh

# Selected skills only
./install.sh --only flo-nextjs flo-ui design-taste

# Into a specific project
./install.sh /Users/you/dev/my-app
```

If you get `permission denied`: `chmod +x install.sh` then retry.

## 2. Linux

Identical to macOS:

```bash
./install.sh                      # all, global
./install.sh --only flo-supabase  # selected
./install.sh ~/dev/my-app         # per-project
```

## 3. Windows

### Option A — PowerShell (native)

```powershell
# From the repo folder
./install.ps1                          # all, global → %USERPROFILE%\.claude\skills
./install.ps1 -Only flo-nextjs,flo-ui  # selected
./install.ps1 -Project C:\dev\my-app   # per-project
```

If scripts are blocked: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` then retry.

### Option B — WSL / Git Bash

Use the macOS/Linux instructions (`./install.sh …`).

---

## 4. Update the skills

Re-running the installer **overwrites in place** = update. Each skill folder is removed then recopied
(no orphan files), and the installed version is printed.

```bash
git pull                 # get the latest skills
./install.sh             # macOS/Linux — update all
# or a subset:
./install.sh --only flo-ui design-taste
```

```powershell
git pull
./install.ps1            # Windows — update all
```

> Tip: read **[CHANGELOG.md](./CHANGELOG.md)** before updating to see what changed. Versioning policy:
> **[docs/VERSIONING.md](./docs/VERSIONING.md)**.

---

## 5. Verify the installation

```bash
# List installed flo-code skills + their versions in the target
./install.sh --list            # macOS/Linux
./install.ps1 -List            # Windows

# Or check the folder directly
ls ~/.claude/skills            # macOS/Linux
dir %USERPROFILE%\.claude\skills   # Windows (cmd)
```

Optional integrity check (needs Node): no two skills claim the same responsibility, versions valid.

```bash
npm run check:overlaps
# → "12 skills · 88 responsabilités canoniques uniques · ✅ Aucun chevauchement critique"
```

In Claude Code, run `/` and confirm the `flo-*` skills appear, or just ask for a task that should
trigger one (e.g. "audit this project" → `flo-project-audit`).

---

## 6. Uninstall

```bash
./install.sh --uninstall                 # remove ALL flo-code skills (macOS/Linux)
./install.sh --uninstall --only flo-seo  # remove one
```

```powershell
./install.ps1 -Uninstall                 # Windows
./install.ps1 -Uninstall -Only flo-seo
```

This only removes the `flo-*` / design-taste / frontend-design / playwright folders from the target;
your other Claude Code skills are untouched.

---

## 7. Recommended: a minimal `~/.claude/CLAUDE.md`

Add a tiny global memory file that tells Claude **how to use** these skills — without duplicating their
content (the rules already live in each `SKILL.md`). Copy the template:

```bash
# macOS/Linux
cp examples/CLAUDE.md ~/.claude/CLAUDE.md        # then edit to taste
```

```powershell
# Windows
Copy-Item examples\CLAUDE.md $HOME\.claude\CLAUDE.md
```

See **[examples/CLAUDE.md](./examples/CLAUDE.md)**.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `permission denied: ./install.sh` | `chmod +x install.sh` |
| PowerShell "cannot be loaded because running scripts is disabled" | `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` |
| Skills don't show in Claude Code | Restart Claude Code; confirm they are in `~/.claude/skills/<skill>/SKILL.md` |
| `npm run check:overlaps` fails to run | Install Node ≥ 18 (the checker is optional; skills work without it) |
