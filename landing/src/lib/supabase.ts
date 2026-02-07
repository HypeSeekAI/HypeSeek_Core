import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  // Don't crash the landing page build; we may not have envs in preview.
  // When we start backend integration, these must be set.
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY (landing page can still render).'
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
