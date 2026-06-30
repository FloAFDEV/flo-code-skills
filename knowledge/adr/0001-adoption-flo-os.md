---
title: "0001 — Adoption du Flo OS (5 tiers) et placement à la racine"
type: adr
status: accepté
date: 2026-06-30
related-skills: []
---

# 0001 — Adoption du Flo OS (5 tiers) et placement à la racine

## Contexte
Le dépôt `flo-code-skills` n'était qu'une collection de skills (Tier 2). L'objectif est d'en faire un
système de développement complet (« Flo OS ») couvrant la constitution, les exigences normatives, le
comportement agent, le savoir réutilisable et les artefacts exécutables. La structure proposée
préfixait tout par `skills/` (`skills/manifesto/`, `skills/skills/INDEX.md`…).

Contrainte dure : `skills/` est lu par `tools/skills-sync.sh` et `install.sh` (découverte via
`skills/*/SKILL.md`, symlinks vers `~/.claude/skills/`). Nicher l'OS sous `skills/` créait un
`skills/skills/` et mélangeait les tiers à l'intérieur du dossier d'un seul tier.

## Décision
Adopter un **Flo OS à 5 tiers** : **Manifesto (0) → Standards (1) → Skills (2) → Knowledge (3) →
Artifacts (4)**, matérialisés comme **dossiers de premier niveau à la racine du dépôt**. Le dossier
`skills/` existant est conservé tel quel et reçoit seulement un `INDEX.md`.

## Statut
accepté.

## Conséquences
- La distribution des skills (`skills-sync.sh` / `install.sh` / `bootstrap.sh`) reste **intacte** :
  `check-overlaps.ts` n'itère que sur les sous-dossiers contenant un `SKILL.md` et ignore `skills/INDEX.md`.
- Aucun skill n'est déplacé ni dupliqué : les tiers **référencent** les sources existantes.
- Le dépôt se lit comme un OS (tiers explicites) plutôt que comme une collection de fichiers.

## Alternatives écartées
- **Nicher l'OS sous `skills/`** (conforme au schéma initial) : rejeté car crée `skills/skills/`,
  brouille la sémantique des tiers et risque de perturber la découverte des skills. Réversible si besoin.
