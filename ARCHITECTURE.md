# Architecture du système flo-code-skills

Ce document est la **source de vérité** pour les frontières entre skills.
Il garantit : zéro chevauchement, zéro duplication de règle, zéro conflit d'autorité.

---

## 1. Hiérarchie d'autorité (résolution de conflits)

Quand deux skills semblent dicter des règles contradictoires, **le skill le plus haut l'emporte** :

```
1. flo-medical        ── conformité & sécurité des données de santé (ne cède jamais)
2. flo-supabase       ── sécurité d'accès aux données (RLS, secrets)
3. flo-dev-standards  ── correction du code, typage, architecture
4. flo-nextjs         ── correction framework / rendu
5. flo-offline        ── intégrité de la persistance locale
6. flo-ui             ── présentation & interaction
7. flo-seo            ── découvrabilité
```

> **Principe** : la *sécurité et la conformité* l'emportent toujours sur le *confort de développement*, qui l'emporte sur la *présentation*, qui l'emporte sur le *référencement*.
> Exemple : si flo-seo veut rendre une page publique (SSG) mais flo-medical exige une authentification → **medical gagne**, la page reste protégée.

---

## 2. Matrice de responsabilités (qui possède quoi)

Chaque ligne appartient à **un seul** skill. Les autres y renvoient.

| Domaine concret | Skill propriétaire |
|-----------------|--------------------|
| TypeScript strict, types partagés, génériques | **flo-dev-standards** |
| Arborescence dossiers, nommage, barrels | **flo-dev-standards** |
| Gestion d'erreurs (Result, try/catch, boundaries) | **flo-dev-standards** |
| Conventions Git, commits, refactoring | **flo-dev-standards** |
| App Router, layouts, route groups | **flo-nextjs** |
| Server vs Client Components (décision) | **flo-nextjs** |
| Data fetching serveur, caching, revalidation | **flo-nextjs** |
| `next/image`, `next/font`, Server Actions | **flo-nextjs** |
| API Metadata Next (mécanique `generateMetadata`) | **flo-nextjs** |
| RLS, policies, rôles Postgres | **flo-supabase** |
| Edge Functions, secrets, service_role | **flo-supabase** |
| Auth Supabase (session, cookies, middleware d'auth) | **flo-supabase** |
| Migrations SQL, schéma DB | **flo-supabase** |
| Dexie/IndexedDB schéma & versions | **flo-offline** |
| Stratégie de synchro offline-first | **flo-offline** |
| Résolution de conflits de données locales | **flo-offline** |
| Design system, tokens, Tailwind conventions | **flo-ui** |
| Micro-interactions, hover, transitions, animations | **flo-ui** |
| Patterns de CTA, états (loading/empty/error visuels) | **flo-ui** |
| Accessibilité (ARIA, focus, contraste, clavier) | **flo-ui** |
| Contenu metadata (titre/description, OG, Twitter) | **flo-seo** |
| JSON-LD / structured data | **flo-seo** |
| sitemap, robots, canonical, hreflang | **flo-seo** |
| Cibles Core Web Vitals & budget perf SEO | **flo-seo** |
| Classification sensibilité données (santé) | **flo-medical** |
| Anonymisation / pseudonymisation | **flo-medical** |
| Conformité RGPD / HDS, audit, rétention, consentement | **flo-medical** |
| Chiffrement des données sensibles (exigence) | **flo-medical** |

### Frontières souvent confondues — qui tranche

| Sujet ambigu | Propriétaire | Pourquoi |
|--------------|--------------|----------|
| Metadata SEO | **mécanique** = nextjs · **contenu/stratégie** = seo | nextjs sait *comment* l'API marche ; seo sait *quoi* y mettre |
| Performance | **rendu/bundle** = nextjs · **budget & impact ranking** = seo · **persistance** = offline | chaque skill optimise sa couche |
| Auth | **session/RLS** = supabase · **décision de protéger une route** = medical (si données santé) sinon nextjs | sécurité d'abord |
| Animations | **flo-ui** uniquement | nextjs/seo n'imposent jamais d'animation |
| Validation de données | **forme/typage** = dev-standards · **règles d'accès** = supabase · **conformité** = medical | trois angles distincts, jamais dupliqués |
| Optimisation images | **technique (`next/image`)** = nextjs · **alt/SEO** = seo · **esthétique** = ui | |

---

## 3. Interdictions transversales (anti-règles globales)

Pour éviter les conflits, **aucun** skill ne fait ce qui suit hors de son périmètre :

- ❌ flo-ui ne décide jamais du rendu serveur/client (→ flo-nextjs).
- ❌ flo-seo n'impose jamais une stratégie de rendu qui exposerait des données protégées (→ flo-medical/supabase priment).
- ❌ flo-nextjs ne définit jamais de tokens de design ni d'animations (→ flo-ui).
- ❌ flo-supabase ne contourne jamais la RLS, même « temporairement » (→ règle absolue).
- ❌ flo-offline ne stocke jamais en clair des données classées sensibles (→ flo-medical).
- ❌ flo-dev-standards n'introduit pas de règles spécifiques à un framework (reste universel).
- ❌ Aucun skill ne recopie une règle d'un autre : il y **renvoie**.

---

## 4. Carte des interactions

```
                 flo-medical  (conformité — autorité max sur la donnée santé)
                  │  contraint
        ┌─────────┼──────────────┐
        ▼         ▼              ▼
  flo-supabase  flo-offline   flo-nextjs
   (accès DB)   (persistance) (rendu/routes)
        │           │              │
        └─────┬─────┘              │
              │ données            │ structure
              ▼                    ▼
        flo-dev-standards  ◄──────── socle commun (typage, archi, erreurs)
              ▲
              │ s'appuie sur
        ┌─────┴─────┐
        ▼           ▼
     flo-ui      flo-seo
  (présentation) (découvrabilité)
```

**Lectures clés**
- `flo-medical` **contraint** supabase, offline et nextjs (chiffrement, protection de routes, rétention).
- `flo-supabase` ↔ `flo-offline` se coordonnent sur la **synchro** (source de vérité serveur, cache local).
- `flo-nextjs` **consomme** supabase (data) et **héberge** ui (composants) + seo (metadata).
- `flo-ui` et `flo-seo` **partagent** le même DOM : ui possède le style/interaction, seo possède la sémantique/metadata.
- `flo-dev-standards` est **consulté par tous** (jamais l'inverse).

---

## 5. Format d'un SKILL.md

```markdown
---
name: flo-xxx
description: Quand activer ce skill (déclencheurs concrets).
---

# flo-xxx
## 🎯 Scope          → périmètre exact (ce qu'il possède)
## 🚫 Hors-scope     → ce qu'il délègue, et à qui
## ✅ Règles strictes → règles numérotées, applicables
## ⛔ Anti-règles     → ce qu'il ne fait JAMAIS
## 🥇 Priorité        → position dans la hiérarchie + arbitrages
## 🔗 Interactions    → qui il consulte / à qui il délègue
```
