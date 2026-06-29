import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Rafraîchit la session Supabase à chaque requête (rotation du token).
 * C'est le minimum requis par `@supabase/ssr` côté serveur — rien de plus :
 * aucune logique de redirection/autorisation ici (le garde de route vit dans
 * le layout `/dashboard`).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Important : revalide l'utilisateur pour déclencher le refresh des cookies.
  await supabase.auth.getUser();

  return response;
}
