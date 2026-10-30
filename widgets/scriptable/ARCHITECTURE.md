# Widgets iOS Scriptable — Claude Usage & Flo Dashboard

> **Statut : PHASE 2 — PROPOSITION À VALIDER. Aucun code n'est écrit tant que ce document n'est pas validé.**
> Skills appliqués : `flo-dev-standards` (architecture, erreurs, secrets) · `flo-ui` (tokens, états, a11y).

---

## 0. Décision clé à valider en premier : l'option A est déconseillée

Vérifications faites (sources en §10) :

| Question | Constat | Conséquence |
|---|---|---|
| **Conformité** | Depuis le 19/02/2026, la doc *Legal & compliance* de Claude Code précise que les jetons OAuth des offres Free/Pro/Max sont réservés à Claude Code et Claude.ai ; leur usage dans un autre outil est contraire aux conditions. Un script Scriptable qui appelle `/api/oauth/usage` avec ce jeton **est** un autre outil, même en lecture seule. | **Bloquant.** Risque de sanction du compte Max. Contraire à la règle « aucun contournement ». |
| **Lecture sans renouvellement** | Le jeton d'accès copié depuis le Keychain macOS (`Claude Code-credentials`) expire en quelques heures. Sans renouvellement, le widget cesse de fonctionner peu après l'extinction de l'iMac. | L'objectif « iMac éteint » n'est **pas** atteint sans renouvellement. |
| **Renouvellement depuis l'iPhone** | Le refresh token est à rotation : un renouvellement côté iPhone invalide très probablement celui de l'iMac → **déconnexion de Claude Code** sur l'iMac. | Contraire à « ne modifier aucune configuration d'authentification ». |
| **Jeton dédié `claude setup-token`** | Durée longue, mais scope `user:inference` seul. Plusieurs rapports : `403` sur l'endpoint usage (scope `user:profile` requis). Demande de scope « usage en lecture » encore ouverte. | Inutilisable aujourd'hui (à revérifier si Anthropic ajoute un scope dédié). |
| **Claude Desktop** | Authentification de session claude.ai distincte ; non touchée par une simple lecture. Le risque porte sur Claude Code. | — |
| **Stabilité de l'API** | Endpoint non documenté, format déjà modifié (champs plats `seven_day_*` vs tableau `limits`). | Fragile. |

**Recommandation : option C', une variante officielle de l'option C.**
Claude Code fournit lui-même `rate_limits.five_hour` / `rate_limits.seven_day` (`used_percentage`, `resets_at`) au script de **status line** (fonction documentée, abonnés Pro/Max). Sur l'iMac, un petit script de status line écrit ces valeurs dans un JSON sur iCloud Drive, que Scriptable lit.

- Aucun jeton ne quitte Claude Code, aucun appel API supplémentaire, aucune modification d'authentification.
- **Limite assumée :** les données ne sont fraîches que pendant l'utilisation de Claude Code sur l'iMac. iMac éteint → le widget affiche la dernière valeur connue, son âge, et l'état « fenêtre réinitialisée » une fois `resets_at` passé (sans inventer 0 % : l'usage claude.ai mobile compte aussi).
- Un appui sur le widget ouvre `https://claude.ai/settings/usage` pour la valeur en direct (source officielle, sur l'iPhone).
- À vérifier en P1 : présence de `rate_limits` dans votre version de Claude Code (des versions ont été signalées sans ce champ), format de `resets_at` (epoch ou ISO 8601), comportement de la status line dans l'onglet Code de Claude Desktop.
- Le seul changement côté iMac est l'ajout d'une entrée `statusLine` dans `~/.claude/settings.json` — **pas** une config d'auth, mais soumis à votre accord ; si une status line existe déjà, elle est chaînée, pas remplacée.

> Rien n'est garanti tant que P1-a (§8) n'a pas confirmé le champ sur votre machine.

---

## 1. Contraintes réelles de Scriptable / iOS

| Contrainte | Détail | Impact sur la conception |
|---|---|---|
| Rafraîchissement | Décidé par iOS (budget quotidien, batterie, fréquence de consultation). `refreshAfterDate` = date **minimale**, jamais garantie. En pratique ≥ 15 min. | Pas de temps réel. TTL de cache ≥ intervalle réel. |
| Compteurs vivants | `widget.addDate()` + `applyTimerStyle()` / `applyRelativeStyle()` se mettent à jour **sans** exécution du script. | « Réinit. dans 1 h 52 » et « Bus dans 4 min » restent exacts entre deux rafraîchissements. |
| Mémoire | Plafond strict de l'extension widget (~30 Mo, non documenté précisément) ; dépassement = widget vide. | Images `DrawContext` petites, pas de `Contact.all()` dans le widget, payloads réduits. |
| Temps d'exécution | Non documenté, quelques secondes à dizaines de secondes. | Appels en parallèle (`Promise.all`), `timeoutInterval` court, budget global. |
| Interaction | Appui = ouverture d'URL. Petit widget : **une seule** zone. Moyen/grand : une URL par `WidgetStack`. Pas de boutons interactifs iOS 17 dans Scriptable. | Navigation via `scriptable:///run/Flo%20Dashboard?section=github`. Toute interaction riche se fait **dans l'app**. |
| Vues dans l'app | `UITable`, `Alert`, `WebView`, `QuickLook`, `ShareSheet`, `DocumentPicker`. | Écrans de détail par module en `UITable`. |
| Modules | `importModule('flo/core/cache')` ; seuls les `.js` à la racine apparaissent comme scripts. | Points d'entrée à la racine, bibliothèque dans `flo/`. |
| Stockage | `Keychain` (secrets), `FileManager.local()` (cache privé), `FileManager.iCloud()` (+ `downloadFileFromiCloud` obligatoire). | Cache et données perso en **local**, jamais iCloud. |
| Permissions | Calendrier, Rappels, Contacts : demandées **dans l'app** au premier lancement, impossible depuis le widget. | Script `Flo Réglages` qui déclenche les autorisations. |
| Rendu | `SFSymbol`, polices système arrondies/monospace, `Color`. Mode « teinté » iOS 18 : rendu monochrome non contrôlable. | Information jamais portée par la seule couleur. |
| Langage | JavaScriptCore (ES moderne, `await` top-level), pas de npm ni TypeScript. | Validation runtime manuelle, JSDoc pour le typage. |

---

## 2. Arborescence

Côté dépôt (source de vérité) :

```
widgets/scriptable/
├── ARCHITECTURE.md                  ← ce document
├── src/                             ← copié tel quel dans iCloud Drive/Scriptable/
│   ├── Claude Usage.js              entrée widget 1
│   ├── Flo Dashboard.js             entrée widget 2 + navigation dans l'app
│   ├── Flo Réglages.js              secrets Keychain, permissions, tests de connexion, purge du cache
│   ├── Flo Config.example.js        modèle de configuration (copié en « Flo Config.js » une seule fois)
│   └── flo/
│       ├── core/
│       │   ├── result.js            ok()/err() — pas de throw pour l'attendu
│       │   ├── http.js              Request + timeout + JSON + mapping d'erreurs (401/403/429/5xx/réseau)
│       │   ├── cache.js             TTL, « stale-if-error », horodatage
│       │   ├── secrets.js           Keychain namespacé `flo.*`, jamais journalisé
│       │   ├── log.js               journal local tournant, masquage automatique
│       │   ├── config.js            charge Flo Config.js, valide, applique les défauts
│       │   ├── time.js              formats fr-FR, relatif, fuseau Europe/Paris
│       │   ├── router.js            args.queryParameters → section
│       │   └── runner.js            orchestre les modules actifs, budget de temps global
│       ├── ui/
│       │   ├── themes/claude.js     tokens identité « Claude Usage » (§5.1)
│       │   ├── themes/afdev.js      tokens identité AFDEV (§5.2)
│       │   ├── assets/afdev-mark.js monogramme AFDEV (PNG base64, généré depuis le SVG du site)
│       │   ├── components.js        carte, en-tête, ligne, pastille d'état, état vide/erreur/périmé
│       │   ├── gauge.js             anneau et barre (DrawContext)
│       │   └── table.js             helpers UITable (vues de détail)
│       ├── modules/
│       │   ├── claude-usage/        source-icloud.js · model.js · view.js
│       │   ├── sites/               (AFDEV)
│       │   ├── deployments/         providers/github-deployments.js · providers/vercel-api.js
│       │   ├── github/
│       │   ├── analytics/           providers/umami-cloud.js · providers/umami-self.js
│       │   ├── tisseo/
│       │   ├── weather/             (Moto Météo)
│       │   └── family/
│       └── tools/                   url-check · redirects · clipboard · image · csv · pdf
└── mac/
    ├── statusline-sync.sh           status line Claude Code → claude-usage.json (iCloud)
    └── sync-to-icloud.sh            déploie src/ vers iCloud Drive/Scriptable
```

Côté iCloud Drive :

```
iCloud Drive/Scriptable/
├── Claude Usage.js · Flo Dashboard.js · Flo Réglages.js · Flo Config.js (le vôtre, jamais écrasé)
├── flo/…                            bibliothèque (écrasée à chaque mise à jour)
└── flo-data/claude-usage.json       écrit par l'iMac, lu par l'iPhone
```

Cache et journal : `FileManager.local()/flo-cache/` et `flo-log/` (sur l'iPhone uniquement).

---

## 3. Responsabilités et contrat de module

Flux : **point d'entrée → runner → modules → core (http/cache/secrets) → API**. L'UI ne fait aucun appel réseau.

Contrat commun (JSDoc) :

```js
/** @typedef {{ status: 'ok'|'warn'|'error'|'stale'|'setup', headline: string, detail?: string }} Summary */
module.exports = {
  id: 'github', title: 'GitHub', symbol: 'chevron.left.forwardslash.chevron.right', accent: 'violet',
  ttlMinutes: 15,
  requires: { secrets: ['github.token'], permissions: [] },
  fetch: async (ctx) => /* Result<Data> */,
  summarize: (data) => /* Summary — tuile du widget moyen */,
  renderCard: (stack, data, ctx) => {},   // section du grand widget
  renderDetail: (table, data, ctx) => {}, // vue complète dans l'app
}
```

Le runner : ne charge que les modules `enabled`, sert le cache s'il est frais, appelle `fetch` en parallèle avec un budget global (~15 s), isole chaque échec (un module en erreur n'empêche jamais le rendu des autres), retombe sur la dernière donnée valide marquée « périmée ».

| Module | Source | Auth | TTL | Responsabilité |
|---|---|---|---|---|
| Claude Usage | `flo-data/claude-usage.json` (iCloud) | aucune | 5 min (lecture fichier) | Quotas 5 h / 7 j, réinitialisations, âge de la donnée |
| Sites (AFDEV) | `GET` direct des 4 domaines | aucune | 10 min | Code HTTP, temps de réponse, dernière vérif, lien |
| Déploiements | **Par défaut** : API GitHub *Deployments* (Vercel y publie ses statuts) · Option : API Vercel `v6/deployments` | PAT GitHub lecture seule · ou jeton Vercel | 15 min | Derniers déploiements, statut, projet, date |
| GitHub | API GraphQL (une requête pour tous les dépôts favoris) | PAT *fine-grained* lecture seule | 15 min | Derniers commits, PR ouvertes, activité |
| Analytics | Interface `provider` : Umami Cloud (`x-umami-api-key`), Umami auto-hébergé | clé API / compte lecture seule | 30 min | Visiteurs 7 j, évolution vs 7 j précédents, par site |
| Tisséo | API `api.tisseo.fr/v2` (`stops_schedules`, `messages`) | clé (gratuite, sur demande à opendata@tisseo.fr) | 2 min (app) / au rafraîchissement (widget) | Arrêts favoris, prochains passages, perturbations des lignes suivies |
| Moto Météo | Open-Meteo (gratuit, sans clé) | aucune | 30 min | Temp., pluie %, vent/rafales aux heures aller/retour, verdict |
| Famille | `CalendarEvent`, `Reminder`, calendrier « Anniversaires » | permissions iOS | 15 min | Prochains événements, rappels du jour, anniversaires — **100 % local** |
| Outils | Scripts lancés depuis l'app | — | — | Voir §3.1 |

**Verdict moto** (seuils configurables, affichés en clair) : favorable si pluie < 30 %, rafales < 50 km/h, température > 5 °C aux deux créneaux ; « mitigé » si un seul critère est limite ; « défavorable » sinon. Coordonnées arrondies à 2 décimales avant envoi.

**Analytics** : un provider = `{ id, fetchStats(site, range) → Result<{visitors, previous}> }`. Ajouter Plausible ou autre = un fichier, aucun autre changement. Désactivable par `enabled: false`.

### 3.1 Outils

| Outil | Mise en œuvre | Limite identifiée |
|---|---|---|
| Vérification d'URL | `Request` : code, temps, en-têtes clés, TLS via HTTPS | — |
| Analyse des redirections | `Request.onRedirect` pour capturer chaque saut | — |
| Nettoyage du presse-papiers | `Pasteboard` : suppression `utm_*`, `fbclid`, `gclid`, espaces | — |
| Compression d'images | `Photos.fromLibrary` → redimensionnement `DrawContext` → `Data.fromJPEG` | Qualité JPEG non réglable (à confirmer) : compression par dimensions |
| Export CSV | Données du cache → `DocumentPicker.exportString` | — |
| Génération de PDF | HTML → Raccourci iOS « Créer un PDF » via `shortcuts://` | Scriptable n'a pas d'API PDF native : nécessite un Raccourci (gratuit, intégré) |

---

## 4. Maquettes textuelles

Gabarits iPhone (pt, varient selon le modèle) : petit ≈ 170 × 170 · moyen ≈ 364 × 170 · grand ≈ 364 × 382. Marge intérieure 16 pt partout.
Légende : `━` remplissage de jauge · `─` piste · `[ … ]` badge pilule · `⏱` compteur vivant (`addDate`, mis à jour par iOS sans rafraîchissement).

### 4.1 Claude Usage — petit · identité §5.1 · appui → claude.ai/settings/usage

```
╭──────────────────────────╮
│ ✦ Claude                 │  glyphe neutre terracotta 12 pt + « Claude » sans 13 semibold, crème
│                          │
│ 62 %                     │  serif 34, crème
│ Session · 5 h            │  sans 12, gris chaud
│ ━━━━━━━━━━━━─────────    │  barre 4 pt, rayon 2, terracotta sur piste
│                          │
│ Réinit. 16:40            │  sans 12, gris chaud
│ dans 1 h 52 ⏱            │  sans 13 medium, crème
╰──────────────────────────╯
```

### 4.2 Claude Usage — moyen · identité §5.1

Barres horizontales empilées, comme la page d'usage de claude.ai : même lecture, rien d'inventé.

```
╭────────────────────────────────────────────────╮
│ ✦ Claude · usage                  Synchro 08:06 │  synchro : sans 11, gris chaud
│                                                │
│ Session · 5 h                            62 %  │  libellé sans 13 · valeur serif 22
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━──────────────────  │
│ Réinit. 16:40 · dans 1 h 52 ⏱                  │  sans 12, gris chaud
│                                                │
│ Semaine · 7 j                            38 %  │
│ ━━━━━━━━━━━━━━━━━──────────────────────────────  │
│ Réinit. lun. 3 nov. · 09:00                    │
╰────────────────────────────────────────────────╯
```

États (même gabarit, jamais signalés par la seule couleur) :

| État | Rendu |
|---|---|
| ≥ 80 % | libellé « Limite proche » à droite du titre de la ligne, barre inchangée |
| 100 % | « Limite atteinte », barre pleine, compteur jusqu'à la réinitialisation |
| Périmé (> 1 h) | barres à 40 % d'opacité, « Synchro il y a 9 h » |
| Fenêtre réinitialisée | barre vide en pointillés, « Réinitialisée — en attente de synchro » |
| Aucune donnée | « Ouvrez Claude Code sur l'iMac pour synchroniser » |

### 4.3 Flo Dashboard — moyen · identité §5.2 · chaque tuile → sa rubrique

```
╭────────────────────────────────────────────────╮
│ ▲ AFDEV              DASHBOARD   JEU 30 · 08:12 │  monogramme 14 pt · surtitres mono 9 MAJ. espacées
│ ┌─────────────────────┐ ┌─────────────────────┐ │
│ │ SITES        [ OK ] │ │ DÉPLOIEMENTS [READY]│ │  surtitre mono 9 gris · badge pilule bordé
│ │ 4/4                 │ │ lylusio             │ │  valeur sans 20 bold, crème
│ │ en ligne · 240 ms   │ │ il y a 2 h          │ │  sans 11, gris
│ └─────────────────────┘ └─────────────────────┘ │
│ ┌─────────────────────┐ ┌─────────────────────┐ │
│ │ MOTO        [ ✓ GO ]│ │ AGENDA         10:00│ │
│ │ 14° · pluie 10 %    │ │ RDV client          │ │
│ │ rafales 25 km/h     │ │ + 2 rappels         │ │
│ └─────────────────────┘ └─────────────────────┘ │
╰────────────────────────────────────────────────╯
```

Priorité : une tuile en erreur/alerte (site hors ligne, build en échec) remplace la tuile la moins prioritaire et passe en premier.

### 4.4 Flo Dashboard — grand · identité §5.2

```
╭────────────────────────────────────────────────╮
│ ▲ AFDEV              DASHBOARD   JEU 30 · 08:12 │
│                                                │
│ SITES ─────────────────────────────── 3/4 ⚠    │  surtitre ambre si alerte, sinon gris
│ ● afdev.fr               200   180 ms          │  domaine sans 12 · code/ms mono 11
│ ● lylusio.fr             200   210 ms          │
│ ● aurelia-desvaux.fr     200   260 ms          │
│ ✕ garagemendonca.com     503   —     [ DOWN ]  │
│                                                │
│ DÉPLOIEMENTS · GITHUB ─────────────────────── │
│ ✓ lylusio     [ READY ]          il y a 2 h    │
│ ⟳ afdev       [ BUILD ]          il y a 4 min  │
│ 3 PR ouvertes · dernier commit il y a 40 min   │
│                                                │
│ MOTO ──────────────────────────── [ ✓ GO ]     │
│ 08:00   12°   pluie 10 %   rafales 25 km/h     │  colonnes mono 11 alignées
│ 18:30   17°   pluie 20 %   rafales 30 km/h     │
│                                                │
│ AGENDA ────────────────  TISSÉO ────────────── │
│ 10:00 RDV client         L1 Arènes  4 min ⏱    │
│ Sam. Anniv. Léa          ⚠ Ligne A perturbée   │
╰────────────────────────────────────────────────╯
```

Analytics : remplace « Agenda » si Famille est désactivé, sinon visible dans l'app (sparkline 7 j par site).

### 4.5 Dans l'app

`Flo Dashboard` sans paramètre → menu `UITable` : rubriques (avec pastille d'état) + Outils + Réglages. Avec `?section=x` → vue de détail du module, bouton « Actualiser », liens directs (site, déploiement, PR).

---

## 5. Identités visuelles

Deux identités **séparées**, chacune dans son fichier de tokens : aucune valeur en dur hors de `ui/themes/*.js` (règle `flo-ui`). Les composants (`card`, `bar`, `badge`, `row`) sont communs et prennent le thème en paramètre : même code, deux identités. Partout : pas d'ombre, pas de lueur, pas de dégradé décoratif ; chaque état porte une icône **et** un libellé.

### 5.1 Claude Usage — inspirée de Claude, sans se présenter comme officielle

**Logo officiel : je ne l'intègre pas.** D'après les [Trademark Guidelines d'Anthropic](https://www.anthropic.com/legal/trademark-guidelines), les marques (noms, logos, éléments de marque) ne peuvent être utilisées qu'avec leur accord préalable, sans aucune modification de couleur ni de proportion, et sans laisser croire à un partenariat. Le guide ne prévoit pas d'exception pour un usage personnel, et ce dépôt est distribué sous licence MIT : y placer le logo reviendrait à le redistribuer.
Le widget reste reconnaissable par d'autres moyens :
- le nom « Claude » en texte, pour désigner ce qui est mesuré ;
- un **glyphe neutre** (SF Symbol `sparkle`, à 4 branches, qui n'imite pas le logo Claude) ;
- la palette terracotta sur fond gris chaud, et un chiffre en serif.
- La mention « Widget personnel non officiel — non affilié à Anthropic » figure dans la vue de détail de l'app (trop longue pour tenir dans le widget).

Palette : couleurs publiées par Anthropic dans son skill officiel `brand-guidelines` (Dark `#141413`, Light `#FAF9F5`, Mid Gray `#B0AEA5`, Orange `#D97757`). Les fonds sombres reprennent l'interface sombre de claude.ai : **valeurs relevées à confirmer sur une capture**.

| Token | Valeur | Usage | Contraste |
|---|---|---|---|
| `bg` | `#262624` | fond anthracite chaud | — |
| `card` | `#30302E` | zone de jauge (moyen) | — |
| `track` | `#3D3D3A` | piste des barres | — |
| `text` | `#FAF9F5` | chiffres, titres | 12,6:1 sur `card` |
| `textMuted` | `#B0AEA5` | libellés, dates | 5,9:1 sur `card` · 6,8:1 sur `bg` |
| `accent` | `#D97757` | glyphe, remplissage des jauges | 4,9:1 sur `bg` — **réservé aux jauges et grands chiffres** (≥ 3:1 UI), jamais au petit texte |
| `radius` | 20 (widget, imposé par iOS) · 12 (carte) · 2 (barre) | | |
| `space` | 4 · 8 · 12 · 16 | | |

Typographie :
- **Chiffres** en serif, pour rappeler les titres serif de Claude : `Charter` (installée sur iOS, à vérifier sur l'appareil), à défaut `Georgia`. Les polices propres à Claude ne sont pas disponibles.
- **Texte** en `systemFont` (SF Pro), chasse 12 à 13.
- Pas de monospace, pour rester sobre.

Jauges : barres horizontales de 4 pt, extrémités arrondies, sur les deux formats, comme la page d'usage de claude.ai. Pas d'anneau.

### 5.2 Flo Dashboard — identité AFDEV (relevée sur afdev.fr)

Source : la feuille de style en production (`/_astro/SiteLayout.*.css`, variables OKLCH converties en hex) et le SVG du logo en en-tête. Rien n'est inventé, sauf les couleurs `ok`/`info` (marquées *), absentes du site.

| Token | Variable du site | Valeur | Usage | Contraste |
|---|---|---|---|---|
| `bg` | `--background` | `#0B0604` | fond (noir chaud) | — |
| `card` | `--card` | `#120C07` | tuiles | — |
| `cardAlt` | `--secondary` | `#211912` | lignes alternées, piste de jauge | — |
| `stroke` | `--border` (crème 10 %) | `#F4EEE4` @ 10 % | bordures de tuiles et de badges | — |
| `text` | `--foreground` | `#F4EEE4` | valeurs | 16,8:1 |
| `textMuted` | `--muted-foreground` | `#978D82` | surtitres, métadonnées | 6,0:1 |
| `primary` | `--primary` | `#F7A224` | surtitres en alerte, badges actifs, liens | 9,4:1 |
| `danger` | `--destructive` | `#F9423D` | hors ligne, échec | 5,4:1 |
| `ok`* | dérivé de `primary` (même L/C, teinte 150) | `#67D283` | en ligne, prêt | 10,3:1 |
| `info`* | dérivé (teinte 240) | `#55AEE8` | build en cours, Tisséo | 8,0:1 |
| Logo | `.st0/.st1/.st2` du SVG | `#FFE458` · `#F49916` · `#252528` | monogramme en-tête | — |
| `radius` | `--radius-2xl` / `--radius-lg` / `rounded-full` | 16 · 8 · pilule | tuile · ligne · badge | |

Conventions du site reprises :
- **Surtitres** en mono, majuscules, très espacés (`font-mono text-xs uppercase tracking-[0.3em]`), en `primary` ou en `textMuted`.
- **Badges pilule** bordés (`rounded-full border text-[10px] uppercase tracking-wider`).
- **Typographie** : Inter et JetBrains Mono sur le site, transposées en `systemFont` (SF Pro, très proche d'Inter) et `mediumMonospacedSystemFont` (SF Mono). Inter et JetBrains Mono ne sont pas fournies par iOS, et rien ne garantit que Scriptable lise une police installée par profil : c'est un test optionnel en P2.
- **Exclusions** : `--shadow-glow`, `--gradient-radial` et le bruit de fond du site sont décoratifs et ne sont pas repris dans le widget. Le dégradé ambre reste réservé au monogramme.
- **Logo** : le SVG d'afdev.fr est converti une fois en PNG (Scriptable ne lit pas le SVG) et stocké en base64 dans `ui/assets/afdev-mark.js`. C'est votre propre marque, sans contrainte.

**Point d'attention :** les deux identités sont chaudes. Elles restent distinctes par :
- le fond : gris chaud clair `#262624` pour Claude, noir brun `#0B0604` pour AFDEV ;
- l'accent : terracotta désaturé pour Claude, ambre vif pour AFDEV ;
- la typographie : serif pour Claude, mono en majuscules pour AFDEV.

---

## 6. Configuration

- **`Flo Config.js`** (racine, votre copie, jamais écrasée par une mise à jour) : modules activés, sites, dépôts favoris, arrêts Tisséo, coordonnées et heures moto, seuils, TTL éventuels, ordre/priorité des tuiles. Aucun secret.
- **`flo/core/config.js`** fusionne avec les défauts et **valide** (types, URL, plages horaires) ; une config invalide → carte « setup » explicite, pas de crash.
- **Secrets** : Keychain uniquement (`flo.github.token`, `flo.vercel.token`, `flo.umami.key`, `flo.tisseo.key`), saisis via `Flo Réglages` (champ sécurisé `Alert`), avec bouton « Tester » et « Supprimer ».
- **Paramètre du widget** (`args.widgetParameter`) : variante par instance, ex. `focus=sites` pour un second widget dédié.

Extrait du modèle :

```js
module.exports = {
  locale: 'fr-FR',
  modules: {
    sites:   { enabled: true, urls: ['https://afdev.fr', 'https://lylusio.fr', 'https://aurelia-desvaux.fr', 'https://garagemendonca.com'] },
    github:  { enabled: true, owner: 'FloAFDEV', repos: ['…'] },
    deployments: { enabled: true, provider: 'github-deployments' }, // ou 'vercel-api'
    analytics: { enabled: false, provider: 'umami-cloud', sites: [{ name: 'afdev.fr', websiteId: '…' }] },
    tisseo:  { enabled: false, stops: [{ label: 'Arènes', stopPointId: '…', lines: ['A', 'L1'] }] },
    weather: { enabled: true, lat: 43.60, lon: 1.44, departures: ['08:00'], returns: ['18:30'],
               thresholds: { rainPct: 30, gustKmh: 50, minTempC: 5 } },
    family:  { enabled: true, days: 3, reminders: true, birthdays: true },
  },
  medium: { tiles: ['sites', 'deployments', 'weather', 'family'] },
}
```

---

## 7. Sécurité et journalisation

- Aucun jeton dans le code ni dans `Flo Config.js` ; iCloud ne reçoit **que** le code et `claude-usage.json` (pourcentages + dates, rien d'autre).
- Permissions minimales :
  - GitHub : PAT *fine-grained*, dépôts sélectionnés, lecture seule *Metadata / Contents / Pull requests / Deployments*, expiration 90 j.
  - Vercel (si option retenue) : les jetons Vercel **ne peuvent pas être restreints à la lecture** → portée limitée à une équipe, expiration courte, révocation si perte du téléphone. D'où le choix par défaut de GitHub Deployments.
  - Umami auto-hébergé : utilisateur dédié en lecture seule.
- Données Famille : lues et rendues sur l'iPhone, cache local uniquement, jamais envoyées ni synchronisées.
- `401/403` → état « Reconnecter » avec lien vers `Flo Réglages` ; `429` → respect de `Retry-After`, cache prolongé.
- Journal : niveau, module, code d'état, durée. Masquage automatique des en-têtes `Authorization`, paramètres `key=`, `token=`. Rotation à 200 lignes.

---

## 8. Installation et mise à jour

**Installation (une fois)**
1. iMac : `mac/sync-to-icloud.sh` copie `src/` vers `~/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/` (ne touche jamais `Flo Config.js` s'il existe).
2. iPhone : Scriptable → dupliquer `Flo Config.example.js` en `Flo Config.js`, l'ajuster.
3. Lancer `Flo Réglages` : autorisations Calendrier/Rappels, saisie des jetons, tests.
4. Écran d'accueil → appui long → `+` → Scriptable → taille → *Modifier le widget* : Script = `Claude Usage` ou `Flo Dashboard`, *Lors de l'interaction* = **Exécuter le script**, Paramètre optionnel.
5. iMac (après votre accord) : ajouter `statusLine` → `mac/statusline-sync.sh` dans `~/.claude/settings.json`.

**Mise à jour** : `git pull` sur l'iMac puis `sync-to-icloud.sh`. iCloud propage à l'iPhone. Pas d'auto-updater téléchargeant du code distant depuis l'iPhone (exécution de code non vérifié + jeton GitHub requis si dépôt privé).

---

## 9. Blocages et risques identifiés

| # | Blocage | Sévérité | Réponse |
|---|---|---|---|
| 1 | Option A contraire aux conditions d'Anthropic + rotation des jetons | Bloquant | Option C' (status line) |
| 2 | Quotas Claude non rafraîchis quand l'iMac est éteint ou Claude Code inactif | Fonctionnelle | Âge affiché, état « réinitialisé », lien claude.ai |
| 3 | `rate_limits` absent dans certaines versions de Claude Code | Moyen | Test P1-a avant tout développement |
| 4 | Fichier iCloud pas encore téléchargé au moment du rafraîchissement | Faible | `downloadFileFromiCloud` + repli sur la dernière lecture locale |
| 5 | Fréquence de rafraîchissement non maîtrisée | Structurel | Compteurs vivants, cache, détail dans l'app |
| 6 | Tisséo : clé à demander par e-mail, doc publique datée (v2, 2022) | Moyen | Module désactivé par défaut, état « clé requise » ; endpoints à revérifier à réception |
| 7 | Jeton Vercel non restreignable à la lecture | Moyen | GitHub Deployments par défaut |
| 8 | Vérif HTTP depuis l'iPhone ≠ supervision continue (réseau mobile, uniquement au rafraîchissement) | Faible | Libellé « dernière vérification » honnête |
| 9 | Mémoire du grand widget | Moyen | Mesure en P7, images minimales |
| 10 | PDF / qualité JPEG | Faible | Raccourci iOS / redimensionnement |
| 11 | Mode teinté iOS 18 | Faible | Icônes + libellés lisibles en monochrome |

---

## 10. Ordre d'implémentation (une PR par étape)

| Étape | Contenu | Dépend de |
|---|---|---|
| **P0** | Socle `core/` + `ui/themes` (Claude, AFDEV), `components`, `gauge`, monogramme AFDEV + `Flo Réglages` + `sync-to-icloud.sh` | — |
| **P1-a** | Script de diagnostic de status line (lecture seule) : confirmer `rate_limits` et le format de `resets_at` sur votre iMac | votre accord |
| **P1-b** | `statusline-sync.sh` + widget Claude Usage petit et moyen | P0, P1-a OK |
| **P2** | Flo Dashboard moyen : Sites + Moto Météo (aucun secret) + routeur/menu app | P0 |
| **P3** | GitHub + Déploiements (GitHub Deployments) | P2, PAT |
| **P4** | Famille (local) | P2 |
| **P5** | Analytics (Umami) + option Vercel API | P2 |
| **P6** | Tisséo | clé reçue |
| **P7** | Grand widget + vues de détail complètes + mesure mémoire | P3–P6 |
| **P8** | Outils | P0 |

---

## 11. Points à trancher avant de coder

1. Acceptez-vous l'abandon de l'option A au profit de l'option C' (status line) ?
2. Emplacement du code : `widgets/scriptable/` dans ce dépôt (proposé) ou dépôt dédié ?
3. Déploiements : GitHub Deployments (lecture seule, recommandé) ou jeton Vercel ?
4. Analytics : Umami Cloud ou auto-hébergé, et quels sites ?
5. Tisséo : arrêts/lignes favoris — et lancez la demande de clé dès maintenant (délai).
6. Moto : coordonnées approximatives domicile/travail, heures aller/retour, seuils.
7. Widget moyen du dashboard : les 4 tuiles prioritaires proposées vous conviennent-elles ?
8. Claude Usage sans logo officiel (glyphe neutre + nom en texte) : validé ?
9. Fonds Claude `#262624`/`#30302E` : à confirmer par une capture de claude.ai en mode sombre sur votre iPhone.
10. Badges en anglais (`READY`, `BUILD`, `DOWN`) repris des statuts Vercel, ou traduits (`PRÊT`, `EN COURS`, `HORS LIGNE`) ?

---

## Sources

- Scriptable — ListWidget (`refreshAfterDate`, `url`, familles, mémoire) : https://docs.scriptable.app/listwidget/
- Interdiction des jetons d'abonnement dans les outils tiers : https://gigazine.net/gsc_news/en/20260220-anthropic-third-party-block · https://alternativeto.net/news/2026/2/anthropic-officially-bans-using-subscription-authentication-for-third-party-claude-use
- Scope de `setup-token` et 403 sur l'usage : https://claudeissues.com/issue/24200-setup-token-missing-user-profile-scope-usage-tab-in-status-broken · https://claudeissues.com/issue/81015-feature-request-read-only-usage-scope-on-claude-setup-token-or-a-usage-read-gran
- Format de `/api/oauth/usage` (non documenté, variable) : https://pypi.org/project/ccusage/
- `rate_limits` dans la status line : https://wmedia.es/en/tips/claude-code-usage-limit-status-line · https://github.com/anthropics/claude-code/issues/45133
- Marques Anthropic : https://www.anthropic.com/legal/trademark-guidelines
- Palette Anthropic (skill officiel `brand-guidelines`) : https://github.com/anthropics/skills
- Identité AFDEV : https://afdev.fr (CSS de production et SVG du logo, relevés le 30/10/2026)
- API Tisséo : https://data.toulouse-metropole.fr/explore/dataset/api-temps-reel-tisseo/
