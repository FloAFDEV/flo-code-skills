# Rapport de maturité — flo-code-skills

État courant : **12 skills · 88 responsabilités canoniques uniques · 0 chevauchement** (CI verte).
Ce document est le rapport de maturité de référence du système.

## 1. Vérifications de finalisation (qualité)

| Contrôle | Résultat |
|----------|----------|
| CI `check-overlaps` | ✅ verte sur le dernier commit |
| Chevauchements / versions | ✅ 88 responsabilités disjointes, 12 versions SemVer valides |
| Liens internes de doc | ✅ 100 % résolus (résolution relative par fichier) |
| Cohérence exemples ↔ responsabilités | ✅ exemples alignés (ex. diagnostic `flo-debug` qui défère le correctif au propriétaire ; `MedicalClinic` JSON-LD côté seo) |
| Contradictions inter-skills | ✅ aucune non résolue (voir §2) |
| Comptages doc à jour | ✅ rapport Phase 1 archivé, état courant 12/88 partout |
| Gouvernance fichiers | ✅ `LICENSE` (MIT) ajoutée, cohérente avec `package.json` |

## 2. Audit anti-contradiction (au-delà des tokens)

Tensions potentielles passées en revue et leur résolution :

| Tension | Résolution |
|---------|------------|
| `design-taste` (simplifier) vs `flo-ui` (a11y non négociable) | hiérarchie : a11y > esthétique |
| `flo-seo` (rendre public) vs `flo-supabase`/`flo-medical` | noindex + auth gagnent toujours |
| `flo-offline` (lecture locale client) vs `flo-nextjs` (Server Component par défaut) | **clarifié** : exception assumée offline-first, hydration serveur puis refresh local |
| `flo-ui` (extraire si pattern répété) vs `design-taste` (cartes répétitives) | réutilisation *code* ≠ monotonie *visuelle* |
| `flo-debug` (heuristiques cross-techno) vs propriétaires | debug **diagnostique**, le propriétaire **corrige** |

Aucune anti-règle d'un skill n'en contredit une autre : les conflits retombent tous sur la hiérarchie d'autorité.

## 3. Lecture « nouvel utilisateur »

Parcours testé : `README` → pipeline → `docs/skill-boundaries.md` → un `SKILL.md`.
- **Points forts** : entrée claire (README), pipeline visuel, sections *When To / NOT To Invoke*, vérif automatique reproductible (`npm run check:overlaps`).
- **Frictions corrigées** : rapport Phase 1 désormais marqué « archive » ; frontière offline/nextjs explicitée ; LICENSE ajoutée.

## 4. Notes de maturité

| Critère | Note | Justification |
|---------|------|---------------|
| **Architecture** | **9.5/10** | Frontières disjointes prouvées par CI ; pipeline par phase ; hiérarchie d'autorité déterministe. −0.5 : `ux` reste un token large (cadré mais à surveiller). |
| **Maintenabilité** | **9/10** | Une responsabilité = un propriétaire ; versionnement SemVer + changelogs ; vérif automatique. −1 : doublons rédactionnels Scope ↔ `owns` à maintenir à la main. |
| **Extensibilité** | **9/10** | Ajout d'un skill = tokens neufs + ligne de matrice ; CI bloque les doublons ; procédure documentée. −1 : pas de génération auto de la matrice depuis le frontmatter (manuelle). |
| **Compatibilité Claude Code** | **9.5/10** | Seuls `name`+`description` en contexte permanent ; corps chargé à la demande ; changelogs hors `SKILL.md` ; orchestrateur à invocation minimale. −0.5 : 12 descriptions augmentent légèrement le coût de routage. |
| **Gouvernance des skills** | **9/10** | Autorité explicite, anti-règles, dépréciation, audit tracé, CI gate. −1 : pas encore de tests sur le vérificateur lui-même ni de lint de liens en CI. |

**Maturité globale : 9.2 / 10** — système de niveau production, cohérent, gouverné et outillé.

## 5. Améliorations futures (fort impact / faible complexité)

1. **Lint de liens + comptages en CI** : étendre `check-overlaps` (ou un job dédié) pour valider les liens internes et la cohérence des chiffres — empêche toute régression doc. *(faible complexité)*
2. **Génération de la matrice** : dériver le tableau de `docs/skill-boundaries.md` depuis les frontmatter `owns`/`excludes` pour supprimer la double saisie. *(faible complexité)*
3. **Tests du vérificateur** : quelques cas (`owns` dupliqué, version absente) pour garantir que la CI échoue bien quand elle doit. *(faible complexité)*

> Aucune de ces améliorations ne nécessite de **nouveau skill**. Aucun manque critique justifiant un
> nouveau skill n'a été identifié : l'architecture est gelée à 12 skills.
