import type { SiteCondition } from '@/config/constants'

export type MapPoint = {
  id: string
  latitude: number
  longitude: number
  isApproximate: boolean
  condition: SiteCondition
  observedAt: string
  speciesName: string | null
  scientificName: string | null
  locationName: string | null
}
