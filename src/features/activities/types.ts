import type { Enums } from '@/types/database'

export type ActivityStatus = Enums<'activity_status'>

export type ActivitySummary = {
  id: string
  title: string
  description: string | null
  startsAt: string
  status: ActivityStatus
  locationName: string | null
}

export type ManagedActivity = ActivitySummary & {
  endsAt: string | null
  participantCount: number
}

export type LocationOption = {
  id: string
  name: string
}

export type ActivityFormState = {
  status: 'idle' | 'error' | 'success'
  message?: string
  fieldErrors?: Partial<
    Record<'title' | 'description' | 'locationId' | 'startsAt' | 'endsAt', string>
  >
}
