import 'server-only'

import { createClientIfConfigured } from '@/lib/supabase/server'

import { locationIdSchema } from './schemas'
import type { LocationHistory, LocationSummary } from './types'

export async function getLocationHistory(id: string): Promise<LocationHistory | null> {
  const parsed = locationIdSchema.safeParse(id)
  const supabase = await createClientIfConfigured()
  if (!parsed.success || !supabase) return null

  const { data, error } = await supabase
    .from('locations')
    .select(
      'id, name, latitude, longitude, is_sensitive, observations(id, observed_at, condition, status, species:species_id(scientific_name, local_name))',
    )
    .eq('id', parsed.data)
    .order('observed_at', { referencedTable: 'observations', ascending: false })
    .maybeSingle()
  if (error) throw error
  if (!data) return null

  return {
    id: data.id,
    name: data.name,
    latitude: data.latitude,
    longitude: data.longitude,
    isSensitive: data.is_sensitive,
    entries: data.observations.map((entry) => ({
      id: entry.id,
      observedAt: entry.observed_at,
      condition: entry.condition,
      status: entry.status,
      speciesName: entry.species?.local_name ?? entry.species?.scientific_name ?? null,
    })),
  }
}

export async function listLocations(includeAll: boolean): Promise<LocationSummary[]> {
  const supabase = await createClientIfConfigured()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('locations')
    .select(
      'id, name, is_sensitive, group:group_id(name), total:observations(count), latest:observations(observed_at, condition, status)',
    )
    .order('observed_at', { referencedTable: 'latest', ascending: false })
    .limit(1, { referencedTable: 'latest' })
    .order('name')
  if (error) throw error

  return data
    .map((row) => {
      const latest = row.latest[0]
      return {
        id: row.id,
        name: row.name,
        isSensitive: row.is_sensitive,
        groupName: row.group?.name ?? null,
        reportCount: row.total[0]?.count ?? 0,
        latest: latest
          ? { observedAt: latest.observed_at, condition: latest.condition, status: latest.status }
          : null,
      }
    })
    .filter((location) => includeAll || location.reportCount > 0)
    .sort((a, b) => (b.latest?.observedAt ?? '').localeCompare(a.latest?.observedAt ?? ''))
}
