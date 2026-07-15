# Agents — composition de skills

> Couche au-dessus des skills, pas un remplacement. Un agent ne porte **aucune règle métier** :
> il déclare quels skills il compose (par référence, jamais par copie) et dans quel ordre les
> invoquer. Les règles restent à un seul endroit : `skills/*/SKILL.md`.

## Pourquoi un agent, et quand ne pas en créer

Les skills s'auto-invoquent déjà sur le fil principal. Un agent n'ajoute donc pas de l'activation —
il ajoute exactement trois choses :

1. **Isolation de contexte** — le travail lourd (audit, build multi-fichiers) ne pollue pas le fil principal.
2. **Curation** — un jeu de skills borné et déclaré, plutôt que tout le catalogue en permanence.
3. **Délégation** — un agent méta (`flo-auditor`) peut router vers plusieurs agents spécialisés.

Si une tâche n'a besoin d'aucune des trois, elle n'a pas besoin d'agent — invoquer le skill
directement suffit.

## Mécanique (zéro duplication)

Chaque agent précharge ses skills via le champ `skills:` du frontmatter
(`.claude/agents/<name>.md`) : le contenu de chaque `SKILL.md` est injecté dans le contexte de
l'agent **au lancement**, depuis sa source unique — rien n'est copié dans le fichier agent. Un
agent peut aussi invoquer un skill non préchargé à la demande via le Skill tool pendant son
exécution (ex. `flo-medical`, activé conditionnellement plutôt que systématiquement).

Un agent ne redécrit jamais une règle : il n'énonce que ce que les skills ne savent pas — son rôle,
sa composition, ses conditions de délégation, sa définition de terminé.

## Les 6 agents

| Agent | Skills composés | Rôle | Délègue à |
|---|---|---|---|
| **flo-designer** | frontend-design + design-taste | Regard produit : structure en amont, audit visuel en aval. Ne code jamais. | flo-builder (implémentation) |
| **flo-builder** | flo-nextjs + flo-ui + flo-seo + *(flo-dev-standards ambiant)* | Construit l'interface et le rendu réel. | flo-designer (structure), flo-data (accès données) |
| **flo-data** | flo-supabase + flo-offline + *(flo-dev-standards ambiant, flo-medical à la demande)* | Accès données, persistance, sécurité. | flo-builder (où appeler les helpers) |
| **flo-qa** | playwright | Validation fonctionnelle, rapporte des faits. | flo-designer (jugement esthétique), flo-auditor (échecs non triviaux) |
| **flo-auditor** | flo-project-audit + flo-debug | Méta : audite un projet, diagnostique un bug, route vers le propriétaire. | tous les autres selon le domaine |
| **flo-growth** | flo-project-audit + design-taste + flo-seo | Acquisition commerciale : audits de prospects, SEO business. Ne code jamais. | flo-builder/flo-data/flo-designer (implémentation des correctifs) |

`flo-dev-standards` (socle, tout le code) et `flo-medical` (contrainte, données sensibles) restent
**transverses** : jamais possédés par un seul agent, préchargés ou invoqués selon le besoin réel du
code produit ou du projet.

## Composition avec les profils et les missions

```
PROFIL (portée projet)   → quels skills/agents sont pertinents pour ce type de projet
   └── AGENT (portée tâche) → un travailleur curé sur un sous-ensemble de skills
          └── MISSION (entrée) → contexte, objectif, contraintes propres, définition de terminé,
                                  conditions d'arrêt — spécifiques à CETTE invocation
```

Un projet ou un cas d'usage spécifique (ex. l'audit d'acquisition d'un site donné) est une
**mission** confiée à un agent existant — pas un agent dédié. On ne crée un nouvel agent que si un
rôle récurrent, distinct des six ci-dessus, apparaît sur plusieurs missions.

## Ajouter un agent

1. Vérifier qu'aucun agent existant ne couvre déjà le rôle (isolation, curation ou délégation
   réellement nécessaires — sinon c'est une mission, pas un agent).
2. `.claude/agents/<name>.md` : frontmatter `name`/`description`/`skills` (skills composés, par
   référence uniquement) ; corps = Objectif / Délègue / Définition de terminé / Conditions d'arrêt.
3. Ajouter la ligne à la table ci-dessus.
4. Ne jamais recopier une règle d'un `SKILL.md` dans un fichier agent — si le contenu semble
   dupliqué, c'est que l'agent essaie d'être un skill.

## Distribution (non implémentée)

`.claude/agents/` n'est pas encore intégré à `install.sh` / `skills-sync.sh` (qui distribuent
aujourd'hui uniquement `skills/`). C'est un chantier séparé, à ouvrir si des projets consomment ces
agents au-delà de ce dépôt.

## Voir aussi
- Skills : [`../skills/INDEX.md`](../skills/INDEX.md)
- Hiérarchie d'autorité : [`skill-boundaries.md`](./skill-boundaries.md)
- Architecture interne : [`../ARCHITECTURE.md`](../ARCHITECTURE.md)
