import { z } from 'zod'

import { ACTIVITY_STATUSES } from '@/config/constants'

export const activityIdSchema = z.object({
  activityId: z.uuid('Kegiatan tidak valid.'),
})

const LOCAL_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

const wibDateTime = z
  .string()
  .regex(LOCAL_DATETIME, 'Isi tanggal dan jam.')
  .transform((value) => new Date(`${value}:00+07:00`).toISOString())

export const createActivitySchema = z
  .object({
    title: z.string().trim().min(4, 'Judul minimal 4 karakter.').max(120, 'Judul terlalu panjang.'),
    description: z
      .string()
      .trim()
      .max(1000, 'Deskripsi maksimal 1000 karakter.')
      .transform((value) => value || null),
    locationId: z
      .union([z.uuid('Lokasi tidak valid.'), z.literal('')])
      .transform((value) => value || null),
    startsAt: wibDateTime,
    endsAt: z.union([wibDateTime, z.literal('').transform(() => null)]),
  })
  .refine((value) => !value.endsAt || value.endsAt >= value.startsAt, {
    path: ['endsAt'],
    message: 'Waktu selesai harus setelah waktu mulai.',
  })

export const updateActivityStatusSchema = z.object({
  activityId: z.uuid('Kegiatan tidak valid.'),
  status: z.enum(ACTIVITY_STATUSES),
})
