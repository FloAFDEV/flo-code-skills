---
name: flo-supabase
description: Règles d'accès aux données et de sécurité backend avec Supabase. À activer pour toute RLS, policy, Edge Function, migration SQL, gestion d'auth/session, ou accès base de données. Sécurité d'abord — la RLS n'est jamais contournée et le service_role ne fuit jamais côté client.
---

# flo-supabase

> La porte des données. Rien n'entre ni ne sort sans passer par une règle de sécurité.

## 🎯 Scope
- **RLS** : activation, policies par rôle/opération, `auth.uid()`.
- **Edge Functions** : logique privilégiée, secrets, validation.
- **Auth** : session, cookies, refresh, middleware d'authentification, rôles.
- **Schéma & migrations** SQL, contraintes, index.
- Patterns d'accès client/serveur (clé `anon` vs `service_role`).

## 🚫 Hors-scope (délégué)
- **Où/quand** appeler ces helpers dans le rendu → `flo-nextjs`.
- **Forme/typage** des données → `flo-dev-standards` (Supabase fournit, dev-standards type).
- **Cache local & synchro offline** → `flo-offline`.
- **Conformité réglementaire / anonymisation (RGPD, HDS)** → hors périmètre du système actuel (à introduire comme skill dédié si besoin ; voir README « Ajouter un skill »).

## ✅ Règles strictes

### RLS — non négociable
1. **RLS activée sur TOUTES les tables**, sans exception, dès la création. Une table sans RLS est un bug de sécurité.
2. Policies **explicites par opération** (`select`/`insert`/`update`/`delete`) et par rôle. Pas de policy fourre-tout `using (true)`.
3. L'appartenance se vérifie via `auth.uid()` (ou claims JWT), jamais via un id passé par le client.
4. `insert`/`update` protégés par `with check` cohérent avec le `using`.
5. Toute policy est **testée** (cas autorisé + cas refusé) avant déploiement.

### Clés & secrets
6. Le client navigateur n'utilise **que la clé `anon`**. La clé `service_role` ne quitte **jamais** le serveur/Edge.
7. Le `service_role` (bypass RLS) est réservé aux Edge Functions / contextes serveur de confiance, pour des opérations explicitement justifiées — jamais « par confort ».
8. Secrets via variables d'environnement Supabase / serveur, jamais en dur, jamais dans le repo, jamais préfixés `NEXT_PUBLIC_`.

### Edge Functions
9. Toute logique nécessitant un privilège, un secret tiers, ou une règle métier non exprimable en RLS → **Edge Function**, pas du code client.
10. Chaque Edge Function : **valide ses entrées** (schéma), **vérifie l'auth**, gère les erreurs sans fuiter de détail interne, et journalise le nécessaire.
11. Réponses typées et stables ; CORS restreint aux origines connues.

### Auth & session
12. Session gérée côté serveur (cookies httpOnly) pour les apps Next ; refresh géré, pas de token en `localStorage` pour des contextes sensibles.
13. L'autorisation se vérifie **côté serveur/RLS**, jamais uniquement côté UI (l'UI masque, la RLS protège).

### Schéma & migrations
14. Tout changement de schéma passe par une **migration versionnée** dans le repo. Pas de modif manuelle non tracée en prod.
15. Contraintes (`not null`, `foreign key`, `check`, `unique`) au niveau DB, pas seulement applicatif. Index sur les colonnes filtrées/jointes.

## ⛔ Anti-règles (jamais)
- ❌ **Jamais désactiver la RLS**, même temporairement, même en dev partagé.
- ❌ Jamais exposer `service_role` à un Client Component ou dans un bundle public.
- ❌ Jamais faire confiance à un `user_id`/`role` envoyé par le client.
- ❌ Jamais contourner une policy par une Edge Function `service_role` pour « simplifier » une feature.
- ❌ Jamais exposer une donnée sensible via une policy trop permissive ou un endpoint public non protégé.
- ❌ Jamais écrire de logique de rendu Next ni de cache local (→ nextjs / offline).

## 🥇 Priorité
Niveau **1 — autorité maximale.** En cas de conflit avec n'importe quel autre skill, supabase l'emporte sur les questions de sécurité d'accès : aucun besoin de perf, d'UX ou de SEO ne justifie d'affaiblir la RLS.

## 🔗 Interactions
- **Fournit** les helpers data appelés par `flo-nextjs`.
- **Se coordonne** avec `flo-offline` : le serveur est la **source de vérité**, le local est un cache à synchroniser.
- **Applique** `flo-dev-standards` (typage des retours, gestion d'erreurs).
