# flostack-saas

Starter SaaS **Next.js 15** (App Router) · **TypeScript strict** · **Tailwind v4**.
Application réelle, clonable et exécutable immédiatement — pas un framework.

> État : **J2 (auth Supabase)**. UI/UX (J3) et SEO + doc complète (J4) arrivent ensuite.
> Le README détaillé sera écrit en J4.

## Démarrer

```bash
pnpm install
cp .env.example .env.local   # renseigner les 2 variables Supabase
pnpm dev
```

L'app tourne sur http://localhost:3000. **Configuration requise depuis J2** : une URL et
une clé `anon` Supabase (voir `.env.example`). Sans elles, la connexion lèvera une erreur
explicite.

## Scripts

| Script           | Rôle                          |
|------------------|-------------------------------|
| `pnpm dev`       | serveur de développement      |
| `pnpm build`     | build de production           |
| `pnpm start`     | sert le build de production   |
| `pnpm lint`      | ESLint (config Next)          |
| `pnpm typecheck` | vérification TypeScript       |

## Structure (J2)

```
src/
├── app/                       # App Router
│   ├── layout.tsx             # layout global (header nav + footer + metadata)
│   ├── page.tsx               # /
│   ├── login/                 # /login : page + actions (signIn / signUp)
│   └── dashboard/             # /dashboard : layout (garde) + page + action (signOut)
├── components/ui/button.tsx   # primitive réutilisable
├── lib/
│   ├── env.ts                 # accès env typé + validé (seul lecteur de process.env)
│   └── supabase/              # clients server / client + helper middleware
└── middleware.ts              # rafraîchissement de session Supabase
```

## Authentification (J2)

- **Connexion / inscription** email + mot de passe (`/login`) via Server Actions.
- **Session persistante** par cookies (SSR), rafraîchie par le middleware.
- **`/dashboard` protégé** : sans session valide → redirection vers `/login`.
- **Déconnexion** depuis la barre du dashboard.
