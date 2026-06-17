---
name: frontend-design
version: 1.0.0
description: Conception produit et UX EN AMONT de l'implémentation. À activer pour décider l'expérience utilisateur, l'architecture d'information, les parcours, la hiérarchie de contenu, la structure et l'organisation des écrans, la priorisation de l'information et les wireframes conceptuels. Ne produit ni composants React, ni design system, ni tokens.
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
> S'arrête au wireframe conceptuel ; `flo-ui` prend le relais à l'implémentation.

## ▶️ When To Invoke
- **Avant de coder un écran** : définir l'expérience, la tâche, le parcours.
- Concevoir l'**architecture d'information** (navigation, regroupement, nommage).
- Décider la **hiérarchie de contenu**, la **structure d'écran**, l'**organisation des sections**.
- **Prioriser l'information** (primaire/secondaire/tertiaire) et produire un **wireframe conceptuel**.

## ⏹️ When NOT To Invoke
- Écrire des **composants React**, du Tailwind, des tokens, des animations → `flo-ui`.
- **Juger** la finition visuelle / le « look IA » → `design-taste`.
- Sémantique d'indexation / metadata → `flo-seo`.
- Faisabilité de rendu (Server/Client) → `flo-nextjs`.

## 🎯 Scope (responsabilités)
- **Expérience utilisateur** : tâches, friction, charge cognitive.
- **Architecture d'information** : navigation, taxonomie, nommage.
- **Parcours utilisateur** : flows, étapes, points de décision, états de parcours.
- **Hiérarchie de contenu** & **priorisation de l'information**.
- **Structure des écrans** & **organisation des sections** (zoning, layout intentionnel).
- **Wireframes conceptuels** (avant pixels).

## 🚫 Hors-scope (délégué)
- **Composants React, design system, tokens, responsive, animations, a11y** → `flo-ui`.
- **Critique visuelle / qualité perçue / détection IA** → `design-taste`.
- **Sémantique d'indexation, metadata** → `flo-seo`.
- **Faisabilité de rendu** → `flo-nextjs`. **Sensibilité données** → `flo-medical`.

## ✅ Règles strictes

### Avant tout écran
1. Partir de la **tâche utilisateur**, pas d'un catalogue de composants.
2. **Une intention primaire par écran** ; tout le reste est secondaire. C'est ce que `flo-ui` implémentera.
3. **Minimiser les étapes** ; supprimer tout écran/champ qui ne sert pas la tâche.

### Architecture d'information
4. Navigation **prévisible** : profondeur maîtrisée, libellés dans le vocabulaire de l'utilisateur.
5. Regrouper par **logique métier/usage**, pas par contrainte technique ; nommage cohérent entre écrans.
6. Prévoir explicitement les **états de parcours** : premier usage, chargement, erreur, succès, cas limites.

### Hiérarchie & cohérence
7. Définir l'**ordre de lecture** et le **poids relatif** des zones avant tout style ; `flo-ui` le réalise via son système.
8. **Réutiliser les patterns** d'un écran à l'autre : un même objet se présente toujours pareil.
9. **Densité adaptée au métier** : un outil pro assume une densité élevée ; ne pas sous-remplir « pour faire aéré ».

## ⛔ Anti-règles (jamais)
- ❌ Jamais écrire de composant, de classe de style, de token ou d'animation (→ `flo-ui`).
- ❌ Jamais juger la finition d'un rendu existant (→ `design-taste`).
- ❌ Jamais imposer une structure qui exposerait des données protégées (→ `flo-medical`/`flo-supabase`).
- ❌ Jamais empiler des écrans/étapes « parce que c'est joli ».
- ❌ Jamais copier une structure de template sans la confronter à la tâche réelle.

## 🥇 Priorité
Niveau **6**. Cède devant medical, supabase, dev-standards, nextjs, offline. Prime sur `flo-ui` pour la **structure/IA**. Ses décisions sont **soumises à l'audit** de `design-taste`.

## 🔗 Interactions
- **Précède** `flo-ui` (lui transmet structure, hiérarchie, patterns).
- **Cadre** `flo-seo` (l'IA produit influence headings/maillage).
- **Audité par** `design-taste` ; **validé par** `playwright` (parcours → scénarios E2E).
- **Obéit** à `flo-medical`/`flo-supabase` sur ce qui peut être affiché.
