import 'server-only'

import { connection } from 'next/server'

import { createPublicClient } from '@/lib/supabase/public'

import type { MapPoint } from './types'

export async function listPublicMapPoints(limit = 2000): Promise<MapPoint[]> {
  const supabase = createPublicClient()
  if (!supabase) return []
  await connection()

  const { data, error } = await supabase
    .from('public_map_points')
    .select('*')
    .order('observed_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('[AKAR] Gagal memuat titik peta:', error.message)
    return []
  }

  return data.map((row) => ({
    id: row.id,
    latitude: row.latitude,
    longitude: row.longitude,
    isApproximate: row.is_approximate,
    condition: row.condition,
    observedAt: row.observed_at,
    speciesName: row.local_name,
    scientificName: row.scientific_name,
    locationName: row.location_name,
  }))
}
