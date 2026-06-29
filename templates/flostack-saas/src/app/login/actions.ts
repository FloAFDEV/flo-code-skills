"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

/** Connexion par email + mot de passe, puis redirection vers le dashboard. */
export async function signIn(formData: FormData) {
  const { email, password } = readCredentials(formData);
  if (!email || !password) redirect("/login?error=missing");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?error=invalid");

  redirect("/dashboard");
}

/** Inscription par email + mot de passe (création de compte de démarrage). */
export async function signUp(formData: FormData) {
  const { email, password } = readCredentials(formData);
  if (!email || !password) redirect("/login?error=missing");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) redirect("/login?error=signup");

  redirect("/dashboard");
}
