---
name: flo-project-audit
version: 1.0.0
description: Orchestrateur et auditeur de projet. À activer pour analyser un projet complet, décider quels skills invoquer, évaluer le projet via la scorecard (10 dimensions) et produire une feuille de route priorisée. Il ne possède AUCUNE règle métier : il coordonne les autres skills et délègue chaque jugement à son propriétaire.
owns:
  - project-audit
  - skill-orchestration
  - roadmap-prioritization
  - scorecard-evaluation
excludes:
  - code-review
  - visual-critique
  - error-diagnosis
  - e2e-tests
  - ux
---

# flo-project-audit

> Le chef d'orchestre. Il ne joue d'aucun instrument : il décide qui joue, quand, et dans quel ordre.

## ▶️ When To Invoke
- **Analyser un projet complet** (onboarding, reprise, revue globale, due diligence).
- Décider **quels skills invoquer** pour une tâche transverse et dans quel ordre.
- Produire une **feuille de route priorisée** (quick wins → chantiers de fond).
- Lancer une **évaluation scorecard** (10 dimensions) et l'agréger.

## ⏹️ When NOT To Invoke
- Une tâche **mono-domaine** où le skill propriétaire suffit (ne pas s'interposer inutilement).
- Émettre un **jugement métier** (code, visuel, sécurité…) → c'est le skill propriétaire qui tranche, pas l'orchestrateur.
- Diagnostiquer un bug précis → `flo-debug`. Critiquer le visuel → `design-taste`.

## 🎯 Scope (responsabilités)
- **Audit de projet** : cartographier stack, surfaces, dettes, risques (en déléguant l'analyse fine).
- **Orchestration de skills** : sélectionner et séquencer les skills pertinents pour une tâche.
- **Priorisation de feuille de route** : impact × effort, ordre d'exécution, dépendances.
- **Évaluation scorecard** : collecter un score par dimension auprès du skill compétent et agréger (voir `docs/scorecard.md`).

## 🚫 Hors-scope (délégué — TOUT le métier)
- **Qualité/correction du code** → `flo-dev-standards`. **Diagnostic de bug** → `flo-debug`.
- **Rendu/perf Next** → `flo-nextjs`. **Données/sécurité** → `flo-supabase` / `flo-medical`.
- **Offline** → `flo-offline`. **SEO** → `flo-seo`. **UX** → `frontend-design`.
- **UI/a11y** → `flo-ui`. **Qualité perçue** → `design-taste`. **E2E** → `playwright`.

## ✅ Règles strictes

### Orchestration
1. **Ne jamais émettre de jugement de domaine soi-même** : router vers le skill propriétaire et rapporter sa conclusion.
2. Sélectionner **le minimum de skills** nécessaires à la tâche — pas d'invocation « au cas où » (anti-surcharge).
3. Respecter la **hiérarchie d'autorité** : si deux skills divergent, appliquer l'ordre (`docs/skill-boundaries.md`), ne pas arbitrer arbitrairement.
4. Séquencer selon le **pipeline** : `frontend-design → build → playwright → design-taste`, et `flo-debug` à la demande.

### Audit & roadmap
5. Un audit = **état des lieux par dimension** (scorecard) + **constats** (chacun attribué à un skill) + **feuille de route**.
6. Prioriser par **impact × effort** ; séparer *quick wins* (bas effort, fort impact) des *chantiers* ; expliciter les dépendances.
7. Chaque item de roadmap nomme **le skill responsable** de l'exécution et un critère de « fait ».
8. Signaler les **risques bloquants** (sécurité, conformité) en tête, quel que soit leur effort.

## ⛔ Anti-règles (jamais)
- ❌ Jamais définir ou dupliquer une règle métier (code, UI, SEO, sécurité…) — il **délègue**.
- ❌ Jamais trancher un conflit entre skills hors de la hiérarchie d'autorité établie.
- ❌ Jamais invoquer tous les skills par défaut : sélection minimale, ciblée.
- ❌ Jamais produire une feuille de route sans propriétaire ni critère de complétion par item.

## 🥇 Priorité
**Méta-skill (niveau 0 — coordinateur).** Il se place *au-dessus du flux* mais **n'a aucune autorité de domaine** : il orchestre et défère. En cas de conflit de contenu, ce sont les niveaux 1–10 qui tranchent, jamais l'orchestrateur.

## 🔗 Interactions
- **Invoque et séquence** les 11 autres skills selon la tâche.
- **Consomme** la scorecard (`docs/scorecard.md`) et les conclusions de chaque skill.
- **S'appuie sur** `flo-debug` pour les diagnostics et `design-taste`/`playwright` pour l'audit qualité.
- **Ne contraint personne** : il rapporte, priorise, coordonne.

## 📝 Changelog
Voir `skills/flo-project-audit/CHANGELOG.md`.
