# live-product-demo — le vrai composant produit, jouable sur une page publique

- **Statut** : provisional · **Origine** : AuditRef, page d'accueil (2026-10-27) · **Stack d'origine** : Vite + React
- Complète [`scroll-story`](../scroll-story/README.md) : le récit montre, la démo fait essayer.

## Intention

Laisser le visiteur **faire un geste réel** du produit (le vrai formulaire, la vraie carte de résultat)
et voir la conséquence immédiatement — sans compte, sans backend, sans maquette.

## Condition d'usage (à vérifier avant tout)

Le composant est **piloté par props** : données + callbacks, aucun accès direct au store global,
à la base locale (Dexie/IndexedDB), à l'API ou au routeur. Vérifier ses imports récursivement.
Sinon → captures (`scroll-story`) ; ne **jamais** modifier le composant métier pour l'y rendre éligible
sans demande explicite.

## Recette

1. Monter le composant **tel quel** depuis son emplacement InApp (aucune copie, aucune variante).
2. Données : objets en mémoire construits avec les **fabriques pures** du projet (seed, builders) —
   mêmes données que l'app, jamais le store.
3. État local (`useState`) branché sur ses callbacks ; reset = callback de reset du composant.
4. Résultat : un **vrai** composant de synthèse du produit, alimenté par des valeurs dérivées de l'état.
5. Mention visible « Démonstration locale : rien n'est enregistré ».
6. Chargement : dans le chunk lazy de la page ; mesurer le bundle principal avant/après.

## Mobile

Le composant terrain est souvent déjà mobile-first : le garder en flux normal (pas de conteneur
défilant interne). Ajouter un rappel du résultat `sticky bottom-4` (`aria-hidden`, la synthèse
complète reste dans le flux avec `aria-live="polite"`).

## Pièges

- Callbacks de navigation (retour) → les rediriger vers une ancre de la page, jamais vers le routeur.
- Toasts/portails : vérifier qu'ils ne supposent pas un provider monté uniquement après connexion.
