---
name: flo-offline
description: Architecture offline-first avec Dexie/IndexedDB. À activer pour le stockage local, la stratégie de synchronisation client/serveur, la file de mutations hors-ligne, la résolution de conflits et l'UI optimiste persistée. Le serveur Supabase reste la source de vérité.
---

# flo-offline

> L'app marche sans réseau, puis réconcilie. Le local est un cache, pas la vérité.

## 🎯 Scope
- Schéma **Dexie/IndexedDB** : tables, versions, migrations locales, index.
- **Stratégie de synchro** offline-first (lecture locale, écriture en file, push/pull).
- **File de mutations** hors-ligne et rejeu à la reconnexion.
- **Résolution de conflits** (LWW, versionning, merge).
- Persistance de l'**état optimiste** entre sessions.

## 🚫 Hors-scope (délégué)
- **Source de vérité serveur, RLS, secrets** → `flo-supabase`.
- **Affichage des états (offline/syncing/error)** → `flo-ui` (offline fournit le statut, ui le rend).
- **Typage des entités, gestion d'erreurs** → `flo-dev-standards`.
- **Chiffrement local des données sensibles (exigence)** → `flo-medical`.

## ✅ Règles strictes

### Schéma local
1. Schéma Dexie **versionné** ; tout changement = nouvelle version + fonction `upgrade`. Jamais muter une version publiée.
2. Index sur les clés de requête et de synchro (`updatedAt`, `syncStatus`, `serverId`).
3. Chaque entité locale porte des métadonnées de synchro : `localId`, `serverId?`, `updatedAt`, `syncStatus` (`pending`/`synced`/`conflict`), `deleted?` (soft delete).

### Stratégie offline-first
4. **Lecture** : on lit le local d'abord (instantané), on rafraîchit depuis le serveur en arrière-plan.
5. **Écriture** : on écrit en local immédiatement (UI optimiste) **et** on enfile une mutation à pousser. L'utilisateur n'attend jamais le réseau pour voir son action.
6. La **file de mutations** est persistée (IndexedDB), ordonnée, idempotente (clé d'idempotence par mutation) et rejouée à la reconnexion.
7. Détection online/offline explicite ; backoff exponentiel sur échec de sync ; pas de boucle de retry agressive.

### Conflits & intégrité
8. **Stratégie de conflit déclarée par entité** (jamais implicite) : Last-Write-Wins horodaté, version incrémentale, ou merge champ-à-champ selon le métier.
9. Le serveur **tranche** en cas de conflit non résoluble automatiquement ; l'entité passe en `conflict` et expose les deux versions à l'UI.
10. Suppressions = **soft delete** synchronisé (tombstone), pas de suppression locale silencieuse qui « ressuscite » au prochain pull.
11. Réconciliation **idempotente** : rejouer une sync deux fois ne duplique ni ne corrompt rien.

## ⛔ Anti-règles (jamais)
- ❌ Jamais traiter le local comme source de vérité : le serveur (`flo-supabase`) arbitre.
- ❌ Jamais **stocker en clair** dans IndexedDB une donnée classée sensible par `flo-medical`.
- ❌ Jamais stocker de secret, token long ou clé `service_role` côté client.
- ❌ Jamais de synchro non idempotente ni de file de mutations non persistée.
- ❌ Jamais afficher soi-même l'UI de statut (→ `flo-ui` consomme le statut exposé).
- ❌ Jamais résoudre un conflit par écrasement silencieux sans stratégie déclarée.

## 🥇 Priorité
Niveau **5**. Cède devant medical, supabase et dev-standards. En cas de tension avec `flo-ui` (ex. : afficher un état périmé), l'intégrité des données prime sur le confort visuel.

## 🔗 Interactions
- **Se coordonne** avec `flo-supabase` : pull/push contre la source de vérité, respect de la RLS (la sync utilise la clé `anon` + session de l'utilisateur).
- **Expose** un statut de synchro à `flo-ui` (online/offline/syncing/conflict) sans gérer l'affichage.
- **Obéit** à `flo-medical` pour le chiffrement et la rétention locale des données santé.
- **Applique** `flo-dev-standards` (typage des entités, `Result` sur les opérations faillibles).
