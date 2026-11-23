import 'server-only'

import { createClientIfConfigured } from '@/lib/supabase/server'

import type { ActivitySummary, LocationOption, ManagedActivity } from './types'

export async function listOpenActivities(limit = 20): Promise<ActivitySummary[]> {
  const supabase = await createClientIfConfigured()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('activities')
    .select('id, title, description, starts_at, status, location:location_id(name)')
    .in('status', ['planned', 'ongoing'])
    .order('starts_at', { ascending: true })
    .limit(limit)
  if (error) throw error

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    startsAt: row.starts_at,
    status: row.status,
    locationName: row.location?.name ?? null,
  }))
}

export async function listManagedActivities(limit = 50): Promise<ManagedActivity[]> {
  const supabase = await createClientIfConfigured()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('activities')
    .select(
      'id, title, description, starts_at, ends_at, status, location:location_id(name), participants:activity_participants(count)',
    )
    .order('starts_at', { ascending: false })
    .limit(limit)
  if (error) throw error

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    status: row.status,
    locationName: row.location?.name ?? null,
    participantCount: row.participants[0]?.count ?? 0,
  }))
}

export async function listJoinedActivityIds(userId: string): Promise<string[]> {
  const supabase = await createClientIfConfigured()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('activity_participants')
    .select('activity_id')
    .eq('user_id', userId)
  if (error) throw error
  return data.map((row) => row.activity_id)
}

export async function listLocationOptions(): Promise<LocationOption[]> {
  const supabase = await createClientIfConfigured()
  if (!supabase) return []

  const { data, error } = await supabase.from('locations').select('id, name').order('name')
  if (error) throw error
  return data
}
