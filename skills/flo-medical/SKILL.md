---
name: flo-medical
description: Contrainte métier pour applications médicales (PatientHub et apps de santé). À activer dès qu'une donnée de santé, patient ou identifiante est manipulée — protection des données sensibles, séparation des données, logique métier santé et contraintes réglementaires (RGPD/HDS). AUTORITÉ MAXIMALE : ses exigences l'emportent sur tout autre skill. Il fixe le QUOI ; l'implémentation technique est déléguée.
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
> Ce skill **fixe des exigences** ; il ne réécrit pas la technique des autres skills.

## ▶️ When To Invoke
- Toute manipulation de **donnée de santé, patient ou identifiante (PII)**.
- Conception d'une **logique métier santé** (dossier, soignant, consentement de soin).
- Décider **où vivent et comment sont protégées** des données sensibles.
- Toute question de **conformité** (RGPD, HDS, rétention, audit, consentement).

## ⏹️ When NOT To Invoke
- Projet **sans aucune donnée sensible/santé** (alors medical est inerte).
- *Implémenter* RLS/chiffrement/crypto → `flo-supabase` / `flo-offline` (medical exige, ne code pas).
- Style, SEO, structure d'écran : medical ne s'en mêle que pour interdire l'exposition de données.

## 🎯 Scope (responsabilités)
- **Classification de sensibilité** : santé / identifiante (PII) / technique.
- **Protection des données sensibles** (exigence : chiffrement au repos, en transit, en local).
- **Séparation des données** : cloisonnement identité ↔ données de santé, pseudonymisation.
- **Logique métier santé** propre au domaine.
- **Contraintes réglementaires** : RGPD, HDS, base légale, droits, rétention, audit.

## 🚫 Hors-scope (délégué — exécution technique)
- **RLS / Edge / chiffrement serveur** → `flo-supabase`.
- **Chiffrement & rétention locale IndexedDB** → `flo-offline`.
- **Protection technique des routes (auth, no-cache)** → `flo-nextjs`.
- **noindex des pages sensibles** → `flo-seo`. **Fixtures/captures sans vraie donnée** → `playwright`.

## ✅ Règles strictes

### Classification & séparation
1. **Classer toute donnée** avant traitement ; la classe détermine les protections.
2. **Minimisation** : collecter/transmettre/stocker/afficher le strict nécessaire.
3. **Séparer identité et données de santé** quand c'est possible (identifiant interne pseudonyme).

### Protection (exigences imposées aux autres skills)
4. Donnée santé/PII = chiffrée **en transit, au repos et en local** (→ supabase/offline).
5. Accès au **moindre privilège**, vérifié côté serveur (→ supabase : RLS systématique).
6. **Aucune donnée santé/PII** dans logs, erreurs client, URLs, analytics, metadata, fixtures ni captures. Pages avec données patient = **noindex + authentifiées** (→ seo/nextjs/playwright).

### Conformité & gouvernance
7. **Base légale et consentement** explicites, traçables, révocables.
8. **Audit log** des accès/modifications (qui, quoi, quand), sans contenu superflu.
9. **Rétention définie + purge** automatique ; droit à l'effacement et à la portabilité.
10. **Anonymisation irréversible** pour tout usage secondaire (stats, démo, tests) — jamais de vraie donnée patient hors production.

### Posture
11. **Privacy & security by design / by default**.
12. En cas de doute sur la sensibilité : **traiter comme sensible** et signaler.

## ⛔ Anti-règles (jamais)
- ❌ Jamais de vraie donnée patient hors production (dev, test, démo, capture, ticket).
- ❌ Jamais de donnée santé/PII dans logs, erreurs, URLs, analytics, metadata, fixtures.
- ❌ Jamais stocker de la donnée santé en clair (serveur ou IndexedDB).
- ❌ Jamais indexer/rendre publique une page contenant des données patient.
- ❌ Jamais affaiblir une protection pour la perf, l'UX, le design, le SEO ou la rapidité de dev.
- ❌ Jamais implémenter soi-même RLS/chiffrement bas niveau (medical exige, les autres exécutent).

## 🥇 Priorité
Niveau **1 — autorité maximale.** En cas de conflit avec **n'importe quel** skill, medical l'emporte.

## 🔗 Interactions
- **Contraint** : supabase, offline, nextjs, seo, playwright, et les skills design (pas de vraie donnée dans les maquettes).
- **N'exécute pas** la technique : il pose l'exigence, les autres l'implémentent.
- **S'appuie sur** `flo-dev-standards` pour la rigueur du code de conformité.
- Activé **automatiquement** dès qu'une donnée de santé entre en jeu.
