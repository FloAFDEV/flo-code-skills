---
name: flo-offline
version: 2.0.0
description: Architecture offline-first avec Dexie/IndexedDB. À activer pour le stockage local, la stratégie de synchronisation client/serveur, la file de mutations hors-ligne, la résolution de conflits et l'état optimiste persisté. Le serveur Supabase reste la source de vérité.
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

## Objectif

Concevoir et implémenter une architecture offline-first qui garantit une expérience fluide sans réseau tout en maintenant la cohérence avec la source de vérité serveur (Supabase). S'active pour la conception du schéma Dexie, la stratégie de sync, la file de mutations et la résolution de conflits.

## Périmètre

**Possède :** schéma Dexie/IndexedDB (tables, versions, migrations locales, index), stratégie offline-first (lecture locale, écriture optimiste immédiate, file de mutations, push/pull), résolution de conflits, persistance de l'état optimiste entre sessions.

**Délègue :** source de vérité serveur, RLS, quelles données sont autorisées → `flo-supabase` · cache HTTP/serveur (`revalidate`) → `flo-nextjs` · affichage du statut de synchro (online/offline/syncing/conflict) → `flo-ui` · typage des entités et gestion d'erreurs → `flo-dev-standards` · chiffrement local des données sensibles (exigence) → `flo-medical`.

## Contraintes

**Versionnement du schéma :** tout changement de schéma Dexie = nouvelle version + migration explicite (`upgrade`). Jamais modifier une version déjà déployée. Chaque entité porte les métadonnées de sync : `localId`, `serverId?`, `updatedAt`, `syncStatus` (`pending`/`synced`/`conflict`), `deleted?`.

**File de mutations :** persistée, ordonnée, et idempotente — chaque mutation a une clé d'idempotence. L'utilisateur ne doit jamais attendre le réseau pour une écriture.

**Conflits :** chaque type d'entité a une stratégie de conflit déclarée (LWW horodaté, versioning incrémental, ou merge champ-à-champ). Un conflit non résolvable → entité en état `conflict` avec les deux versions exposées. Le serveur tranche — jamais le client seul par écrasement silencieux.

**Suppressions :** toujours via soft delete synchronisé (tombstone). Jamais de suppression physique locale immédiate.

**Données sensibles :** jamais stocker en clair une donnée que `flo-medical` classe sensible.

## Autorité

Niveau 5. Cède devant `flo-medical`, `flo-supabase`, `flo-dev-standards`, `flo-nextjs`. L'intégrité des données prime sur le confort visuel (`flo-ui`).

## Définition de terminé

Le schéma est versionné avec migrations. Chaque entité porte ses métadonnées de sync. La file est persistée et idempotente. La stratégie de conflit est déclarée pour chaque type d'entité. Rejouer une sync ne corrompt ni ne duplique rien.

## Références

Se coordonne avec `flo-supabase` (pull/push, respect de la RLS avec la clé `anon` + session). Expose le statut de synchro à `flo-ui` sans gérer l'affichage. Se coordonne avec `flo-nextjs` pour éviter les incohérences d'hydration (hydrater depuis le serveur, rafraîchir depuis le local). Obéit à `flo-medical`. Applique `flo-dev-standards`.
