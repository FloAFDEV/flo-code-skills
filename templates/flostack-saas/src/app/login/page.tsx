import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "./actions";

export const metadata: Metadata = {
  title: "Connexion",
};

const ERROR_MESSAGES: Record<string, string> = {
  missing: "Email et mot de passe requis.",
  invalid: "Identifiants invalides.",
  signup: "Inscription impossible (email déjà utilisé ou mot de passe trop court ?).",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = error
    ? (ERROR_MESSAGES[error] ?? "Une erreur est survenue.")
    : null;

  return (
    <section className="mx-auto flex max-w-sm flex-col gap-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Connectez-vous, ou créez un compte de démarrage.
        </p>
      </div>

      {message ? (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          {message}
        </p>
      ) : null}

      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-700"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={6}
            className="rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-700"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button type="submit" formAction={signIn} variant="primary">
            Se connecter
          </Button>
          <Button type="submit" formAction={signUp} variant="secondary">
            Créer un compte
          </Button>
        </div>
      </form>
    </section>
  );
}
