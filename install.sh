#!/usr/bin/env bash
# Installe les skills flo-code dans ~/.claude/skills (global) ou un projet ciblé.
# Usage :
#   ./install.sh                 # installe TOUS les skills en global (~/.claude/skills)
#   ./install.sh /chemin/projet  # installe TOUS les skills dans <projet>/.claude/skills
#   ./install.sh --only flo-nextjs flo-ui            # global, skills choisis
#   ./install.sh /chemin/projet --only flo-supabase  # projet, skills choisis

set -euo pipefail

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/skills" && pwd)"
TARGET_BASE="$HOME/.claude"
SELECTED=()

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --only)
      shift
      while [[ $# -gt 0 && "$1" != --* ]]; do SELECTED+=("$1"); shift; done
      ;;
    *)
      TARGET_BASE="$1/.claude"
      shift
      ;;
  esac
done

DEST="$TARGET_BASE/skills"
mkdir -p "$DEST"

if [[ ${#SELECTED[@]} -eq 0 ]]; then
  SELECTED=(flo-dev-standards flo-nextjs flo-supabase flo-offline flo-ui flo-seo flo-medical)
fi

echo "→ Installation dans : $DEST"
for skill in "${SELECTED[@]}"; do
  if [[ -d "$SRC_DIR/$skill" ]]; then
    cp -r "$SRC_DIR/$skill" "$DEST/"
    echo "  ✓ $skill"
  else
    echo "  ✗ introuvable : $skill" >&2
  fi
done
echo "Terminé. Redémarre Claude Code pour charger les skills."
