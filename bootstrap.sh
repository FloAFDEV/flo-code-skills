#!/usr/bin/env bash
# bootstrap.sh — installation GLOBALE one-shot du système de skills flo-code.
#
# À lancer UNE SEULE FOIS sur ta machine. Idempotent : relançable sans risque.
#
#   curl -fsSL https://raw.githubusercontent.com/FloAFDEV/flo-code-skills/main/bootstrap.sh | bash
#   # ou, depuis un clone : ./bootstrap.sh
#
# Ce qu'il fait :
#   1. Clone (ou met à jour) le repo dans ~/.claude/flo-code-skills   (source de vérité locale)
#   2. Lie chaque skill dans ~/.claude/skills via symlink              (visible par tous les projets)
#   3. Installe un hook SessionStart dans ~/.claude/settings.json      (auto-update à chaque session)
#
# Résultat : tous tes projets voient tes skills, sans config par repo, et ils
# restent à jour tout seuls. Pour mettre à jour manuellement : `git -C ~/.claude/flo-code-skills pull`.
#
# Override possible : FLO_SKILLS_REPO=~/dev/flo-code-skills ./bootstrap.sh

set -euo pipefail

REPO="${FLO_SKILLS_REPO:-$HOME/.claude/flo-code-skills}"
URL="${FLO_SKILLS_URL:-https://github.com/FloAFDEV/flo-code-skills.git}"
SETTINGS="$HOME/.claude/settings.json"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd 2>/dev/null || echo "")"

echo "═══ bootstrap flo-code-skills ═══"
echo "Clone cible : $REPO"

# 1. Clone ou mise à jour ----------------------------------------------------
mkdir -p "$(dirname "$REPO")"
if [[ -d "$REPO/.git" ]]; then
  echo "→ clone déjà présent, mise à jour…"
  git -C "$REPO" pull --ff-only --quiet || echo "  (pull ignoré : réseau ?)"
elif [[ -n "$SCRIPT_DIR" && -d "$SCRIPT_DIR/.git" && "$SCRIPT_DIR" != "$REPO" ]]; then
  # Lancé depuis un clone existant ailleurs : on le copie/clone vers l'emplacement canonique.
  echo "→ clonage depuis l'origine vers $REPO…"
  git clone --quiet "$URL" "$REPO" 2>/dev/null \
    || git clone --quiet "$SCRIPT_DIR" "$REPO"   # fallback hors-ligne : clone local
else
  echo "→ clonage depuis $URL…"
  git clone --quiet "$URL" "$REPO"
fi

# 2. Liens symboliques -------------------------------------------------------
echo "→ création des liens dans ~/.claude/skills…"
FLO_SKILLS_REPO="$REPO" bash "$REPO/tools/skills-sync.sh" --link-only

# 3. Hook SessionStart (merge non destructif via jq) -------------------------
HOOK_CMD="bash \"$REPO/tools/skills-sync.sh\" --quiet 2>/dev/null || true"
mkdir -p "$HOME/.claude"
echo "→ installation du hook SessionStart dans $SETTINGS…"

if ! command -v jq >/dev/null 2>&1; then
  echo "  ⚠ jq introuvable : ajoute ce hook manuellement dans $SETTINGS :"
  echo "      SessionStart → command → $HOOK_CMD"
else
  [[ -f "$SETTINGS" ]] || echo '{}' > "$SETTINGS"
  # Backup horodaté avant toute modification.
  cp "$SETTINGS" "$SETTINGS.bak.$(date +%Y%m%d%H%M%S)"
  tmp="$(mktemp)"
  jq --arg cmd "$HOOK_CMD" '
    .hooks = (.hooks // {})
    | .hooks.SessionStart = (.hooks.SessionStart // [])
    # idempotent : ne ré-ajoute pas si un hook skills-sync existe déjà
    | if any(.hooks.SessionStart[]?; (.hooks // [])[]?.command? // "" | test("skills-sync"))
      then .
      else .hooks.SessionStart += [ { "hooks": [ { "type": "command", "command": $cmd } ] } ]
      end
  ' "$SETTINGS" > "$tmp" && mv "$tmp" "$SETTINGS"
  echo "  ✓ hook en place (backup : $SETTINGS.bak.*)"
fi

echo
echo "═══ Terminé ✓ ═══"
echo "Vérifie :  bash \"$REPO/tools/skills-sync.sh\" --list"
echo "Puis redémarre Claude Code et tape « / » : les skills flo-* doivent apparaître."
