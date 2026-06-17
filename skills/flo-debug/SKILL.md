---
name: flo-debug
version: 1.0.0
description: Diagnostic d'erreurs et de bugs. À activer pour analyser une stack trace, diagnostiquer un bug React, Next.js, Supabase ou Dexie, ou investiguer un problème de performance (le POURQUOI). Il trouve la cause racine puis délègue le correctif au skill propriétaire du domaine — il ne réécrit pas leurs règles.
owns:
  - error-diagnosis
  - stack-trace-analysis
  - react-debugging
  - nextjs-debugging
  - supabase-debugging
  - dexie-debugging
  - performance-diagnosis
excludes:
  - error-handling
  - nextjs-performance
  - unit-testing
  - rls
  - e2e-tests
---

# flo-debug

> Trouver *pourquoi* ça casse ou ça rame. Le diagnostic, pas la doctrine du correctif.

## ▶️ When To Invoke
- Une **erreur / exception / stack trace** à comprendre.
- Un **bug** React (re-render, hooks, state), **Next.js** (hydration, RSC, cache, routing), **Supabase** (RLS qui refuse, auth, Edge), **Dexie/IndexedDB** (sync, versions, transactions).
- Un **problème de performance** à investiguer : trouver le goulot, la cascade, le re-render coûteux, la requête lente.
- Un comportement **imprévisible/intermittent** à reproduire et isoler.

## ⏹️ When NOT To Invoke
- Définir le **pattern** d'erreur (Result, boundaries) → `flo-dev-standards` (ici = diagnostic runtime).
- *Construire* du Next performant → `flo-nextjs` (ici = trouver pourquoi c'est lent).
- Écrire des **tests** (unitaire → `flo-dev-standards`, E2E → `playwright`).
- Écrire la **policy RLS** correcte → `flo-supabase` (debug identifie *qu'elle* bloque, supabase la corrige).

## 🎯 Scope (responsabilités)
- **Diagnostic d'erreurs** : reproduire, isoler, identifier la cause racine.
- **Analyse de stack traces** : remonter à l'origine, distinguer symptôme et cause.
- **Bugs React / Next.js / Supabase / Dexie** : patterns d'échec connus de chaque techno.
- **Diagnostic de performance** : profiling, cascades de fetch, re-renders, requêtes lentes, bundle.

## 🚫 Hors-scope (délégué — le correctif appartient au domaine)
- Une fois la cause trouvée, **le correctif est exécuté par le skill propriétaire** :
  rendu/cache → `flo-nextjs` · RLS/Edge → `flo-supabase` · sync/schéma local → `flo-offline` ·
  composant/a11y → `flo-ui` · pattern de code/erreur → `flo-dev-standards` · conformité → `flo-medical`.
- **Prévenir** la régression par un test → `playwright` / `flo-dev-standards`.

## ✅ Règles strictes

### Méthode
1. **Reproduire d'abord** : un bug non reproduit n'est pas diagnostiqué. Noter les conditions (env, données, étapes).
2. Distinguer **symptôme et cause racine** ; ne pas s'arrêter au premier message d'erreur.
3. Lire la stack **de bas en haut** jusqu'au premier cadre du code applicatif ; identifier la frontière (lib vs app).
4. **Hypothèse → test → conclusion** : changer une variable à la fois, instrumenter (logs ciblés, breakpoints), pas de correctif au hasard.

### Par domaine (heuristiques)
5. **React** : boucles de re-render (deps d'effets, identités d'objets), state stale, clés de liste, ordre des hooks.
6. **Next.js** : erreurs d'hydration (markup serveur ≠ client), frontière Server/Client mal placée, cache inattendu (`revalidate`/`no-store`), `searchParams`/dynamic.
7. **Supabase** : un refus silencieux = souvent **RLS** (tester avec/sans session), JWT/claims, CORS Edge, types générés périmés.
8. **Dexie/IndexedDB** : version non incrémentée, transaction fermée (await hors transaction), conflits de sync, quota.
9. **Performance** : mesurer avant d'optimiser ; chercher cascades de `await`, N+1, re-renders, images non optimisées, bundle — puis **router le correctif** vers le skill propriétaire.

### Restitution
10. Livrer : **cause racine + preuve (repro/trace) + correctif recommandé attribué au skill propriétaire + test de non-régression**.
11. En contexte santé : **aucune donnée patient/PII** dans les logs de debug, traces partagées ou tickets (→ `flo-medical`).

## ⛔ Anti-règles (jamais)
- ❌ Jamais proposer un correctif sans avoir reproduit/isolé la cause.
- ❌ Jamais réécrire les règles d'un domaine : debug **diagnostique**, le propriétaire **corrige**.
- ❌ Jamais « optimiser » sans mesure préalable (pas d'optimisation spéculative).
- ❌ Jamais laisser de PII/secret dans une trace ou un log de diagnostic.
- ❌ Jamais masquer un symptôme (try/catch qui avale) au lieu de traiter la cause.

## 🥇 Priorité
**Diagnostic transverse (non-autoritaire).** Il s'active sur tout le stack mais **défère le correctif** au skill propriétaire du domaine (qui garde son autorité). Il ne crée pas de règle métier.

## 🔗 Interactions
- **Sert** tous les skills techniques : il identifie la cause, ils appliquent le correctif.
- **Alimente** `flo-project-audit` (diagnostics) et travaille avec `playwright` (repro + non-régression).
- **Obéit** à `flo-medical` (pas de PII dans les traces) ; **applique** `flo-dev-standards`.

## 📝 Changelog
Voir `skills/flo-debug/CHANGELOG.md`.
