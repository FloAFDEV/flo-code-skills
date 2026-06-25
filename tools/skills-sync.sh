#!/usr/bin/env bash
# skills-sync.sh — moteur de synchronisation GLOBALE des skills flo-code.
#
# Rôle : maintenir un clone local unique du repo et exposer chaque skill dans
# ~/.claude/skills via des liens symboliques. Un `git pull` dans le clone met
# donc à jour TOUS les projets d'un coup — aucune copie manuelle.
#
# Ce script est appelé :
#   1. par bootstrap.sh (installation initiale)
#   2. par le hook SessionStart (auto-update throttlé, à chaque session Claude Code)
#
# Il est volontairement NON-BLOQUANT : toute erreur réseau/git est avalée et
# le script continue avec ce qui est déjà sur le disque (jamais de session cassée).
#
# Variables d'environnement (overridables) :
#   FLO_SKILLS_REPO     répertoire du clone        (défaut : ~/.claude/flo-code-skills)
#   FLO_SKILLS_TARGET   dossier skills de Claude   (défaut : ~/.claude/skills)
#   FLO_SKILLS_URL      URL git du repo            (défaut : dépôt public FloAFDEV)
#   FLO_SKILLS_TTL      throttle pull en secondes  (défaut : 86400 = 1 jour)
#
# Usage :
#   skills-sync.sh             # pull throttlé + (re)lien des symlinks
#   skills-sync.sh --quiet     # idem, silencieux (utilisé par le hook)
#   skills-sync.sh --force     # ignore le throttle, pull immédiat
#   skills-sync.sh --link-only # ne pull pas, recrée seulement les symlinks
#   skills-sync.sh --list      # liste les skills liés + leur version
#   skills-sync.sh --unlink    # retire les symlinks flo-code de la cible

set -uo pipefail   # pas de -e : on ne veut jamais qu'une erreur tue la session

REPO="${FLO_SKILLS_REPO:-$HOME/.claude/flo-code-skills}"
TARGET="${FLO_SKILLS_TARGET:-$HOME/.claude/skills}"
URL="${FLO_SKILLS_URL:-https://github.com/FloAFDEV/flo-code-skills.git}"
TTL="${FLO_SKILLS_TTL:-86400}"
STAMP="$REPO/.last-sync"

QUIET=0; FORCE=0; LINK_ONLY=0; ACTION="sync"
for arg in "$@"; do
  case "$arg" in
    --quiet)     QUIET=1 ;;
    --force)     FORCE=1 ;;
    --link-only) LINK_ONLY=1 ;;
    --list)      ACTION="list" ;;
    --unlink)    ACTION="unlink" ;;
    -h|--help)   sed -n '2,30p' "$0"; exit 0 ;;
  esac
done

log() { [[ $QUIET -eq 1 ]] || echo "$@"; }
warn() { echo "skills-sync: $*" >&2; }

# Les dossiers gérés par ce système (ne touche jamais aux autres skills de l'utilisateur).
managed_skills() {
  local d
  for d in "$REPO"/skills/*/; do
    [[ -f "${d}SKILL.md" ]] && basename "$d"
  done
}

skill_version() {
  sed -n 's/^version:[[:space:]]*//p' "$1/SKILL.md" 2>/dev/null | head -1
}

do_link() {
  mkdir -p "$TARGET"
  local skill src dst linked=0
  while IFS= read -r skill; do
    [[ -z "$skill" ]] && continue
    src="$REPO/skills/$skill"
    dst="$TARGET/$skill"
    # Remplace proprement toute installation antérieure (copie OU ancien symlink).
    rm -rf "$dst"
    ln -sfn "$src" "$dst"
    linked=$((linked+1))
    log "  ✓ $skill (v$(skill_version "$src")) → symlink"
  done < <(managed_skills)
  log "→ $linked skill(s) liés dans : $TARGET"
}

do_pull() {
  [[ -d "$REPO/.git" ]] || { warn "clone absent ($REPO) — lance bootstrap.sh"; return 1; }
  # Throttle : ne pull qu'une fois par TTL, sauf --force.
  if [[ $FORCE -eq 0 && -f "$STAMP" ]]; then
    local last now; last=$(cat "$STAMP" 2>/dev/null || echo 0); now=$(date +%s)
    if (( now - last < TTL )); then
      log "→ pull ignoré (dernier sync il y a $(( (now-last)/3600 ))h, TTL ${TTL}s)"
      return 0
    fi
  fi
  log "→ mise à jour du clone : $REPO"
  # timeout pour ne jamais bloquer une session ; tolérant aux erreurs réseau.
  if timeout 30 git -C "$REPO" pull --ff-only --quiet 2>/dev/null; then
    date +%s > "$STAMP"
    log "  ✓ clone à jour"
  else
    warn "git pull a échoué (réseau ?) — on continue avec la version locale"
  fi
}

case "$ACTION" in
  list)
    echo "→ Skills flo-code liés dans : $TARGET"
    found=0
    while IFS= read -r skill; do
      dst="$TARGET/$skill"
      if [[ -L "$dst" ]]; then
        echo "  ✓ $skill (v$(skill_version "$REPO/skills/$skill")) → $(readlink "$dst")"; found=1
      elif [[ -d "$dst" ]]; then
        echo "  ○ $skill (copie, non lié)"; found=1
      fi
    done < <(managed_skills)
    [[ $found -eq 0 ]] && echo "  (aucun)"
    ;;
  unlink)
    echo "→ Retrait des symlinks flo-code de : $TARGET"
    while IFS= read -r skill; do
      dst="$TARGET/$skill"
      if [[ -L "$dst" ]]; then rm -f "$dst"; echo "  ✓ délié $skill"; fi
    done < <(managed_skills)
    ;;
  sync)
    [[ $LINK_ONLY -eq 1 ]] || do_pull
    do_link
    ;;
esac
