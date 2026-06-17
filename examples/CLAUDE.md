<!--
  Exemple minimal de ~/.claude/CLAUDE.md
  -------------------------------------
  Copier vers ~/.claude/CLAUDE.md (global) ou <projet>/.claude/CLAUDE.md (par projet).
  Ce fichier dit à Claude COMMENT utiliser les skills flo-code — il ne RECOPIE jamais leurs règles
  (elles vivent dans chaque skills/<skill>/SKILL.md). Garde-le court : c'est de la mémoire permanente.
-->

# Préférences de travail

J'utilise le système **flo-code-skills** (installé dans `~/.claude/skills/`). Les règles détaillées
vivent dans chaque `SKILL.md` — **ne les redécris pas ici**, invoque le skill concerné.

## Pipeline par défaut
Pour toute feature UI : **frontend-design → flo-ui → playwright → design-taste** avant validation.
`flo-dev-standards` s'applique à tout le code ; `flo-medical` dès qu'il y a des données de santé.

## Quand activer quoi (rappel — détail dans les SKILL.md)
- Concevoir un écran / parcours → **frontend-design**
- Coder un composant / style → **flo-ui**
- App Router, rendu, perf Next → **flo-nextjs**
- RLS, Edge, auth, accès données → **flo-supabase**
- Offline / IndexedDB / synchro → **flo-offline**
- Metadata, OG, JSON-LD, sitemap → **flo-seo**
- Bug / stack trace / perf à diagnostiquer → **flo-debug**
- Auditer un projet / prioriser / orchestrer → **flo-project-audit**
- Critique visuelle / anti-« rendu IA » → **design-taste**
- Tests E2E / régressions → **playwright**

## En cas de conflit entre skills
Suivre la hiérarchie d'autorité :
`medical > supabase > dev-standards > nextjs > offline > frontend-design > ui > seo > design-taste > playwright`.
(`flo-project-audit` et `flo-debug` ne tranchent pas : ils orchestrent / diagnostiquent.)

## Exigence produit
Interfaces sobres et crédibles, niveau Linear / Stripe / Notion / Vercel. Zéro rendu générique « IA ».

<!-- Ajoute ici tes préférences personnelles (langue, ton, conventions du projet courant). -->
