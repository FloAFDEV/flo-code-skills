---
name: flo-debug
version: 2.0.0
description: Diagnostic d'erreurs et de bugs. À activer pour analyser une stack trace, diagnostiquer un bug React, Next.js, Supabase ou Dexie, ou investiguer un problème de performance. Trouve la cause racine et délègue le correctif au skill propriétaire — ne réécrit pas leurs règles.
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

## Objectif

Identifier la cause racine d'une erreur, d'un comportement imprévisible ou d'un problème de performance sur le stack React / Next.js / Supabase / Dexie. S'active quand une stack trace doit être comprise, un bug reproduit et isolé, ou un goulot de performance localisé avant d'être routé vers le skill propriétaire.

## Périmètre

**Possède :** reproduction et isolation du problème, analyse de stack trace (remontée à la cause, distinction symptôme/cause), heuristiques de debug par domaine, profiling et localisation des goulots de performance.

**Délègue :** le correctif au skill propriétaire du domaine — rendu/cache → `flo-nextjs` · RLS/Edge → `flo-supabase` · sync/schéma local → `flo-offline` · composant/a11y → `flo-ui` · pattern de code/erreur → `flo-dev-standards` · conformité → `flo-medical`. Prévention par test → `playwright`/`flo-dev-standards`.

## Contraintes

**Reproduire d'abord.** Un bug non reproduit n'est pas diagnostiqué — noter les conditions (env, données, étapes) avant toute hypothèse ou correctif.

**La restitution inclut toujours :** cause racine + preuve (repro ou trace) + correctif recommandé attribué au skill propriétaire + test de non-régression suggéré.

**Zéro PII dans les artefacts de debug :** aucune donnée patient dans les logs, traces partagées ou tickets (exigence de `flo-medical`).

**Points de diagnostic non-évidents par domaine :**
- **Supabase :** un refus silencieux est presque toujours la RLS — tester avec/sans session active avant toute autre hypothèse. Un type généré périmé peut causer des refus qui ressemblent à une erreur d'auth.
- **Dexie/IndexedDB :** un `await` hors d'une transaction ferme la transaction. Vérifier la version du schéma (non incrémentée) et les conflits de sync avant de chercher ailleurs.
- **Next.js :** distinguer une erreur d'hydration (markup serveur ≠ client) d'une frontière Server/Client mal placée — ce sont deux bugs différents avec des corrections différentes dans `flo-nextjs`.
- **Performance :** mesurer avant d'optimiser. Les cascades de `await`, le N+1 et les re-renders sont les causes les plus fréquentes — router le correctif vers le skill propriétaire, ne pas l'appliquer soi-même.

## Autorité

Transverse, non-autoritaire. S'active sur tout le stack mais ne dicte jamais le correctif — cette autorité appartient au skill du domaine. Ne crée aucune règle métier.

## Définition de terminé

La cause racine est identifiée et prouvée (repro ou trace). Le correctif est attribué au skill propriétaire avec une recommandation concrète. Un test de non-régression est suggéré.

## Références

Sert tous les skills techniques : il identifie, ils corrigent. Alimente `flo-project-audit` (diagnostics). Travaille avec `playwright` pour la reproduction et la non-régression. Obéit à `flo-medical` (pas de PII dans les traces).
