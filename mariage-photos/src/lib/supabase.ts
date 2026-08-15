import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    "Configuration Supabase manquante : vérifiez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans le fichier .env",
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

export const BUCKET_NAME = (import.meta.env.VITE_SUPABASE_BUCKET as string | undefined) || 'photos'

export function urlPublique(storagePath: string): string {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath)
  return data.publicUrl
}
