---
name: flo-creative-frontend
version: 1.0.0
description: Couche frontend créative OPT-IN (vitrines, démonstrateurs, projets perso/expérimentaux). À activer UNIQUEMENT si le projet la déclare (fichier `.flo/creative-frontend.md` ou mention dans son CLAUDE.md) ou si l'utilisateur dit explicitement qu'un projet « utilise le système frontend créatif ». Orchestre flo-art-direction + flo-motion + la bibliothèque de patterns par-dessus flo-ui/flo-nextjs/flo-dev-standards. Ne jamais activer par défaut sur un projet client.
owns:
  - creative-layer-activation
  - creative-rule-precedence
  - pattern-reuse-policy
  - pattern-library
excludes:
  - art-direction
  - motion-choreography
  - ui-components
  - screen-structure
  - visual-critique
---

# flo-creative-frontend

> Couche optionnelle. Un projet l'active explicitement ; sinon ce skill ne fait rien.

## Objectif

Permettre de dire une seule fois « ce projet utilise mon système frontend créatif » et obtenir, à
chaque session : direction artistique (`flo-art-direction`) + Motion (`flo-motion`) + patterns
réutilisables (bibliothèque ci-dessous) + socle existant (`flo-ui`, `flo-nextjs` si Next.js,
`flo-dev-standards`).

## Activation (gate — vérifier AVANT tout le reste)

1. Le projet contient `.flo/creative-frontend.md` **ou** son `CLAUDE.md` le déclare (idéalement
   `@.flo/creative-frontend.md`, import chargé à chaque session) → couche **active**.
2. L'utilisateur le dit explicitement pour ce projet → couche active ; proposer de créer le fichier
   à partir de [`templates/creative-frontend.md`](./templates/creative-frontend.md) pour ne plus avoir à le redire.
3. Sinon → **inactive** : ne pas charger `flo-art-direction` ni `flo-motion`, ne pas proposer de
   patterns de la bibliothèque. Le socle (`flo-ui`, `design-taste`…) s'applique seul, comme avant.

Activer = lire `.flo/creative-frontend.md` en entier (direction, signature motion, mode, zones
autorisées) avant de concevoir ou coder.

## Priorité des règles (couche active)

1. Instructions explicites du projet (CLAUDE.md, `.flo/creative-frontend.md`, demande en cours).
2. Référence visuelle explicite (prototype Lovable, Figma, site, captures) selon le **mode**.
3. Contraintes techniques du projet (stack réelle, dépendances, budget perf, zones interdites).
4. Skills propres au projet (`<projet>/.claude/skills/*`).
5. Skills globaux Flo (`flo-art-direction`, `flo-motion`, `flo-ui`, `flo-nextjs`…).
6. Patterns génériques de la bibliothèque.

Absolus quel que soit le rang : a11y (`flo-ui`), sécurité/données (`flo-supabase`, `flo-medical`),
correction du code (`flo-dev-standards`). Une référence qui les viole est corrigée et l'écart signalé.
Cette liste ordonne des **sources** ; l'échelle d'autorité des skills (`docs/skill-boundaries.md`) reste inchangée.

## Mode (Lovable → Claude Code → production)

Établir et annoncer le mode avant de coder — définitions : `docs/skill-boundaries.md` (source de vérité).
- **REPRODUCTION** (demandée explicitement) : fidélité maximale ; la couche créative n'ajoute rien
  d'office — ses améliorations sont listées comme options.
- **ADAPTATION** (« transforme / améliore ») : intention visuelle conservée ; architecture, responsive,
  interactions, a11y et perf améliorées ; chaque écart listé.
- **CRÉATION** (aucune référence) : `flo-art-direction` définit la direction, `flo-motion` la mise en mouvement.

## Réutiliser avant de créer (non négociable)

Pour tout composant/section :
1. **Projet** : chercher un composant existant compatible (`grep` nom, rôle, props) → le réutiliser.
2. **Adapter** : variante/prop sur l'existant plutôt qu'une copie. Jamais `CardV2`, `HeroNew`.
3. **Bibliothèque** : consulter [`library/INDEX.md`](./library/INDEX.md) ; un pattern s'adapte aux
   tokens et composants du projet, il n'importe pas son propre style.
4. **Créer** seulement si rien ne convient — et le placer là où le projet range ses composants.

Un pattern n'est jamais imposé parce qu'il existe : il doit servir l'intention de la section.

## Bibliothèque de patterns

- Emplacement : `library/` dans ce skill (lisible depuis tout projet via `~/.claude/skills/flo-creative-frontend/library/`).
- Chaque entrée : `README.md` (intention, quand l'utiliser / ne pas l'utiliser, anatomie, mobile,
  a11y, motion) + implémentation de référence optionnelle, agnostique du projet (props, pas de contenu en dur).
- **Promotion** : un composant créé dans un projet n'entre dans la bibliothèque que s'il est
  générique (aucune marque, aucun contenu métier) et qu'il a servi au moins une fois en vrai ;
  l'ajouter avec son projet d'origine dans `library/INDEX.md`. Ne jamais pré-remplir la bibliothèque.

## Frontières

Direction artistique → `flo-art-direction` · mouvement → `flo-motion` · structure/IA → `frontend-design` ·
implémentation, tokens, a11y → `flo-ui` · App Router → `flo-nextjs` (seulement si le projet est Next.js) ·
critique → `design-taste` · captures/E2E → `playwright`. Ce skill route et arbitre, il ne remplace aucun d'eux.

## Autorité

Couche opt-in, hors échelle numérique (comme un orchestrateur) : il fixe l'activation, la priorité
des sources et la politique de réutilisation ; il ne tranche aucun jugement de domaine.

## Définition de terminé

Activation vérifiée et annoncée (active/inactive + source). Mode annoncé. Pour chaque composant
nouveau : preuve qu'aucun existant ne convenait. Zones hors périmètre du fichier projet intactes.
Patterns promus (le cas échéant) ajoutés à `library/INDEX.md`.
