'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { requireUser } from '@/lib/auth/guards'
import { createClientIfConfigured } from '@/lib/supabase/server'

import { createObservationSchema } from './schemas'
import type { ObservationFormState } from './types'

export async function createObservation(
  _: ObservationFormState,
  formData: FormData,
): Promise<ObservationFormState> {
  const user = await requireUser()
  const parsed = createObservationSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors as Record<string, string[]>
    return {
      status: 'error',
      fieldErrors: Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0]])),
    }
  }

  const supabase = await createClientIfConfigured()
  if (!supabase) return { status: 'error', message: 'Basis data belum dikonfigurasi.' }

  const input = parsed.data
  if (!input.photoPath.startsWith(`${user.id}/`)) {
    return { status: 'error', message: 'Foto tidak valid. Unggah ulang fotomu.' }
  }

  const { data, error } = await supabase
    .from('observations')
    .insert({
      user_id: user.id,
      latitude: input.latitude,
      longitude: input.longitude,
      observed_at: input.observedAt.toISOString(),
      condition: input.condition,
      photo_path: input.photoPath,
      notes: input.notes || null,
    })
    .select('id')
    .single()
  if (error) return { status: 'error', message: 'Laporan gagal disimpan. Coba lagi.' }

  revalidatePath('/observations')
  revalidatePath('/dashboard')
  redirect(`/observations?baru=${data.id}`)
}
