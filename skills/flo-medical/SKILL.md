---
name: flo-medical
version: 2.0.0
description: Contrainte métier pour applications médicales (PatientHub et apps de santé). À activer dès qu'une donnée de santé, patient ou identifiante est manipulée. Autorité maximale — ses exigences l'emportent sur tout autre skill. Fixe le QUOI ; l'implémentation technique est déléguée.
owns:
  - medical-apps
  - sensitive-data-protection
  - data-separation
  - health-business-logic
  - regulatory-compliance
excludes:
  - rls
  - edge-functions
  - cache-strategies
  - metadata-content
---

# flo-medical

> La conformité ne se négocie pas. Autorité maximale sur la donnée de santé.

## Objectif

Garantir que les applications de santé respectent les exigences réglementaires (RGPD, HDS) et protègent les données patient à chaque couche du système. S'active dès qu'une donnée de santé, patient ou identifiante (PII) entre en jeu — conception, implémentation ou revue. Inerte sur les projets sans données sensibles.

## Périmètre

**Possède :** classification de la sensibilité des données, exigences de protection (chiffrement, accès minimal), séparation identité/données de santé, logique métier santé (dossier, soignant, consentement de soin), conformité réglementaire (RGPD/HDS, base légale, consentement, rétention, audit).

**Délègue :** RLS et chiffrement serveur → `flo-supabase` · chiffrement local IndexedDB → `flo-offline` · protection des routes et authentification → `flo-nextjs` · noindex des pages sensibles → `flo-seo` · fixtures anonymisées dans les tests → `playwright`. Medical fixe les exigences ; les autres skills les exécutent.

## Contraintes

**Classification :** toute donnée est classée avant traitement (santé / identifiante / technique). En cas de doute sur la sensibilité d'une donnée dans un contexte santé, la traiter comme sensible.

**Minimisation :** collecter, transmettre, stocker et afficher le strict nécessaire — pas plus.

**Séparation :** dissocier identité et données de santé quand c'est possible, via un identifiant interne pseudonyme.

**Protection (exigences imposées aux autres skills) :**
- Données santé/PII chiffrées en transit, au repos et en local (→ `flo-supabase`, `flo-offline`).
- Accès au moindre privilège, vérifié côté serveur — RLS systématique sans exception (→ `flo-supabase`).
- Zéro donnée santé/PII dans logs, erreurs client, URLs, analytics, metadata, fixtures ou captures.
- Pages avec données patient : noindex + authentifiées (→ `flo-seo`, `flo-nextjs`, `playwright`).

**Conformité :**
- Base légale et consentement explicites, traçables, révocables.
- Audit log des accès et modifications (qui, quoi, quand) — sans contenu superflu.
- Rétention définie avec purge automatique ; droit à l'effacement et à la portabilité implémentés.
- Tout usage secondaire (stats, démo, tests) → anonymisation irréversible. Jamais de vraie donnée patient hors production.

## Autorité

Niveau 1 — autorité maximale. En conflit avec n'importe quel autre skill, medical l'emporte. Aucune contrainte de performance, d'UX, de design ou de délai ne justifie d'y déroger.

## Définition de terminé

Toute donnée sensible est classée. Les protections (chiffrement, RLS, noindex, anonymisation des tests) sont en place et vérifiables. La base légale et la durée de rétention sont documentées.

## Références

Contraint activement : `flo-supabase`, `flo-offline`, `flo-nextjs`, `flo-seo`, `playwright`. S'appuie sur `flo-dev-standards` pour la rigueur du code de conformité.
