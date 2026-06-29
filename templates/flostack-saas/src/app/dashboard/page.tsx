import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <section className="flex flex-col gap-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Page applicative. La protection par session Supabase (redirection vers
        <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 dark:bg-neutral-800">
          /login
        </code>
        si non authentifié) sera ajoutée à l&apos;étape J2.
      </p>

      <div className="rounded-lg border border-neutral-200 p-6 text-sm text-neutral-500 dark:border-neutral-800">
        Contenu du tableau de bord à venir.
      </div>
    </section>
  );
}
