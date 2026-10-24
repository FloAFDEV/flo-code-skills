# Workflow visuel — reproduction, adaptation, création

> Décisions et justification : [ADR 0002](../knowledge/adr/0002-outils-design-tiers-et-fidelite-visuelle.md).
> Modes et priorité des décisions visuelles : [`skill-boundaries.md`](./skill-boundaries.md#décisions-visuelles--mode-sources-et-priorité)
> (source de vérité). Règles appliquées : `flo-ui`, `design-taste`, `playwright` (≥ 2.1.0).

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

## 2. Choisir le mode selon la référence disponible

| Situation | Mode | Référence | Mesure |
|---|---|---|---|
| Prototype Lovable disponible | REPRODUCTION | le prototype (rendu + comportement) | kit `visual-fidelity` |
| Maquette Figma exploitable | REPRODUCTION (ou ADAPTATION) | Figma, source principale — Figma MCP | captures côte à côte, sans score |
| Site existant à reproduire / refondre | REPRODUCTION ou ADAPTATION | rendu, comportement et contraintes du site | kit (si le site tourne) + Playwright MCP pour les états interactifs |
| Captures, images, PDF fournis | REPRODUCTION ou ADAPTATION | ces fichiers | captures côte à côte, sans score |
| Aucune référence | CRÉATION | aucune | pas de baseline : captures + contrôles fonctionnels |
| Nouvelle direction artistique demandée | CRÉATION | le brief (une référence éventuelle n'est qu'une inspiration) | idem |

ADAPTATION = la référence donne l'intention et le langage visuel ; les écarts sont délibérés et listés.
En CRÉATION, `design-taste`, `flo-ui` et les recommandations d'Emil **définissent** la direction au lieu
de la reproduire — on n'invente jamais une référence pour avoir quelque chose à mesurer.

## 3. Boucle de validation (par projet)

| # | Étape | Outil |
|---|---|---|
| 1 | Établir le **mode** et les **sources** de référence (tableau ci-dessus) | — |
| 2 | REPRODUCTION/ADAPTATION : extraire tokens, polices, animations, comportements de la référence · CRÉATION : définir la direction à partir du brief | `flo-ui` · `design-taste` |
| 3 | Référence exécutable : capturer ses baselines | kit `visual-fidelity` |
| 4 | Implémenter | `flo-nextjs` + `flo-ui` |
| 5 | Lancer la cible (`pnpm dev` ou `pnpm build && pnpm start`) | — |
| 6 | Explorer : hover, menus, ancres, CTA flottants, console | Playwright MCP |
| 7 | Mesurer : kit (référence exécutable), côte à côte (référence statique), aucune mesure de conformité en CRÉATION | kit / captures |
| 8 | Corriger les écarts, relancer 6–7 | `flo-ui` |
| 9 | Revue du mouvement (optionnel) | `/review-animations` |
| 10 | Critique finale selon le mode | `design-taste` |

### Kit `tools/visual-fidelity/`

```bash
cp -r <flo-code-skills>/tools/visual-fidelity e2e/visual-fidelity
pnpm add -D @playwright/test && pnpm exec playwright install chromium
export FIDELITY_ROUTES="/,/services,/contact"   # routes communes aux deux apps
export FIDELITY_MASK="[data-dynamic]"           # optionnel, IDENTIQUE dans les deux passes

# passe référence : mode et source obligatoires, enregistrés dans __reference__/source.json
FIDELITY_MODE=reproduction FIDELITY_REFERENCE="prototype Lovable" \
FIDELITY_URL=http://localhost:8080 pnpm exec playwright test -c e2e/visual-fidelity --update-snapshots=all
# passe cible : échoue s'il n'existe pas de baseline de référence (aucune n'est créée implicitement)
FIDELITY_URL=http://localhost:3000 pnpm exec playwright test -c e2e/visual-fidelity
pnpm exec playwright show-report e2e/visual-fidelity/report    # images attendu / obtenu / diff
```

Viewports : 390×844, 768×1024, 1440×900. Seuil : `FIDELITY_MAX_DIFF_PIXELS` (défaut 100).
Le port 8080 est un exemple : utilise l'URL réellement affichée par la référence.

Le rapport HTML annote chaque test avec le mode, la source et l'URL de référence.
`FIDELITY_MODE=creation` est refusé : en CRÉATION il n'y a rien à comparer.

**Limites connues** : référence exécutable uniquement (Figma, captures, PDF → comparaison côte à côte) ; contenu aléatoire, dates ou carrousels auto → à masquer ; une différence de
hauteur de page échoue d'emblée (c'est un écart réel) ; les états hover/ouvert ne sont pas capturés
par le kit (→ MCP pour l'exploration, test E2E dédié s'ils doivent être garantis).

## 4. Consigne réutilisable

```text
Page <route> de ce projet Next.js.
Mode : <REPRODUCTION | ADAPTATION | CRÉATION>. Référence(s) : <Figma <lien> | prototype Lovable <URL> |
site existant <URL> | captures/PDF <chemins> | aucune>. Contraintes : <brief, marque, contenu, a11y, SEO>.
Priorité : contraintes du projet > référence > conventions flo-ui > recommandations animation > goût générique.
1. Confirme le mode et les sources avant de coder.
2. REPRODUCTION : reproduis typo, couleurs, espacements, images, liens, hero, CTA flottants, badges,
   hover, transitions, animations et footer, sans simplifier. ADAPTATION : reprends l'intention et le
   langage visuel, liste chaque écart délibéré. CRÉATION : propose une direction cohérente avec le brief.
3. Référence exécutable : capture les baselines avec tools/visual-fidelity (FIDELITY_MODE, FIDELITY_REFERENCE).
4. Implémente (flo-nextjs, flo-ui), lance l'app, explore avec Playwright MCP : hover, menus, liens, CTA, console.
5. Mesure selon la référence (kit, côte à côte, ou rien en CRÉATION), corrige, relance.
6. Rapporte : mode, sources, commandes exécutées, résultats réels par viewport, écarts restants.
   Aucune conformité déclarée sans référence mesurée ; améliorations esthétiques proposées à part.
```
