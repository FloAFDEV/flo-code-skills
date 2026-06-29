import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { signOut } from "./actions";

/**
 * Garde de route simple : pas de session valide → redirection vers /login.
 * Protège tout le segment /dashboard.
 */
export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          Connecté : <span className="font-medium">{user.email}</span>
        </span>
        <form action={signOut}>
          <Button type="submit" variant="secondary">
            Se déconnecter
          </Button>
        </form>
      </div>
      {children}
    </div>
  );
}
