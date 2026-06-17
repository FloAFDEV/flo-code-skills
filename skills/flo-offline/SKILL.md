---
name: flo-offline
version: 1.0.0
description: Architecture offline-first avec Dexie/IndexedDB. À activer pour le stockage local, la stratégie de synchronisation client/serveur, la file de mutations hors-ligne, la résolution de conflits, les stratégies de cache et l'UI optimiste persistée. Le serveur Supabase reste la source de vérité.
owns:
  - indexeddb
  - dexie
  - offline-sync
  - offline-first
  - conflict-resolution
  - cache-strategies
excludes:
  - data-access-security
  - accessibility
  - error-handling
  - caching-revalidation
---

# flo-offline

> L'app marche sans réseau, puis réconcilie. Le local est un cache, pas la vérité.

## ▶️ When To Invoke
- Concevoir un **schéma Dexie/IndexedDB** (tables, versions, index).
- Mettre en place une **synchro offline-first** (lecture locale, file de mutations, push/pull).
- Définir une **stratégie de cache** local ou de **résolution de conflits**.
- Persister un **état optimiste** entre sessions.

## ⏹️ When NOT To Invoke
- Source de vérité serveur, RLS, *quelles* données sont autorisées → `flo-supabase`.
- Cache **HTTP/serveur** (`revalidate`) → `flo-nextjs`.
- *Affichage* du statut de synchro → `flo-ui`.
- Typage des entités / erreurs → `flo-dev-standards`.

## 🎯 Scope (responsabilités)
- Schéma **Dexie/IndexedDB** : tables, versions, migrations locales, index.
- **Synchro** offline-first (lecture locale, écriture en file, push/pull).
- **File de mutations** hors-ligne et rejeu à la reconnexion.
- **Résolution de conflits** (LWW, versionning, merge).
- **Stratégies de cache** local et persistance de l'**état optimiste**.

## 🚫 Hors-scope (délégué)
- **Source de vérité serveur, RLS, secrets** → `flo-supabase`.
- **Affichage des états (offline/syncing/error)** → `flo-ui`.
- **Typage des entités, gestion d'erreurs** → `flo-dev-standards`.
- **Quelles données ont le droit d'être mises en cache (sécurité d'accès)** → `flo-supabase`.
- **Chiffrement local des données sensibles (exigence)** → `flo-medical`.

## ✅ Règles strictes

### Schéma local
1. Schéma Dexie **versionné** ; tout changement = nouvelle version + `upgrade`. Jamais muter une version publiée.
2. Index sur les clés de requête et de synchro (`updatedAt`, `syncStatus`, `serverId`).
3. Chaque entité porte des métadonnées : `localId`, `serverId?`, `updatedAt`, `syncStatus` (`pending`/`synced`/`conflict`), `deleted?`.

### Stratégie offline-first
4. **Lecture** : local d'abord (instantané), refresh serveur en arrière-plan.
5. **Écriture** : local immédiat (optimiste) **et** mutation enfilée. L'utilisateur n'attend jamais le réseau.
6. **File de mutations** persistée, ordonnée, **idempotente** (clé d'idempotence), rejouée à la reconnexion.
7. Détection online/offline explicite ; backoff exponentiel sur échec.

### Conflits & intégrité
8. **Stratégie de conflit déclarée par entité** : LWW horodaté, version incrémentale, ou merge champ-à-champ.
9. Le serveur **tranche** les conflits non résolubles ; l'entité passe en `conflict` et expose les deux versions.
10. Suppressions = **soft delete** synchronisé (tombstone).
11. Réconciliation **idempotente** : rejouer une sync ne duplique ni ne corrompt rien.

## ⛔ Anti-règles (jamais)
- ❌ Jamais traiter le local comme source de vérité : le serveur (`flo-supabase`) arbitre.
- ❌ Jamais stocker en clair une donnée que `flo-medical` classe sensible.
- ❌ Jamais stocker de secret, token long ou clé `service_role` côté client.
- ❌ Jamais de synchro non idempotente ni de file non persistée.
- ❌ Jamais afficher soi-même l'UI de statut (→ `flo-ui`).
- ❌ Jamais résoudre un conflit par écrasement silencieux sans stratégie déclarée.

## 🥇 Priorité
Niveau **5**. Cède devant medical, supabase, dev-standards, nextjs. Face à `flo-ui`, l'intégrité des données prime sur le confort visuel.

## 🔗 Interactions
- **Se coordonne** avec `flo-supabase` : pull/push contre la source de vérité, respect de la RLS (clé `anon` + session).
- **Expose** un statut à `flo-ui` (online/offline/syncing/conflict) sans gérer l'affichage.
- **Obéit** à `flo-medical` (chiffrement/rétention locale).
- **Applique** `flo-dev-standards`.
