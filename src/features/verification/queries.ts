import 'server-only'

import { IMAGE_UPLOAD } from '@/config/constants'
import { createClientIfConfigured } from '@/lib/supabase/server'

import type { QueueItem } from './types'

export async function listVerificationQueue(limit = 30): Promise<QueueItem[]> {
  const supabase = await createClientIfConfigured()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('observations')
    .select(
      'id, status, condition, observed_at, notes, latitude, longitude, photo_path, location:location_id(name), predictions(prediction_status, predicted_label, confidence, observed_traits, species:species_id(scientific_name, local_name))',
    )
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(limit)
  if (error) throw error

  const paths = data.map((row) => row.photo_path)
  const signed =
    paths.length > 0
      ? await supabase.storage.from(IMAGE_UPLOAD.bucket).createSignedUrls(paths, 60 * 30)
      : { data: [] }
  const urlByPath = new Map(
    (signed.data ?? []).flatMap((entry) =>
      entry.path && entry.signedUrl ? [[entry.path, entry.signedUrl] as const] : [],
    ),
  )

  return data.map((row) => {
    const prediction = row.predictions[0]
    return {
      id: row.id,
      status: row.status,
      condition: row.condition,
      observedAt: row.observed_at,
      notes: row.notes,
      latitude: row.latitude,
      longitude: row.longitude,
      locationName: row.location?.name ?? null,
      photoUrl: urlByPath.get(row.photo_path) ?? null,
      prediction: prediction
        ? {
            status: prediction.prediction_status,
            label: prediction.predicted_label,
            speciesName: prediction.species?.local_name ?? null,
            scientificName: prediction.species?.scientific_name ?? null,
            confidence: prediction.confidence,
            observedTraits: prediction.observed_traits ?? [],
          }
        : null,
    }
  })
}

export async function countPendingObservations(): Promise<number> {
  const supabase = await createClientIfConfigured()
  if (!supabase) return 0

  const { count, error } = await supabase
    .from('observations')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')
  if (error) throw error
  return count ?? 0
}
