import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FloStack SaaS",
    template: "%s · FloStack SaaS",
  },
  description: "Starter SaaS Next.js — App Router, Supabase, Tailwind.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        <header className="border-b border-neutral-200 dark:border-neutral-800">
          <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link href="/" className="font-semibold">
              FloStack
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/login" className="hover:underline">
                Connexion
              </Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
          {children}
        </main>

        <footer className="border-t border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-neutral-500">
            © {new Date().getFullYear()} FloStack SaaS — starter Next.js.
          </div>
        </footer>
      </body>
    </html>
  );
}
