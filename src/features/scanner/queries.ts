import 'server-only'

import { createClientIfConfigured } from '@/lib/supabase/server'

export type PredictionReference = {
  id: string
  photoPath: string
  label: string | null
}

export async function getMyPrediction(
  predictionId: string,
  userId: string,
): Promise<PredictionReference | null> {
  const supabase = await createClientIfConfigured()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('predictions')
    .select('id, photo_path, predicted_label')
    .eq('id', predictionId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error || !data) return null

  return { id: data.id, photoPath: data.photo_path, label: data.predicted_label }
}
