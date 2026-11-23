import 'server-only'

import { OBSERVATION_STATUSES } from '@/config/constants'
import { createClientIfConfigured } from '@/lib/supabase/server'

import type { ObservationSummary, StatusCounts } from './types'

const SUMMARY_COLUMNS =
  'id, status, condition, observed_at, species:species_id(scientific_name, local_name), location:location_id(name)'

export async function listMyObservations(
  userId: string,
  limit = 50,
): Promise<ObservationSummary[]> {
  const supabase = await createClientIfConfigured()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('observations')
    .select(SUMMARY_COLUMNS)
    .eq('user_id', userId)
    .order('observed_at', { ascending: false })
    .limit(limit)
  if (error) throw error

  return data.map((row) => ({
    id: row.id,
    status: row.status,
    condition: row.condition,
    observedAt: row.observed_at,
    speciesName: row.species?.local_name ?? row.species?.scientific_name ?? null,
    locationName: row.location?.name ?? null,
  }))
}

export async function countMyObservationsByStatus(userId: string): Promise<StatusCounts> {
  const counts = Object.fromEntries(
    OBSERVATION_STATUSES.map((status) => [status, 0]),
  ) as StatusCounts
  const supabase = await createClientIfConfigured()
  if (!supabase) return counts

  const { data, error } = await supabase.from('observations').select('status').eq('user_id', userId)
  if (error) throw error

  for (const { status } of data) counts[status] += 1
  return counts
}
