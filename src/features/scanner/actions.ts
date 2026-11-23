'use server'

import { BackendError, backendFetch } from '@/lib/api/backend'
import { requireUser } from '@/lib/auth/guards'

import { leafImageSchema } from './schemas'
import { predictionSchema, type ScanState } from './types'

export async function identifyLeaf(_: ScanState, formData: FormData): Promise<ScanState> {
  await requireUser()

  const image = leafImageSchema.safeParse(formData.get('image'))
  if (!image.success) {
    return { status: 'error', message: image.error.issues[0]?.message ?? 'Foto tidak valid.' }
  }

  const body = new FormData()
  body.append('image', image.data)

  try {
    const prediction = await backendFetch({
      path: '/v1/predictions',
      method: 'POST',
      body,
      schema: predictionSchema,
      signal: AbortSignal.timeout(30_000),
    })
    return { status: 'success', prediction }
  } catch (error) {
    if (error instanceof BackendError) return { status: 'error', message: error.message }
    return {
      status: 'error',
      message: 'Layanan identifikasi belum dapat dihubungi. Coba beberapa saat lagi.',
    }
  }
}
