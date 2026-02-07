import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Keep the site rendering even if env isn't set yet
  // (Vercel preview builds, local dev, etc.)
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. '
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
