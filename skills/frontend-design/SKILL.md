---
name: frontend-design
version: 2.0.0
description: Conception produit et UX en amont de l'implémentation. À activer pour décider l'expérience utilisateur, l'architecture d'information, les parcours, la hiérarchie de contenu, la structure des écrans et les wireframes conceptuels. Ne produit ni composants, ni design system, ni tokens.
owns:
  - ux
  - information-architecture
  - user-flows
  - content-hierarchy
  - screen-structure
  - section-organization
  - information-prioritization
  - conceptual-wireframes
excludes:
  - ui-components
  - design-system
  - design-tokens
  - visual-critique
  - metadata-content
---

# frontend-design

> Phase PLAN. Ce qui va à l'écran, où, et pourquoi — avant les pixels.

## Objectif

Définir ce qui va à l'écran, dans quel ordre et pourquoi, avant toute implémentation. S'active avant de coder un écran pour définir l'expérience utilisateur, l'architecture d'information, les parcours et la hiérarchie de contenu. Produit un wireframe conceptuel transmis à `flo-ui` pour implémentation.

## Périmètre

**Possède :** expérience utilisateur (tâches, friction, charge cognitive), architecture d'information (navigation, taxonomie, nommage), parcours utilisateur (flows, étapes, points de décision, états), hiérarchie et priorisation du contenu, structure et organisation des écrans, wireframes conceptuels.

**Délègue :** composants, Tailwind, tokens, animations → `flo-ui` · jugement de qualité visuelle et détection d'artefacts IA → `design-taste` · sémantique d'indexation et metadata → `flo-seo` · faisabilité de rendu Server/Client → `flo-nextjs` · sensibilité des données à afficher → `flo-medical`.

## Contraintes

**Une intention primaire par écran.** Tout le reste est secondaire ou tertiaire. Cette décision est le premier livrable de ce skill — elle conditionne tout ce que `flo-ui` va implémenter.

**Partir de la tâche utilisateur**, pas d'un template, d'un catalogue de composants, ni d'une idée de layout.

**États de parcours explicites** pour chaque flow : premier usage, chargement, erreur, succès, cas limites. Un écran conçu uniquement pour le happy path n'est pas terminé.

**Densité intentionnelle :** un outil professionnel assume une densité élevée. Ne pas sous-remplir « pour faire aéré » ; ne pas surcharger pour paraître exhaustif. La densité est une décision métier, pas esthétique.

Ne jamais concevoir une structure qui exposerait des données protégées par `flo-medical` ou `flo-supabase` — ces skills priment sur toute décision d'affichage.

## Autorité

Niveau 6. Cède devant `flo-medical`, `flo-supabase`, `flo-dev-standards`, `flo-nextjs`, `flo-offline`. Prime sur `flo-ui` pour la structure et l'architecture d'information. Ses décisions sont soumises à l'audit de `design-taste`.

## Définition de terminé

Chaque écran a une intention primaire explicite. Les états de parcours (succès, vide, erreur, cas limites) sont tous définis. La hiérarchie de contenu est documentée et transmise à `flo-ui`. Aucune structure n'expose de données protégées.

## Références

Précède `flo-ui` (lui transmet structure, hiérarchie d'intention et patterns réutilisables). Cadre `flo-seo` (l'architecture influence headings et maillage interne). Audité par `design-taste`. Validé par `playwright` (parcours → scénarios E2E). Obéit à `flo-medical`/`flo-supabase`.
