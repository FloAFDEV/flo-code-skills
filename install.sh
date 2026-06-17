#!/usr/bin/env bash
# Installe / met à jour / désinstalle les skills flo-code dans ~/.claude/skills (global)
# ou dans le .claude/skills d'un projet ciblé. Réexécuter = mise à jour (écrasement sur place).
#
# Usage :
#   ./install.sh                        # installe/MAJ TOUS les skills en global (~/.claude/skills)
#   ./install.sh /chemin/projet         # installe/MAJ TOUS les skills dans <projet>/.claude/skills
#   ./install.sh --only flo-nextjs flo-ui          # global, skills choisis
#   ./install.sh /chemin/projet --only flo-supabase # projet, skills choisis
#   ./install.sh --list                 # liste les skills installés dans la cible
#   ./install.sh --uninstall            # retire TOUS les skills flo-code de la cible
#   ./install.sh --uninstall --only flo-seo         # retire un skill précis
#
# Options combinables : un chemin de projet peut précéder n'importe quelle option.

set -euo pipefail

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/skills" && pwd)"
TARGET_BASE="$HOME/.claude"
SELECTED=()
ACTION="install"

ALL_SKILLS=(flo-project-audit flo-dev-standards flo-debug flo-medical flo-nextjs \
            flo-supabase flo-offline flo-seo frontend-design flo-ui design-taste playwright)

while [[ $# -gt 0 ]]; do
  case "$1" in
    --only)      shift; while [[ $# -gt 0 && "$1" != --* ]]; do SELECTED+=("$1"); shift; done ;;
    --uninstall) ACTION="uninstall"; shift ;;
    --list)      ACTION="list"; shift ;;
    -h|--help)   sed -n '2,18p' "$0"; exit 0 ;;
    --*)         echo "Option inconnue : $1" >&2; exit 2 ;;
    *)           TARGET_BASE="$1/.claude"; shift ;;
  esac
done

DEST="$TARGET_BASE/skills"
[[ ${#SELECTED[@]} -eq 0 ]] && SELECTED=("${ALL_SKILLS[@]}")

case "$ACTION" in
  list)
    echo "→ Skills installés dans : $DEST"
    if [[ -d "$DEST" ]]; then
      found=0
      for skill in "${ALL_SKILLS[@]}"; do
        if [[ -f "$DEST/$skill/SKILL.md" ]]; then
          ver=$(sed -n 's/^version:[[:space:]]*//p' "$DEST/$skill/SKILL.md" | head -1)
          echo "  ✓ $skill (v${ver:-?})"; found=1
        fi
      done
      [[ $found -eq 0 ]] && echo "  (aucun)"
    else
      echo "  (dossier inexistant)"
    fi
    exit 0
    ;;
  uninstall)
    echo "→ Désinstallation depuis : $DEST"
    for skill in "${SELECTED[@]}"; do
      if [[ -d "$DEST/$skill" ]]; then rm -rf "${DEST:?}/$skill"; echo "  ✓ retiré $skill"; fi
    done
    echo "Terminé. Redémarre Claude Code."
    exit 0
    ;;
esac

# install / update
mkdir -p "$DEST"
echo "→ Installation / mise à jour dans : $DEST"
for skill in "${SELECTED[@]}"; do
  if [[ -d "$SRC_DIR/$skill" ]]; then
    rm -rf "${DEST:?}/$skill"            # MAJ propre (pas de fichiers orphelins)
    cp -r "$SRC_DIR/$skill" "$DEST/"
    ver=$(sed -n 's/^version:[[:space:]]*//p' "$DEST/$skill/SKILL.md" | head -1)
    echo "  ✓ $skill (v${ver:-?})"
  else
    echo "  ✗ introuvable : $skill" >&2
  fi
done
echo "Terminé. Vérifie avec : ./install.sh --list  ·  puis redémarre Claude Code."
