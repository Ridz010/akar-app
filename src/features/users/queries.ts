import 'server-only'

import { createClientIfConfigured } from '@/lib/supabase/server'

import type { Profile, UserSummary } from './types'

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClientIfConfigured()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, show_name_publicly')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null

  return {
    id: data.id,
    fullName: data.full_name,
    role: data.role,
    showNamePublicly: data.show_name_publicly,
  }
}

export async function listUsers(limit = 200): Promise<UserSummary[]> {
  const supabase = await createClientIfConfigured()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at, group:group_id(name)')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error

  return data.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    role: row.role,
    groupName: row.group?.name ?? null,
    createdAt: row.created_at,
  }))
}
