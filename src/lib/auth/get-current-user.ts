import 'server-only'

import { isRole, type Role } from '@/config/permissions'
import { isSupabaseConfigured } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'

export type CurrentUser = {
  id: string
  email: string | null
  fullName: string | null
  role: Role
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured()) return null

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) return null

  const { claims } = data
  const metadata = (claims.user_metadata ?? {}) as Record<string, unknown>

  return {
    id: claims.sub,
    email: typeof claims.email === 'string' ? claims.email : null,
    fullName: typeof metadata.full_name === 'string' ? metadata.full_name : null,
    role: isRole(claims.user_role) ? claims.user_role : 'community',
  }
}
