import { createClient } from '@supabase/supabase-js'

/**
 * Ne garde que l'adresse de base du projet Supabase.
 *
 * Le tableau de bord Supabase affiche aussi l'adresse de l'API REST
 * (".../rest/v1/"), qu'il est naturel de recopier par erreur. Collée telle
 * quelle, elle produit des adresses du type ".../rest/v1//rest/v1/photos" et
 * toutes les requêtes échouent. On retire donc ce suffixe et les barres
 * finales plutôt que de laisser une erreur de recopie casser l'application.
 */
export function normaliserUrlSupabase(url: string | undefined): string {
  if (!url) return ''
  return url.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '').replace(/\/+$/, '')
}

export const SUPABASE_URL = normaliserUrlSupabase(import.meta.env.VITE_SUPABASE_URL)
export const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.error(
    "Configuration Supabase manquante : vérifiez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans les variables d'environnement.",
  )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const BUCKET_NAME = (import.meta.env.VITE_SUPABASE_BUCKET as string | undefined) || 'photos'

export function urlPublique(storagePath: string): string {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath)
  return data.publicUrl
}
