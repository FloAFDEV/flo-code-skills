---
name: flo-creative-frontend
version: 1.0.0
description: Couche frontend créative OPT-IN (vitrines, démonstrateurs, projets perso/expérimentaux). À activer UNIQUEMENT si le projet la déclare (fichier `.flo/creative-frontend.md` ou mention dans son CLAUDE.md) ou si l'utilisateur dit explicitement qu'un projet « utilise le système frontend créatif ». Orchestre flo-art-direction + flo-motion + la bibliothèque de patterns par-dessus le socle (flo-ui, flo-dev-standards, et le skill du framework seulement s'il est réellement utilisé). Agnostique de la stack : ne migre jamais un projet vers un autre framework. Ne jamais activer par défaut sur un projet client.
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
réutilisables (bibliothèque ci-dessous) + socle existant (`flo-ui`, `flo-dev-standards`, et les
conventions du framework **réellement utilisé** par le projet).

## Activation (gate — vérifier AVANT tout le reste)

1. Le projet contient `.flo/creative-frontend.md` **ou** son `CLAUDE.md` le déclare (idéalement
   `@.flo/creative-frontend.md`, import chargé à chaque session) → couche **active**.
2. L'utilisateur le dit explicitement pour ce projet → couche active ; proposer de créer le fichier
   à partir de [`templates/creative-frontend.md`](./templates/creative-frontend.md) pour ne plus avoir à le redire.
3. Sinon → **inactive** : ne pas charger `flo-art-direction` ni `flo-motion`, ne pas proposer de
   patterns de la bibliothèque. Le socle (`flo-ui`, `design-taste`…) s'applique seul, comme avant.

Activer = lire `.flo/creative-frontend.md` en entier (direction, signature motion, mode, zones
autorisées) avant de concevoir ou coder.

## Stack du projet = contrainte (non négociable)

Avant toute proposition, **détecter** la stack réelle (`package.json`, `astro.config.*`, `vite.config.*`,
`next.config.*`, structure `src/pages`, `app/`…) et l'annoncer avec l'activation.

| Stack détectée | S'applique | Ne s'applique pas |
|---|---|---|
| Next.js | `flo-nextjs` (App Router, Server/Client Components) | — |
| Astro | conventions Astro : composants `.astro` statiques par défaut, îlots (`client:visible` / `client:idle`) uniquement pour l'interactif, contenu dans le HTML | `flo-nextjs` |
| Vite + React (SPA) | architecture existante (routeur, organisation des dossiers, état) | `flo-nextjs` |
| Autre | conventions du projet, relevées dans le code | tout skill de framework absent |

Règles :
1. Ne **jamais** migrer, proposer de migrer, ni réorganiser un projet vers un autre framework
   (y compris Next.js), même partiellement, même « pour plus tard ». Seule une demande explicite l'autorise.
2. N'ajouter aucune dépendance de framework ; une librairie de la couche (ex. `motion`) seulement si
   la stack la supporte et si le projet ne fournit pas déjà l'équivalent.
3. Les skills de la couche (`flo-art-direction`, `flo-motion`, bibliothèque) sont **universels** :
   design, UX, motion, composants, a11y, responsive, perf, qualité. Leur traduction en code suit la stack détectée.
4. Un pattern de la bibliothèque écrit pour une stack s'adapte à celle du projet ; on ne change pas
   la stack pour accueillir le pattern.

## Priorité des règles (couche active)

1. Instructions explicites du projet (CLAUDE.md, `.flo/creative-frontend.md`, demande en cours).
2. Référence visuelle explicite (prototype Lovable, Figma, site, captures) selon le **mode**.
3. Contraintes techniques du projet (stack réelle, dépendances, budget perf, zones interdites).
4. Skills propres au projet (`<projet>/.claude/skills/*`).
5. Skills globaux Flo (`flo-art-direction`, `flo-motion`, `flo-ui`… ; un skill de framework seulement si ce framework est utilisé).
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
implémentation, tokens, a11y → `flo-ui` · framework → ses conventions, `flo-nextjs` seulement si le projet est Next.js ·
critique → `design-taste` · captures/E2E → `playwright`. Ce skill route et arbitre, il ne remplace aucun d'eux.

## Autorité

Couche opt-in, hors échelle numérique (comme un orchestrateur) : il fixe l'activation, la priorité
des sources et la politique de réutilisation ; il ne tranche aucun jugement de domaine.

## Définition de terminé

Activation vérifiée et annoncée (active/inactive + source). Stack détectée et annoncée, inchangée. Mode annoncé. Pour chaque composant
nouveau : preuve qu'aucun existant ne convenait. Zones hors périmètre du fichier projet intactes.
Patterns promus (le cas échéant) ajoutés à `library/INDEX.md`.
