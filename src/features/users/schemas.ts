import { z } from 'zod'

import { ROLES } from '@/config/permissions'

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2, 'Nama minimal 2 karakter.').max(80, 'Nama terlalu panjang.'),
  showNamePublicly: z.boolean(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export const changeRoleSchema = z.object({
  userId: z.uuid('Pengguna tidak valid.'),
  role: z.enum(ROLES, 'Peran tidak valid.'),
})
