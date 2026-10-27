# live-product-demo — le vrai composant produit, jouable sur une page publique

- **Statut** : provisional (candidat — `stable` seulement après validation sur un 2ᵉ projet) · **Origine** : AuditRef, page d'accueil (2026-10-27) · **Stack d'origine** : Vite + React
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

## Climax, pas annexe (enseignements AuditRef V2)

- **Place** : dernier temps du récit (« À vous »), pas une section ajoutée après que le récit a tout
  montré. Le récit montre le contexte et les conséquences ; la démo fait faire le geste.
- **Scénario court** : partir d'un **état réel intermédiaire** (contrôle repris en cours, la plupart
  des éléments déjà renseignés), laisser 2–3 décisions au visiteur. Jamais d'état impossible dans l'app.
- **Récompense dans la démo** : calculée par le **vrai moteur** du produit (fonctions pures existantes),
  rendue par ses vrais composants quand ils sont pilotés par props ; sinon présentation fidèle
  alimentée par la sortie du moteur. Le visiteur doit voir « ce que mon action produit ».
- **Bouton de détail** = aller vers la conséquence (livrable, liste, priorisation), jamais remonter la page.
- **Commandes InApp hors contexte** (retour, réinitialisation, dictée/micro, navigation) :
  neutralisées **par portée CSS** de la démo (sélecteurs sur `aria-label`/`title`) quand le
  composant n'offre pas d'option — jamais en modifiant le composant. Callbacks branchés sur des no-op.
- **Mise en scène** : la démo peut porter l'unique section à fond contrasté de la page (le vrai
  composant ressort sur la scène).

## Mobile

Le composant terrain est souvent déjà mobile-first : le garder en flux normal (pas de conteneur
défilant interne). Rappel du résultat **après le premier geste seulement** : barre opaque pleine
largeur `sticky bottom-0` placée en fin de colonne (elle finit à sa place, sous le composant), qui
mène au résultat ; `aria-hidden`, la synthèse complète restant dans le flux avec `aria-live="polite"`.

## Pièges

- Callbacks de navigation (retour) → les rediriger vers une ancre de la page, jamais vers le routeur.
- Toasts/portails : vérifier qu'ils ne supposent pas un provider monté uniquement après connexion.
