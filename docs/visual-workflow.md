# Workflow visuel — prototype Lovable → Next.js fidèle

> Décisions et justification : [ADR 0002](../knowledge/adr/0002-outils-design-tiers-et-fidelite-visuelle.md).
> Règles appliquées : `flo-ui`, `design-taste`, `playwright` (≥ 2.1.0). Ce document ne les recopie pas.

## 1. Installation (une fois, sur ta machine)

```bash
# Playwright MCP — portée user, version épinglée, profil navigateur jetable
claude mcp add --scope user playwright -- npx @playwright/mcp@0.0.83 --isolated

# Emil Kowalski — 3 skills, commit épinglé, en symlink (n'écrase rien, retirable)
git clone https://github.com/emilkowalski/skills.git ~/.claude/vendor/emilkowalski-skills
git -C ~/.claude/vendor/emilkowalski-skills checkout 2d228630ba1446365f614a108cb8252f1feda202
for s in review-animations improve-animations animation-performance; do
  [ -e ~/.claude/skills/$s ] || ln -s ~/.claude/vendor/emilkowalski-skills/skills/$s ~/.claude/skills/$s
done
```

Redémarre Claude Code, puis `/mcp` doit lister `playwright` connecté.

**Figma — seulement si le projet a un fichier Figma** (doc officielle Figma) :
`claude plugin install figma@claude-plugins-official`, ou
`claude mcp add --transport http figma https://mcp.figma.com/mcp`, puis `/mcp` → *Authenticate*.

**Retrait** : `claude mcp remove playwright -s user` · `rm ~/.claude/skills/{review-animations,improve-animations,animation-performance}`.

## 2. Boucle de fidélité (par projet)

| # | Étape | Outil |
|---|---|---|
| 1 | Lancer la **référence** Lovable (`npm run dev`, noter son URL) | — |
| 2 | Extraire tokens, polices, animations, comportements de la référence | `flo-ui` (portage à l'identique) |
| 3 | Capturer les baselines de la référence | kit `visual-fidelity` |
| 4 | Implémenter en Next.js | `flo-nextjs` + `flo-ui` |
| 5 | Lancer la cible (`pnpm dev` ou `pnpm build && pnpm start`) | — |
| 6 | Explorer : hover, menus, ancres, CTA flottants, console | Playwright MCP |
| 7 | Comparer cible ↔ référence, 3 viewports | kit `visual-fidelity` |
| 8 | Corriger les écarts, relancer 6–7 | `flo-ui` |
| 9 | Revue du mouvement (optionnel) | `/review-animations` |
| 10 | Critique finale, référence prioritaire | `design-taste` |

### Kit `tools/visual-fidelity/`

```bash
cp -r <flo-code-skills>/tools/visual-fidelity e2e/visual-fidelity
pnpm add -D @playwright/test && pnpm exec playwright install chromium
export FIDELITY_ROUTES="/,/services,/contact"   # routes communes aux deux apps
export FIDELITY_MASK="[data-dynamic]"           # optionnel, IDENTIQUE dans les deux passes

FIDELITY_URL=http://localhost:8080 pnpm exec playwright test -c e2e/visual-fidelity --update-snapshots=all  # référence
FIDELITY_URL=http://localhost:3000 pnpm exec playwright test -c e2e/visual-fidelity                         # cible
pnpm exec playwright show-report e2e/visual-fidelity/report    # images attendu / obtenu / diff
```

Viewports : 390×844, 768×1024, 1440×900. Seuil : `FIDELITY_MAX_DIFF_PIXELS` (défaut 100).
Le port 8080 est un exemple : utilise l'URL réellement affichée par la référence.

**Limites connues** : contenu aléatoire, dates ou carrousels auto → à masquer ; une différence de
hauteur de page échoue d'emblée (c'est un écart réel) ; les états hover/ouvert ne sont pas capturés
par le kit (→ MCP pour l'exploration, test E2E dédié s'ils doivent être garantis).

## 3. Consigne réutilisable

```text
Porte le prototype Lovable de <chemin/URL> vers ce projet Next.js, page <route>.
Référence = autorité visuelle : reproduis typo, couleurs, espacements, images, liens, hero,
CTA flottants, badges, hover, transitions, animations et footer — sans simplifier ni « améliorer ».
1. Lance la référence, capture les baselines avec tools/visual-fidelity (routes : <routes>).
2. Implémente (flo-nextjs, flo-ui : tokens de la référence repris à l'identique).
3. Lance l'app, explore avec Playwright MCP : hover, menus, liens, CTA, erreurs console.
4. Compare avec le kit aux 3 viewports, corrige, relance jusqu'au vert ou blocage justifié.
5. Rapporte : commandes exécutées, résultats réels par viewport, écarts restants avec capture de diff.
   Ne déclare aucune conformité visuelle sans baseline de référence capturée.
Propose les améliorations esthétiques à part, sans les appliquer.
```
