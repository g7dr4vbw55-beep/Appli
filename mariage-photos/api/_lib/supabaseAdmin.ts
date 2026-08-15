import { createClient } from '@supabase/supabase-js'

let client: ReturnType<typeof createClient> | null = null

/**
 * Client Supabase côté serveur uniquement, avec la clé service_role.
 * Ne jamais importer ce fichier depuis du code exécuté dans le navigateur.
 */
export function getSupabaseAdmin() {
  if (client) return client

  const url = process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Configuration serveur manquante : VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies.',
    )
  }

  client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  })
  return client
}

export const BUCKET_NAME = process.env.VITE_SUPABASE_BUCKET || 'photos'
