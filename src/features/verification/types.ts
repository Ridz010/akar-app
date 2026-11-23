import type { ObservationStatus, PredictionStatus, SiteCondition } from '@/config/constants'

export type QueueItem = {
  id: string
  status: ObservationStatus
  condition: SiteCondition
  observedAt: string
  notes: string | null
  latitude: number
  longitude: number
  locationName: string | null
  photoUrl: string | null
  prediction: {
    status: PredictionStatus
    label: string | null
    speciesName: string | null
    scientificName: string | null
    confidence: number
    observedTraits: string[]
  } | null
}

export type VerificationFormState = {
  status: 'idle' | 'error' | 'success'
  message?: string
}
