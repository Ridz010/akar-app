import { z } from 'zod'

import { SITE_CONDITIONS } from '@/config/constants'

export const createObservationSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  observedAt: z.coerce.date({ error: 'Tanggal tidak valid.' }),
  condition: z.enum(SITE_CONDITIONS, 'Pilih kondisi lokasi.'),
  photoPath: z.string().min(1, 'Foto wajib diunggah.'),
  notes: z.string().trim().max(1000, 'Catatan maksimal 1.000 karakter.').optional(),
})

export type CreateObservationInput = z.infer<typeof createObservationSchema>
