import { z } from 'zod'

import { IMAGE_UPLOAD } from '@/config/constants'

const MAX_BYTES = 5 * 1024 * 1024

export const leafImageSchema = z
  .instanceof(File, { error: 'Pilih foto daun terlebih dahulu.' })
  .refine((file) => file.size > 0, 'Pilih foto daun terlebih dahulu.')
  .refine((file) => file.size <= MAX_BYTES, 'Ukuran foto maksimal 5 MB.')
  .refine(
    (file) => (IMAGE_UPLOAD.acceptedTypes as readonly string[]).includes(file.type),
    'Format foto harus JPG, PNG, atau WebP.',
  )
