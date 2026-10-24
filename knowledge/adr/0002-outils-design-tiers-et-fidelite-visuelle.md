---
title: "0002 — Outils design tiers et boucle de fidélité visuelle"
type: adr
status: accepté
date: 2026-10-24
related-skills: [flo-ui, design-taste, playwright, frontend-design]
---

# 0002 — Outils design tiers et boucle de fidélité visuelle

## Contexte
Workflow cible : prototype Lovable → projet Next.js fidèle (typo, couleurs, espacements, hero, CTA
flottants, hover, transitions, animations, footer), puis validation dans un vrai navigateur. Cinq
briques externes ont été évaluées le 2026-10-24 (dépôts clonés et lus, pas seulement leurs résumés) :

| Brique | Source vérifiée | Forme réelle | Licence / état |
|---|---|---|---|
| Emil Kowalski | `github.com/emilkowalski/skills` @ `2d22863` | 15 skills Markdown (animation, review, perf, mobile, Swift…) | MIT, actif |
| Impeccable | `github.com/pbakaus/impeccable` @ `9368675` | 1 skill / 24 commandes + binaire téléchargé au 1er lancement + hooks `SessionStart`/`PostToolUse(Edit\|Write)`/`Stop` | Apache-2.0, actif |
| Taste | `github.com/Leonxlnx/taste-skill` @ `6010f91` | 1 skill `design-taste-frontend` (direction artistique à partir d'un brief) | MIT, v2 « experimental » |
| Playwright MCP | `github.com/microsoft/playwright-mcp` (`@playwright/mcp` 0.0.83) | serveur MCP stdio | Apache-2.0, officiel Microsoft |
| Figma MCP | `developers.figma.com/docs/figma-mcp-server` | serveur MCP distant OAuth (`https://mcp.figma.com/mcp`) ou plugin officiel | officiel Figma, compte requis |

Le dépôt possède déjà `frontend-design` (structure), `flo-ui` (implémentation, **owns** `animations`),
`design-taste` (critique, anti-artefacts IA) et `playwright` (E2E, captures). Aucune règle ne disait
qu'une référence visuelle fournie prime sur le goût générique : c'est le vrai trou du workflow.

## Décision
1. **Référence > goût.** Une référence fournie (prototype, maquette, front existant) est l'autorité
   visuelle. Encodé de façon additive dans `design-taste`, `flo-ui` et `playwright` (2.1.0).
2. **Boucle de fidélité outillée** : kit `tools/visual-fidelity/` (`@playwright/test`,
   `toHaveScreenshot`, 3 viewports, seuil en pixels absolus). Aucune dépendance nouvelle hors
   `@playwright/test`.
3. **Playwright MCP — recommandé**, portée **user**, version épinglée, `--isolated`. Rôle :
   exploration/diagnostic interactif. Les vérifications durables restent des tests.
4. **Emil Kowalski — sélection de 3 skills**, portée user, commit épinglé, en lien symbolique :
   `review-animations` (manuel uniquement), `improve-animations` (lecture seule),
   `animation-performance`. Ils **conseillent** ; `flo-ui` reste propriétaire de l'implémentation.
5. **Figma MCP — conditionnel** : uniquement pour un projet qui a un fichier Figma. Jamais requis
   pour un projet Lovable.
6. **Impeccable — différé.** **Taste — écarté.**

Commandes exactes et workflow : [`docs/visual-workflow.md`](../../docs/visual-workflow.md).

## Statut
accepté.

## Conséquences
- Pas de nouveau skill dans `skills/`, pas de nouveau token `owns` : `check-overlaps` inchangé.
- Les skills tiers vivent hors du dépôt (`~/.claude/vendor/…` + symlinks) : `skills-sync.sh` ne les
  touche pas, `--unlink` non plus.
- Une comparaison visuelle n'est déclarée réussie que si une référence exploitable a été capturée.
- Coût : Playwright MCP charge ~25 outils dans le contexte quand il est actif.

## Alternatives écartées
- **Impeccable (différé)** : ses hooks s'exécutent à chaque `Edit`/`Write` et à chaque fin de tour, via
  un binaire téléchargé hors gestionnaire de paquets ; ses anti-patterns (« jamais Inter », pas de
  cards imbriquées…) contredisent la reproduction fidèle d'un prototype qui les utilise ; il recouvre
  `frontend-design` + `design-taste` + `flo-ui`. À réévaluer pour un projet **from scratch**, en
  invocation ponctuelle, sans hooks.
- **Taste (écarté)** : génère une direction artistique à partir d'un brief — l'inverse d'une
  reproduction fidèle ; doublon fonctionnel de `design-taste` avec un nom quasi identique
  (`design-taste-frontend`), source de confusion d'invocation.
- **Emil `emil-design-eng` / `animate` / `find-animation-opportunities`** : auto-invoqués sur toute
  demande UI/animation, ils pousseraient à modifier le mouvement de la référence. Disponibles en
  invocation manuelle si besoin, non installés par défaut.
- **Playwright CLI (`microsoft/playwright-cli`)** : recommandé par Microsoft pour les agents (moins de
  tokens), non évalué ici ; candidat si le coût contexte du MCP devient gênant.
- **Outil de diff externe (pixelmatch, Percy, Chromatic…)** : `toHaveScreenshot` suffit (diff image +
  rapport HTML) sans service tiers ni compte.
