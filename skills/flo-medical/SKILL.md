---
name: flo-medical
description: Conformité et sécurité des données de santé (PatientHub et apps médicales). À activer dès qu'une donnée de santé, patient ou identifiante est manipulée — classification de sensibilité, anonymisation/pseudonymisation, RGPD/HDS, consentement, audit, rétention et exigences de chiffrement. AUTORITÉ MAXIMALE : ses règles l'emportent sur tout autre skill.
---

# flo-medical

> La conformité ne se négocie pas. Autorité maximale sur la donnée de santé.

## 🎯 Scope
- **Classification de sensibilité** des données (santé, identifiantes, techniques).
- **Anonymisation / pseudonymisation** et minimisation.
- **Conformité RGPD / HDS** : base légale, consentement, droits des personnes.
- **Audit, traçabilité, rétention** et purge.
- **Exigences de chiffrement** (au repos, en transit, en local) — *quoi* chiffrer (le *comment* technique est exécuté par supabase/offline).

## 🚫 Hors-scope (délégué — exécution technique)
- **Mise en œuvre RLS/Edge** → `flo-supabase` (medical fixe l'exigence, supabase l'implémente).
- **Chiffrement local IndexedDB** → `flo-offline` (medical exige, offline applique).
- **Protection de route technique** → `flo-nextjs` (sur instruction de medical).
- **Style/UI** → `flo-ui` ; **SEO** → `flo-seo`.

## ✅ Règles strictes

### Classification & minimisation
1. **Classer toute donnée** avant traitement : *sensible santé* / *identifiante (PII)* / *technique*. La classification détermine les protections.
2. **Minimisation** : ne collecter, transmettre, stocker et afficher que le strict nécessaire. Pas de donnée santé « au cas où ».
3. Séparer identité et données de santé quand c'est possible (pseudonymisation via identifiant interne).

### Protection des données
4. Donnée de santé/PII = **chiffrée en transit (TLS) et au repos** ; en local (IndexedDB), **chiffrée** — jamais en clair (exigence imposée à `flo-offline`).
5. Accès **strictement contrôlé** : principe du moindre privilège, RLS imposée à `flo-supabase`, vérification serveur systématique.
6. **Aucune donnée santé/PII** dans les logs, messages d'erreur, URLs, analytics, ou metadata SEO. Les pages contenant des données patient sont **noindex + authentifiées** (impose à `flo-seo` et `flo-nextjs`).

### Conformité & gouvernance
7. **Base légale et consentement** explicites, traçables et révocables pour chaque traitement.
8. **Audit log** des accès et modifications aux données sensibles (qui, quoi, quand) — immuable, sans contenu sensible superflu.
9. **Rétention définie et purge** automatique en fin de durée légale ; droit à l'effacement et à la portabilité implémentables.
10. Anonymisation **irréversible** pour les usages secondaires (stats, démos, jeux de test) — jamais de vraie donnée patient en environnement non-prod.

### Posture
11. **Security & privacy by design / by default** : la protection est l'état par défaut, l'ouverture est l'exception justifiée.
12. En cas de doute sur la licéité ou la sensibilité d'un traitement : **se comporter comme si c'était sensible** et signaler.

## ⛔ Anti-règles (jamais)
- ❌ Jamais de vraie donnée patient hors production (dev, test, démo, capture d'écran, ticket).
- ❌ Jamais de donnée santé/PII dans logs, erreurs client, URLs, analytics ou metadata.
- ❌ Jamais stocker de la donnée santé en clair (serveur ou IndexedDB).
- ❌ Jamais indexer/rendre publique une page contenant des données patient.
- ❌ Jamais affaiblir une protection pour la perf, l'UX, le SEO ou la rapidité de dev.
- ❌ Jamais implémenter soi-même la RLS/le chiffrement bas niveau (medical exige, les autres skills exécutent).

## 🥇 Priorité
Niveau **1 — autorité maximale.** En cas de conflit avec **n'importe quel** autre skill, medical l'emporte. Aucun gain de performance, d'expérience ou de référencement ne justifie d'enfreindre une exigence de conformité ou de sécurité des données de santé.

## 🔗 Interactions
- **Contraint** `flo-supabase` (RLS, audit, chiffrement serveur), `flo-offline` (chiffrement local, rétention), `flo-nextjs` (protection/no-cache des routes), `flo-seo` (noindex).
- **N'exécute pas** la technique : il fixe les exigences, les autres skills les implémentent.
- **S'appuie sur** `flo-dev-standards` pour la rigueur du code de conformité.
- Activé **automatiquement** dès qu'une donnée de santé entre en jeu, même si un autre skill semble suffire.
