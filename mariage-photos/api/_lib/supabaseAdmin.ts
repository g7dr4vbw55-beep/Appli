import { createClient } from '@supabase/supabase-js'

let client: ReturnType<typeof createClient> | null = null

/**
 * Client Supabase côté serveur uniquement, avec la clé service_role.
 * Ne jamais importer ce fichier depuis du code exécuté dans le navigateur.
 */
export function getSupabaseAdmin() {
  if (client) return client

  const url = normaliserUrlSupabase(process.env.VITE_SUPABASE_URL)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    const manquantes = [
      !url ? 'VITE_SUPABASE_URL' : null,
      !serviceRoleKey ? 'SUPABASE_SERVICE_ROLE_KEY' : null,
    ]
      .filter(Boolean)
      .join(' et ')
    throw new Error(
      `Configuration serveur incomplète : ${manquantes} n'est pas définie dans Vercel. Ajoutez-la puis relancez un déploiement.`,
    )
  }

  client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  })
  return client
}

export const BUCKET_NAME = process.env.VITE_SUPABASE_BUCKET || 'photos'

/**
 * Ne garde que l'adresse de base du projet Supabase.
 *
 * Le tableau de bord Supabase affiche aussi l'adresse de l'API REST
 * (".../rest/v1/"), qu'il est naturel de recopier par erreur. Collée telle
 * quelle, elle produit des adresses du type ".../rest/v1//rest/v1/photos" et
 * toutes les requêtes échouent. On retire donc ce suffixe et les barres
 * finales plutôt que de laisser une erreur de recopie casser l'application.
 */
export function normaliserUrlSupabase(url: string | undefined): string | undefined {
  if (!url) return undefined
  return url.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '').replace(/\/+$/, '')
}
