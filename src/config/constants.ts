import type { Enums } from '@/types/database'

export const INITIAL_SUPPORTED_SPECIES = 3

export const OBSERVATION_STATUSES = [
  'pending',
  'verified',
  'revision_required',
  'rejected',
] as const satisfies readonly Enums<'observation_status'>[]
export type ObservationStatus = (typeof OBSERVATION_STATUSES)[number]

export const PREDICTION_STATUSES = [
  'confident',
  'needs_review',
  'unrecognized',
] as const satisfies readonly Enums<'prediction_status'>[]
export type PredictionStatus = (typeof PREDICTION_STATUSES)[number]

export const PREDICTION_STATUS_LABELS: Record<PredictionStatus, string> = {
  confident: 'Cukup yakin',
  needs_review: 'Perlu pemeriksaan',
  unrecognized: 'Tidak dikenali',
}

export const PREDICTION_THRESHOLDS = { review: 0.5, confident: 0.8 } as const

export const PHOTO_QUALITIES = ['good', 'fair', 'poor'] as const
export type PhotoQuality = (typeof PHOTO_QUALITIES)[number]

export const PHOTO_QUALITY_LABELS: Record<PhotoQuality, string> = {
  good: 'Foto jelas',
  fair: 'Foto cukup',
  poor: 'Foto kurang jelas',
}

export const SITE_CONDITIONS = [
  'healthy',
  'stressed',
  'damaged',
  'littered',
] as const satisfies readonly Enums<'site_condition'>[]
export type SiteCondition = (typeof SITE_CONDITIONS)[number]

export const SITE_CONDITION_LABELS: Record<SiteCondition, string> = {
  healthy: 'Sehat',
  stressed: 'Tertekan',
  damaged: 'Rusak',
  littered: 'Banyak sampah',
}

export const SITE_CONDITION_COLORS: Record<SiteCondition, string> = {
  healthy: '#2f6b3f',
  stressed: '#8fae1f',
  damaged: '#b42318',
  littered: '#92400e',
}

export const ACTIVITY_STATUSES = [
  'planned',
  'ongoing',
  'completed',
  'cancelled',
] as const satisfies readonly Enums<'activity_status'>[]

export const ACTIVITY_STATUS_LABELS: Record<Enums<'activity_status'>, string> = {
  planned: 'Direncanakan',
  ongoing: 'Berlangsung',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
}

export const IMAGE_UPLOAD = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1600,
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  bucket: 'observation-photos',
} as const

export const MAP_DEFAULT_VIEW = {
  center: [-2.5, 118] as [number, number],
  zoom: 5,
}
