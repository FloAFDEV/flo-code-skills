import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function LoginPage() {
  return (
    <section className="mx-auto flex max-w-sm flex-col gap-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Le formulaire de connexion Supabase sera branché à l&apos;étape J2
        (auth + session). Cette page est volontairement un squelette.
      </p>

      <div className="flex flex-col gap-4 rounded-lg border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
        <p className="text-sm text-neutral-500">Formulaire à venir (J2).</p>
        <Button variant="primary" disabled>
          Se connecter
        </Button>
      </div>
    </section>
  );
}
