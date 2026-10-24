---
title: "0002 — Outils design tiers et boucle de fidélité visuelle"
type: adr
status: accepté
date: 2026-10-24
related-skills: [flo-ui, design-taste, playwright, frontend-design]
---

# 0002 — Outils design tiers et boucle de fidélité visuelle

## Contexte
Workflows à couvrir : reproduire une référence (prototype Lovable, maquette Figma, site existant,
captures/PDF), l'adapter, ou créer une direction sans référence — puis valider dans un vrai navigateur. Cinq
briques externes ont été évaluées le 2026-10-24 (dépôts clonés et lus, pas seulement leurs résumés) :

| Brique | Source vérifiée | Forme réelle | Licence / état |
|---|---|---|---|
| Emil Kowalski | `github.com/emilkowalski/skills` @ `2d22863` | 15 skills Markdown (animation, review, perf, mobile, Swift…) | MIT, actif |
| Impeccable | `github.com/pbakaus/impeccable` @ `9368675` | 1 skill / 24 commandes + binaire téléchargé au 1er lancement + hooks `SessionStart`/`PostToolUse(Edit\|Write)`/`Stop` | Apache-2.0, actif |
| Taste | `github.com/Leonxlnx/taste-skill` @ `6010f91` | 1 skill `design-taste-frontend` (direction artistique à partir d'un brief) | MIT, v2 « experimental » |
| Playwright MCP | `github.com/microsoft/playwright-mcp` (`@playwright/mcp` 0.0.83) | serveur MCP stdio | Apache-2.0, officiel Microsoft |
| Figma MCP | `developers.figma.com/docs/figma-mcp-server` | serveur MCP distant OAuth (`https://mcp.figma.com/mcp`) ou plugin officiel | officiel Figma, compte requis |

Le dépôt possède déjà `frontend-design` (structure), `flo-ui` (implémentation, **owns** `animations`),
`design-taste` (critique, anti-artefacts IA) et `playwright` (E2E, captures). Rien ne distinguait
reproduire, adapter et créer, ni ne disait quand une référence fournie prime sur le goût générique.

## Décision
1. **Modes et priorité.** Trois modes — REPRODUCTION, ADAPTATION, CRÉATION — et une priorité des
   décisions visuelles : contraintes du projet > référence explicite > conventions (`flo-ui`) >
   recommandations animation (Emil) > direction générique (`design-taste`). Une référence explicite
   prime sur le goût générique ; sans référence, les skills de design définissent la direction.
   Source de vérité : `docs/skill-boundaries.md` ; appliqué dans `frontend-design`, `flo-ui`,
   `design-taste`, `playwright` (2.1.0, additif).
2. **Mesure outillée en REPRODUCTION/ADAPTATION** : kit `tools/visual-fidelity/` (`@playwright/test`,
   `toHaveScreenshot`, 3 viewports, seuil en pixels absolus) pour une référence exécutable ; mode et
   source enregistrés avec la baseline ; refus en CRÉATION et sans baseline. Aucune dépendance
   nouvelle hors `@playwright/test`.
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
- Une comparaison visuelle n'est déclarée réussie que si une référence exploitable a été capturée ;
  tout rapport visuel annonce son mode et ses sources.
- En REPRODUCTION, une recommandation d'Emil ou de `design-taste` qui s'écarte de la référence reste
  une option proposée à part ; en CRÉATION, elles contribuent directement à la direction.
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
