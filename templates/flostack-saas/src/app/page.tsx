import Link from "next/link";

export default function HomePage() {
  return (
    <section className="flex flex-col items-start gap-6 py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Starter SaaS, prêt à cloner
        </h1>
        <p className="max-w-xl text-neutral-600 dark:text-neutral-400">
          Next.js 15 (App Router), TypeScript strict et Tailwind. L&apos;auth
          Supabase et la protection du dashboard arrivent à l&apos;étape suivante.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Se connecter
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Voir le dashboard
        </Link>
      </div>
    </section>
  );
}
