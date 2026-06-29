# flostack-saas

Starter SaaS **Next.js 15** (App Router) · **TypeScript strict** · **Tailwind v4**.
Application réelle, clonable et exécutable immédiatement — pas un framework.

> État : **J1 (squelette)**. Auth Supabase + protection du dashboard (J2), UI/UX (J3),
> SEO + doc complète (J4) arrivent ensuite. Le README détaillé sera écrit en J4.

## Démarrer

```bash
pnpm install
pnpm dev
```

L'app tourne sur http://localhost:3000 — **sans aucune configuration** à cette étape
(aucune variable d'environnement requise en J1 ; voir `.env.example` pour la suite).

## Scripts

| Script           | Rôle                          |
|------------------|-------------------------------|
| `pnpm dev`       | serveur de développement      |
| `pnpm build`     | build de production           |
| `pnpm start`     | sert le build de production   |
| `pnpm lint`      | ESLint (config Next)          |
| `pnpm typecheck` | vérification TypeScript       |

## Structure (J1)

```
src/
├── app/                 # App Router
│   ├── layout.tsx       # layout global (header nav + footer + metadata)
│   ├── page.tsx         # /
│   ├── login/page.tsx   # /login (formulaire en J2)
│   └── dashboard/page.tsx # /dashboard (protégé en J2)
└── components/
    └── ui/button.tsx    # primitive réutilisable
```
