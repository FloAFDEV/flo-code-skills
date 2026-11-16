# Changelog — flo-supabase

## 2.1.0 — 2026-11-13
- Ajout (additif, `data-patterns`/`supabase-auth`) : règles de performance et de cohérence — résolution d'identité non répétée et jamais mise en cache entre utilisateurs, détection des cascades de requêtes, autorisation garantie avant mutation même après optimisation.
- Cohérence cache local/Realtime : mise à jour ciblée plutôt que rechargement complet, synchronisation caches/compteurs/statuts avec le serveur, gestion des doubles rafraîchissements, événements concurrents, doublons et réponses obsolètes, polling de secours et test de resynchronisation.
- Pagination/filtres exhaustifs côté serveur ; mesure avant/après obligatoire pour toute modification d'index SQL.

## 1.0.0 — 2026-06-17
- Première version versionnée.
- Périmètre : RLS, Edge Functions, Auth, sécurité d'accès, patterns de données, migrations SQL.
