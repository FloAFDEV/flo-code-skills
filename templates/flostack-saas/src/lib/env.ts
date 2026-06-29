/**
 * Accès centralisé et validé aux variables d'environnement.
 *
 * Seul endroit du projet autorisé à lire `process.env` : le code métier importe
 * `env` et n'y touche jamais directement.
 *
 * Validation volontairement simple (deux variables publiques) — on lève une
 * erreur explicite si une valeur manque, plutôt qu'une panne silencieuse.
 *
 * Les getters sont *paresseux* : la validation se déclenche à l'usage (runtime),
 * pas à l'import — ce qui laisse le build passer tant que la variable n'est pas
 * réellement consommée. Les références à `process.env.NEXT_PUBLIC_*` restent
 * littérales pour que Next.js les remplace dans le bundle navigateur.
 */
function assert(name: string, value: string | undefined): string {
  if (!value || value.length === 0) {
    throw new Error(
      `Variable d'environnement manquante : ${name}. Voir .env.example.`,
    );
  }
  return value;
}

export const env = {
  get supabaseUrl(): string {
    return assert(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    );
  },
  get supabaseAnonKey(): string {
    return assert(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  },
} as const;
