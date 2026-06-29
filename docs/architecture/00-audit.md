# 0 — Audit du dépôt actuel

> Point de départ. On ne propose une cible (doc 01) qu'après avoir compris **ce qui existe déjà**,
> **ce qui est solide** (donc à conserver) et **ce qui contraint** la restructuration.

---

## 0.1 État des lieux

Le dépôt est aujourd'hui **mono-finalité** : un système de **skills Claude Code**. Structure réelle :

```
flo-code-skills/
├── skills/                      # 12 skills, 1 dossier chacun
│   └── flo-*/                    #   ├── SKILL.md      (frontmatter: name, version, owns, excludes…)
│       ├── SKILL.md             #   └── CHANGELOG.md  (historique par skill)
│       └── CHANGELOG.md
├── tools/
│   ├── check-overlaps.ts        # CI : aucune responsabilité (`owns`) dupliquée + SemVer présent
│   └── skills-sync.sh           # distribution : clone unique + symlinks vers ~/.claude/skills
├── docs/                        # skill-boundaries, VERSIONING, scorecard, MATURITY, AUDIT-PHASE2…
├── examples/CLAUDE.md           # mémoire minimale d'utilisation des skills
├── .github/workflows/
│   └── check-overlaps.yml       # CI déclenchée sur tout PR touchant un SKILL.md
├── install.sh / install.ps1     # installation par copie (macOS/Linux/Windows)
├── bootstrap.sh                 # installation recommandée (clone + symlinks + hook SessionStart)
├── ARCHITECTURE.md / README.md / README.fr.md / CHANGELOG.md / LICENSE
└── package.json                 # private, 1 script: check:overlaps ; type: module
```

Les 12 skills : `flo-project-audit`, `flo-debug`, `flo-dev-standards`, `flo-medical`, `flo-nextjs`,
`flo-supabase`, `flo-offline`, `flo-seo`, `frontend-design`, `flo-ui`, `design-taste`, `playwright`.

---

## 0.2 Forces à préserver

Ces acquis sont la **raison d'être** du dépôt. La restructuration doit les conserver intacts.

| Force | Détail | Conséquence pour la cible |
|-------|--------|---------------------------|
| **Modèle « une responsabilité, un propriétaire »** | Chaque token `owns` est unique, vérifié par `check-overlaps.ts` en CI | À **généraliser** : même discipline anti-duplication entre packages |
| **Hiérarchie d'autorité explicite** | `medical > supabase > dev-standards > nextjs > … > playwright` | Reste la grille de résolution de conflits, y compris pour le code |
| **Versioning SemVer par skill + politique non cassante** | `docs/VERSIONING.md` : additif → dépréciation → MAJOR | **Fondation directe** de la stratégie de versioning packages (doc 05) |
| **Distribution par symlinks non bloquante** | `skills-sync.sh` : un `git pull` met à jour tous les projets ; jamais de session cassée | Dépend du chemin `skills/` → **contrainte dure** (voir 0.4) |
| **Frontière « règle » claire** | Les skills décrivent *quoi/pourquoi*, jamais de code framework | Devient la ligne de partage skills ⇄ packages (doc 06) |
| **Documentation déjà structurée** | boundaries, scorecard, versioning, maturité | `docs/` accueille naturellement le dossier d'architecture et les guides |

---

## 0.3 Manques au regard de l'objectif « source de vérité unique »

Rien de cassé ; ce sont des **absences** par rapport à la nouvelle ambition.

- **Aucun code exécutable partagé** : pas de package de tokens, de config TS/ESLint, de helpers
  Supabase/SEO. Aujourd'hui les skills *décrivent* les règles ; rien ne les *matérialise*.
- **Pas de gestion multi-packages** : `package.json` unique, `private`, sans workspaces ni build.
- **Pas de boilerplate ni de templates** : aucun *golden path* applicatif réutilisable.
- **Pas de CLI** : le scaffolding d'un nouveau projet est manuel.
- **Versioning pensé pour des skills (fichiers copiés)**, pas pour des packages publiés/consommés
  via un gestionnaire de dépendances.
- **CI minimale** : un seul job (overlaps). Aucun lint/build/test transverse.

---

## 0.4 Contraintes dures (à ne pas violer pendant la restructuration)

1. **`skills/` doit rester à la racine.** `tools/skills-sync.sh` et `install.sh` résolvent
   `"$REPO/skills/*/SKILL.md"`. Déplacer ce dossier casserait **toutes les installations existantes**.
   → La cible garde `skills/` **exactement où il est**.
2. **`SKILL.md` reste le format canonique** (frontmatter `owns/excludes`) — la CI `check-overlaps`
   et la découverte par Claude Code en dépendent.
3. **`bootstrap.sh` / `install.sh` / `.github/workflows/check-overlaps.yml`** continuent de fonctionner
   à l'identique tant qu'ils ne sont pas explicitement migrés (et seulement de façon rétro-compatible).
4. **Mono-dépôt impératif** : pas d'éclatement en plusieurs repos (exigence produit = zéro duplication).
5. **Compatibilité Windows** : `install.ps1` existe ; tout choix d'outillage doit rester multi-OS.

---

## 0.5 Verdict

Le dépôt est une **excellente fondation** : la discipline (propriété unique, autorité, versioning,
anti-duplication vérifiée en CI) est déjà la culture qu'exige un monorepo d'écosystème. Il ne s'agit
donc **pas de refondre** mais d'**étendre** : ajouter des espaces (`packages/`, `templates/`, `apps/`,
`cli/`) à côté de `skills/`, en réappliquant aux *packages de code* la rigueur déjà prouvée sur les
*skills*. Les contraintes 0.4 cadrent toute la Phase 1 (doc 04).
