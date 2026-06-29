import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Zone protégée : accessible uniquement avec une session valide.
      </p>

      <div className="rounded-lg border border-neutral-200 p-6 text-sm text-neutral-500 dark:border-neutral-800">
        Contenu du tableau de bord à venir.
      </div>
    </section>
  );
}
