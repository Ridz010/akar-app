import type { ObservationStatus, SiteCondition } from '@/config/constants'

export type ObservationSummary = {
  id: string
  status: ObservationStatus
  condition: SiteCondition
  observedAt: string
  speciesName: string | null
  locationName: string | null
}

export type StatusCounts = Record<ObservationStatus, number>

export type ObservationFormState = {
  status: 'idle' | 'error' | 'success'
  message?: string
  fieldErrors?: Record<string, string | undefined>
}
