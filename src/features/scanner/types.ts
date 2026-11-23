import { z } from 'zod'

import { PHOTO_QUALITIES, PREDICTION_STATUSES } from '@/config/constants'

export const predictionSchema = z.object({
  id: z.uuid(),
  prediction_status: z.enum(PREDICTION_STATUSES),
  predicted_label: z.string().nullable(),
  species: z
    .object({
      id: z.uuid(),
      scientific_name: z.string(),
      local_name: z.string().nullable(),
      family: z.string().nullable().default(null),
      leaf_traits: z.string().nullable().default(null),
    })
    .nullable(),
  confidence: z.number().min(0).max(1),
  top_k: z.array(
    z.object({
      label: z.string(),
      local_name: z.string().nullable().default(null),
      confidence: z.number().min(0).max(1),
    }),
  ),
  observed_traits: z.array(z.string()).default([]),
  photo_quality: z.enum(PHOTO_QUALITIES).nullable().default(null),
  photo_feedback: z.string().nullable().default(null),
  agreement: z.number().min(0).max(1).nullable().default(null),
  model_version: z.string(),
  photo_path: z.string(),
})

export type Prediction = z.infer<typeof predictionSchema>

export type ScanState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; prediction: Prediction }
