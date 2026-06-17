---
name: flo-supabase
description: Règles d'accès aux données et de sécurité backend avec Supabase. À activer pour toute RLS, policy, Edge Function, migration SQL, gestion d'auth/session, ou accès base de données. Sécurité d'abord — la RLS n'est jamais contournée et le service_role ne fuit jamais côté client.
owns:
  - rls
  - edge-functions
  - supabase-auth
  - data-access-security
  - data-patterns
  - sql-migrations
excludes:
  - caching-revalidation
  - cache-strategies
  - regulatory-compliance
  - error-handling
---

# flo-supabase

> La porte des données. Rien n'entre ni ne sort sans passer par une règle de sécurité.

## ▶️ When To Invoke
- Écrire/relire une **policy RLS**, un rôle Postgres, une **migration SQL**.
- Créer/modifier une **Edge Function** ou gérer un **secret**/`service_role`.
- Mettre en place l'**auth** (session, cookies, middleware d'auth).
- Décider du **pattern d'accès** aux données (anon vs serveur).

## ⏹️ When NOT To Invoke
- *Où* appeler le helper dans le rendu → `flo-nextjs`.
- *Forme/typage* des retours → `flo-dev-standards`.
- Cache **local**/offline → `flo-offline`.
- *Exigence* de conformité (RGPD/HDS) → `flo-medical` (supabase l'applique, ne la définit pas).

## 🎯 Scope (responsabilités)
- **RLS** : activation, policies par rôle/opération, `auth.uid()`.
- **Edge Functions** : logique privilégiée, secrets, validation.
- **Auth** : session, cookies, refresh, middleware, rôles.
- **Sécurité d'accès** aux données ; **patterns de données** (anon vs service_role).
- **Schéma & migrations** SQL, contraintes, index.

## 🚫 Hors-scope (délégué)
- **Où/quand** appeler les helpers dans le rendu → `flo-nextjs`.
- **Forme/typage** des données → `flo-dev-standards`.
- **Cache local & synchro offline** → `flo-offline`.
- **Classification de sensibilité, exigence de chiffrement, conformité** → `flo-medical`.

## ✅ Règles strictes

### RLS — non négociable
1. **RLS activée sur TOUTES les tables**, sans exception, dès la création.
2. Policies **explicites par opération** (`select`/`insert`/`update`/`delete`) et par rôle. Pas de `using (true)` fourre-tout.
3. L'appartenance se vérifie via `auth.uid()` (ou claims JWT), jamais via un id passé par le client.
4. `insert`/`update` protégés par `with check` cohérent avec le `using`.
5. Toute policy est **testée** (cas autorisé + cas refusé) avant déploiement.

### Clés & secrets
6. Le client navigateur n'utilise **que la clé `anon`**. La clé `service_role` ne quitte **jamais** le serveur/Edge.
7. Le `service_role` (bypass RLS) est réservé aux Edge Functions / contextes serveur de confiance, pour des opérations justifiées.
8. Secrets via variables d'environnement, jamais en dur, jamais préfixés `NEXT_PUBLIC_`.

### Edge Functions
9. Toute logique privilégiée, secret tiers, ou règle non exprimable en RLS → **Edge Function**.
10. Chaque Edge Function : **valide ses entrées**, **vérifie l'auth**, gère les erreurs sans fuiter de détail.
11. Réponses typées et stables ; CORS restreint aux origines connues.

### Auth & session
12. Session gérée côté serveur (cookies httpOnly) pour les apps Next ; pas de token sensible en `localStorage`.
13. L'autorisation se vérifie **côté serveur/RLS**, jamais uniquement côté UI.

### Schéma & migrations
14. Tout changement de schéma = **migration versionnée** dans le repo.
15. Contraintes (`not null`, `foreign key`, `check`, `unique`) au niveau DB. Index sur les colonnes filtrées/jointes.

## ⛔ Anti-règles (jamais)
- ❌ **Jamais désactiver la RLS**, même temporairement.
- ❌ Jamais exposer `service_role` à un Client Component ou dans un bundle public.
- ❌ Jamais faire confiance à un `user_id`/`role` envoyé par le client.
- ❌ Jamais contourner une policy par une Edge Function `service_role` pour « simplifier ».
- ❌ Jamais stocker une donnée classée sensible sans appliquer les exigences de `flo-medical`.
- ❌ Jamais écrire de logique de rendu Next ni de cache local (→ nextjs / offline).

## 🥇 Priorité
Niveau **2**. Cède uniquement devant `flo-medical`. Prime sur tout le reste sur la sécurité d'accès : aucun besoin de perf, d'UX, de design ou de SEO ne justifie d'affaiblir la RLS.

## 🔗 Interactions
- **Fournit** les helpers data appelés par `flo-nextjs`.
- **Se coordonne** avec `flo-offline` : serveur = source de vérité, local = cache.
- **Obéit** à `flo-medical` (chiffrement, rétention, audit).
- **Applique** `flo-dev-standards` (typage des retours, gestion d'erreurs).
