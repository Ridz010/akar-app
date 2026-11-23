import type { ObservationStatus, SiteCondition } from '@/config/constants'

export type LocationHistory = {
  id: string
  name: string
  latitude: number
  longitude: number
  isSensitive: boolean
  entries: {
    id: string
    observedAt: string
    condition: SiteCondition
    status: ObservationStatus
    speciesName: string | null
  }[]
}

export type LocationSummary = {
  id: string
  name: string
  isSensitive: boolean
  groupName: string | null
  reportCount: number
  latest: {
    observedAt: string
    condition: SiteCondition
    status: ObservationStatus
  } | null
}
