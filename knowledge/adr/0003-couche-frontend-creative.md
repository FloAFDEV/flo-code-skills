---
title: "0003 — Couche frontend créative opt-in"
type: adr
status: accepté
date: 2026-10-27
related-skills: [flo-creative-frontend, flo-art-direction, flo-motion, flo-ui, design-taste, frontend-design]
---

# 0003 — Couche frontend créative opt-in

## Contexte
Besoin : mutualiser un savoir-faire frontend avancé (direction artistique, Motion/scroll storytelling,
patterns réutilisables) entre projets perso/vitrines, **sans** l'imposer aux projets clients.
Existant : `flo-ui` possède `animations`, `micro-interactions`, `design-system`, `design-tokens`,
`interface-patterns` ; `design-taste` contribue à la direction en CRÉATION ; `frontend-design` possède
la structure. Distribution globale déjà en place (`skills-sync.sh` → symlinks `~/.claude/skills`).

## Décision
1. **Trois skills opt-in**, pas quatre :
   - `flo-creative-frontend` — interrupteur par projet, priorité des sources, réutiliser-avant-créer,
     **bibliothèque** (`library/` dans le skill, accessible de partout via le symlink).
   - `flo-art-direction` — méthode de direction artistique (et non `flo-design-system` : le design
     system/tokens appartient déjà à `flo-ui`).
   - `flo-motion` — choix de technique et chorégraphie (et non `flo-framer-motion` : le package
     s'appelle désormais `motion` ; les règles de base d'animation restent à `flo-ui`).
2. **Pas de skill `flo-component-library`** : la bibliothèque est un catalogue consulté, pas un
   comportement ; règle anti-prolifération de `skills/INDEX.md`.
3. **Activation** : `.flo/creative-frontend.md` dans le projet + `@.flo/creative-frontend.md` dans son
   `CLAUDE.md`. Les descriptions des 3 skills les rendent inertes sans cette déclaration.
4. **Autorité** : 7a (art-direction) et 7b (motion), sous `flo-ui` ; `design-taste` (2.2.0) audite
   contre la direction déclarée quand la couche est active.
5. La bibliothèque n'est **pas** pré-remplie : un pattern y entre après un usage réel (projet pilote).

## Statut
accepté.

## Conséquences
- 15 skills, `check-overlaps` vert, 17 nouveaux tokens `owns`.
- Projets clients : comportement inchangé (aucune déclaration → couche inactive).
- Les directions spécifiques (AFDEV, Auditref…) vivent dans le `.flo/creative-frontend.md` du projet,
  jamais dans les skills globaux.

## Alternatives écartées
- `disable-model-invocation: true` : empêcherait Claude de charger la couche même quand le projet la déclare.
- Mettre la bibliothèque dans `artifacts/` : non exposée par `skills-sync.sh`, chemin non garanti depuis un projet.
