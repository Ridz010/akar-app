'use server'

import { revalidatePath } from 'next/cache'

import { requireRole } from '@/lib/auth/guards'
import { createClientIfConfigured } from '@/lib/supabase/server'

import { verificationDecisionSchema } from './schemas'
import type { VerificationFormState } from './types'

export async function verifyObservation(
  _: VerificationFormState,
  formData: FormData,
): Promise<VerificationFormState> {
  const verifier = await requireRole('admin')
  const parsed = verificationDecisionSchema.safeParse({
    observationId: formData.get('observationId'),
    decision: formData.get('decision'),
    note: formData.get('note') || undefined,
  })
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Data tidak valid.' }
  }

  const supabase = await createClientIfConfigured()
  if (!supabase) return { status: 'error', message: 'Basis data belum dikonfigurasi.' }

  const { error } = await supabase.from('verifications').insert({
    observation_id: parsed.data.observationId,
    verifier_id: verifier.id,
    decision: parsed.data.decision,
    note: parsed.data.note ?? null,
  })
  if (error) return { status: 'error', message: 'Keputusan gagal disimpan. Coba lagi.' }

  revalidatePath('/admin/verification')
  revalidatePath('/map')
  return { status: 'success', message: 'Keputusan tersimpan.' }
}
