import 'server-only'

import { createClient } from '@supabase/supabase-js'

import { getPublicEnv, isSupabaseConfigured } from '@/lib/env'
import type { Database } from '@/types/database'

export function createPublicClient() {
  if (!isSupabaseConfigured()) return null
  const env = getPublicEnv()
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}
