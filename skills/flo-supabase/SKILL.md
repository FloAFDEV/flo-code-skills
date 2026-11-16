---
name: flo-supabase
version: 2.1.0
description: Règles d'accès aux données et de sécurité backend avec Supabase. À activer pour toute RLS, policy, Edge Function, migration SQL, gestion d'auth/session ou accès base de données. Sécurité d'abord — la RLS n'est jamais contournée et le service_role ne fuit jamais côté client.
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

## Objectif

Garantir que tout accès aux données est contrôlé par des règles de sécurité vérifiées côté serveur. S'active pour écrire ou relire des policies RLS, des migrations SQL, des Edge Functions, configurer l'auth, ou décider du pattern d'accès (anon vs service_role).

## Périmètre

**Possède :** RLS (activation, policies par rôle et par opération, `auth.uid()`), Edge Functions (logique privilégiée, secrets tiers), auth (session, cookies, middleware), patterns d'accès aux données, schéma et migrations SQL.

**Délègue :** où et quand appeler les helpers dans le rendu → `flo-nextjs` · forme et typage des retours → `flo-dev-standards` · cache local et synchro offline → `flo-offline` · classification de sensibilité et conformité réglementaire → `flo-medical` (supabase applique, ne définit pas).

## Contraintes

**RLS — non négociable :**
- Activée sur toutes les tables dès leur création, sans exception.
- Policies explicites par opération (`select`/`insert`/`update`/`delete`) et par rôle. Pas de `using (true)` fourre-tout.
- L'appartenance se vérifie via `auth.uid()` ou claims JWT — jamais via un `user_id` passé par le client.
- `insert`/`update` protégés par un `with check` cohérent avec le `using` correspondant.
- Toute policy est testée (cas autorisé + cas refusé) avant déploiement.

**Clés et secrets :**
- Le navigateur n'utilise que la clé `anon`. Le `service_role` ne quitte jamais le serveur ou une Edge Function.
- `service_role` (bypass RLS) réservé aux opérations justifiées en contexte serveur de confiance — jamais pour contourner une policy complexe.
- Secrets via variables d'environnement — jamais préfixés `NEXT_PUBLIC_`, jamais en dur.

**Edge Functions :** logique privilégiée, secret tiers, ou règle non exprimable en RLS uniquement. Chaque Edge Function valide ses entrées, vérifie l'auth, et ne fuite aucun détail d'erreur. CORS restreint aux origines connues.

**Auth :** session côté serveur (cookies httpOnly). Jamais de token sensible en `localStorage`. L'autorisation est toujours vérifiée côté serveur — jamais uniquement côté UI.

**Migrations :** tout changement de schéma = migration versionnée dans le repo. Contraintes (NOT NULL, FK, CHECK, UNIQUE) au niveau DB — pas uniquement applicatif.

**Performance des requêtes :**
- Ne pas répéter `getUser()` ou toute résolution d'identité à chaque requête d'un même parcours — la résoudre une fois, la réutiliser pour le reste du parcours.
- Jamais de cache d'identité partagé entre utilisateurs ou entre requêtes concurrentes : un cache d'identité est strictement scopé à la requête ou à la session qui l'a produit.
- Détecter les cascades de requêtes (une requête qui en déclenche plusieurs autres en séquence) — paralléliser ou regrouper quand la dépendance n'est pas réelle.
- Garantir l'autorisation avant toute mutation, y compris quand une optimisation change le chemin d'exécution — une optimisation ne devient jamais un raccourci qui saute la vérification serveur.
- Conserver une pagination et des filtres exhaustifs côté serveur quand le volume le justifie — ne jamais reporter sur le client un filtrage qui devrait réduire la charge réseau en amont.

**Cohérence cache local / Realtime :**
- Après une mutation ciblée, mettre à jour localement l'élément concerné plutôt que recharger la liste complète — à condition que la cohérence avec le serveur soit préservée.
- Synchroniser caches locaux, compteurs et statuts affichés avec l'état réellement confirmé par le serveur : un compteur qui diverge du serveur est un bug, pas un détail d'UI.
- Éviter le double rafraîchissement — un événement Realtime et une mise à jour locale optimiste qui se chevauchent sur la même donnée — en choisissant une source qui tranche en cas de conflit.
- Gérer explicitement les événements concurrents, les doublons et les réponses obsolètes (une réponse arrivant après qu'un état plus récent a déjà été appliqué) : l'ordre d'arrivée réseau n'est pas un ordre de vérité.
- Conserver un polling de secours raisonnable quand Realtime peut se déconnecter silencieusement ; tester explicitement la perte de connexion et la resynchronisation au retour.

**Index SQL :** toute modification d'index se mesure avant/après (plan d'exécution, temps de requête réel) — un index ajouté sans mesure préalable est une hypothèse, pas une optimisation. Illustration chiffrée de la méthode avant/après : voir l'exemple Garage Mendonça dans `flo-dev-standards`.

## Autorité

Niveau 2. Cède uniquement devant `flo-medical`. Prime sur tout le reste pour la sécurité d'accès — aucun besoin de performance, d'UX, de design ou de SEO ne justifie d'affaiblir la RLS.

## Définition de terminé

RLS activée sur toutes les tables avec policies testées (autorisé + refusé). Aucune clé `service_role` accessible côté client. Toutes les Edge Functions valident et authentifient. Les migrations sont versionnées dans le repo. Aucune résolution d'identité redondante ni cache d'identité partagé entre utilisateurs ; les mutations ciblées mettent à jour l'état local sans recharger des listes entières ni dupliquer Realtime et optimiste.

## Références

Fournit les helpers data appelés par `flo-nextjs`. Se coordonne avec `flo-offline` (serveur = source de vérité, local = cache). Obéit à `flo-medical`. Applique `flo-dev-standards`.
