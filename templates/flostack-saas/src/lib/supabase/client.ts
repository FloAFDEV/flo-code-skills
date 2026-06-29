import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

/**
 * Client Supabase côté navigateur (Client Components).
 * À instancier dans le composant qui en a besoin — n'utilise que la clé `anon`.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
