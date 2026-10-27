# Bibliothèque de patterns — index

> Registre unique. Consulter AVANT de créer un composant (politique : `../SKILL.md` § Réutiliser).
> Une entrée = un dossier `patterns/<id>/` avec `README.md` (+ implémentation de référence optionnelle).
> On n'ajoute qu'un pattern **générique** qui a servi en vrai (colonne Origine).

| id | Catégorie | Intention | Stack | Statut | Origine |
|----|-----------|-----------|-------|--------|---------|
| [scroll-story](./patterns/scroll-story/README.md) | workflow · scroll | expliquer un parcours produit réel sur ses vrais écrans | React + motion | provisional | AuditRef (accueil) |
| [live-product-demo](./patterns/live-product-demo/README.md) | démo · interaction | faire jouer le vrai composant produit (props + état local) sur une page publique | React | provisional | AuditRef (accueil) |

Statuts : `provisional` (1 usage réel) → `stable` (≥ 2 projets) → `deprecated`.

Catégories prévues (créées seulement au premier besoin réel) : hero · workflow · timeline · cards ·
cta · badges · navigation · sections · stats · testimonials · feature-grid · steps · scroll ·
transitions · layouts.
