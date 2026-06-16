# flo-code-skills

> Système universel de skills Claude Code de Florian — standard unique pour tous les projets
> **Next.js 15+** · **Vite/React** · **Supabase** · **Offline-first (Dexie/IndexedDB)** · **SaaS & applications médicales** · **UX/UI premium** · **SEO avancé**.

Ce dépôt regroupe 7 skills Claude Code **cohérents, non redondants et sans conflit d'autorité**.
Chaque skill possède un périmètre strict, des règles explicites, des **anti-règles** (ce qu'il ne doit jamais faire) et une hiérarchie de priorité claire.

---

## 🎯 Philosophie

1. **Zéro redondance** — une règle vit dans un seul skill. Les autres y *renvoient*, ils ne la *recopient* pas.
2. **Autorité hiérarchique** — en cas de conflit, un ordre de priorité tranche (voir `ARCHITECTURE.md`).
3. **Production-first** — règles applicables à de vrais projets SaaS, pas de théorie.
4. **Extensible** — ajouter un skill ne casse jamais l'existant (voir « Ajouter un skill »).

---

## 📦 Les 7 skills

| Skill | Domaine | Question à laquelle il répond |
|-------|---------|-------------------------------|
| **flo-dev-standards** | Fondations code | *Comment écrit-on du code propre, typé, organisé ?* |
| **flo-nextjs** | Framework / rendu | *Server ou Client ? Comment route-t-on, fetch-t-on, build-t-on ?* |
| **flo-supabase** | Données & sécurité backend | *Comment accède-t-on aux données de façon sûre (RLS, Edge) ?* |
| **flo-offline** | Persistance locale | *Comment fonctionne l'offline-first et la synchro ?* |
| **flo-ui** | Présentation & interaction | *À quoi ça ressemble et comment ça réagit ?* |
| **flo-seo** | Découvrabilité | *Comment est-on indexé et partagé ?* |
| **flo-medical** | Conformité & sensibilité | *Comment protège-t-on des données de santé ?* |

Détail complet des frontières dans **[`ARCHITECTURE.md`](./ARCHITECTURE.md)**.

---

## 🚀 Installation

### Globale (recommandé — disponible dans tous vos projets)

```bash
# Depuis la racine du dépôt cloné
./install.sh
# ou manuellement :
cp -r skills/* ~/.claude/skills/
```

### Par projet (versionné avec le repo applicatif)

```bash
cp -r skills/flo-nextjs skills/flo-supabase /chemin/projet/.claude/skills/
```

Claude Code charge automatiquement tout dossier contenant un `SKILL.md` valide.

---

## 🔌 Activation par type de projet

| Type de projet | Skills à installer |
|----------------|--------------------|
| Next.js SaaS | `dev-standards` + `nextjs` + `supabase` + `ui` + `seo` |
| App médicale (PatientHub) | **tous** (medical obligatoire) |
| Vite/React offline | `dev-standards` + `ui` + `offline` |
| Landing / site vitrine | `dev-standards` + `nextjs` + `ui` + `seo` |

`flo-dev-standards` est **toujours** présent : c'est le socle.

---

## ➕ Ajouter un skill sans rien casser

1. Crée `skills/flo-<domaine>/SKILL.md` avec frontmatter `name` + `description`.
2. Définis un **périmètre disjoint** : si une règle existe déjà ailleurs, renvoie-y au lieu de la recopier.
3. Place le skill dans la **hiérarchie d'autorité** (`ARCHITECTURE.md` → tableau de priorité).
4. Ajoute une ligne dans la **matrice de responsabilités** et dans la table ci-dessus.
5. Déclare ses **interactions** (qui il consulte / à qui il délègue).

Règle d'or : **un nouveau skill ne duplique jamais une responsabilité existante** — il la complète ou la spécialise.

---

## 🗺️ Documents de référence

- **[`ARCHITECTURE.md`](./ARCHITECTURE.md)** — matrice de responsabilités, interdictions, interactions, résolution de conflits.
- `skills/*/SKILL.md` — règles détaillées par domaine.
