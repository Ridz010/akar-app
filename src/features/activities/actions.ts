'use server'

import { revalidatePath } from 'next/cache'

import { requireRole, requireUser } from '@/lib/auth/guards'
import { createClientIfConfigured } from '@/lib/supabase/server'

import { activityIdSchema, createActivitySchema, updateActivityStatusSchema } from './schemas'
import type { ActivityFormState } from './types'

function revalidateActivities() {
  revalidatePath('/activities')
  revalidatePath('/dashboard')
}

export async function joinActivity(formData: FormData) {
  const user = await requireUser()
  const parsed = activityIdSchema.safeParse({ activityId: formData.get('activityId') })
  const supabase = await createClientIfConfigured()
  if (!parsed.success || !supabase) return

  await supabase
    .from('activity_participants')
    .upsert({ activity_id: parsed.data.activityId, user_id: user.id })
  revalidateActivities()
}

export async function leaveActivity(formData: FormData) {
  const user = await requireUser()
  const parsed = activityIdSchema.safeParse({ activityId: formData.get('activityId') })
  const supabase = await createClientIfConfigured()
  if (!parsed.success || !supabase) return

  await supabase
    .from('activity_participants')
    .delete()
    .eq('activity_id', parsed.data.activityId)
    .eq('user_id', user.id)
  revalidateActivities()
}

export async function createActivity(
  _: ActivityFormState,
  formData: FormData,
): Promise<ActivityFormState> {
  const user = await requireRole('coordinator', 'admin')
  const parsed = createActivitySchema.safeParse({
    title: formData.get('title') ?? '',
    description: formData.get('description') ?? '',
    locationId: formData.get('locationId') ?? '',
    startsAt: formData.get('startsAt') ?? '',
    endsAt: formData.get('endsAt') ?? '',
  })
  if (!parsed.success) {
    const fieldErrors: ActivityFormState['fieldErrors'] = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === 'string' && !(key in fieldErrors)) {
        fieldErrors[key as keyof typeof fieldErrors] = issue.message
      }
    }
    return { status: 'error', message: 'Periksa kembali isian kegiatan.', fieldErrors }
  }

  const supabase = await createClientIfConfigured()
  if (!supabase) return { status: 'error', message: 'Basis data belum dikonfigurasi.' }

  const { error } = await supabase.from('activities').insert({
    title: parsed.data.title,
    description: parsed.data.description,
    location_id: parsed.data.locationId,
    starts_at: parsed.data.startsAt,
    ends_at: parsed.data.endsAt,
    created_by: user.id,
  })
  if (error) return { status: 'error', message: 'Kegiatan gagal disimpan. Coba lagi.' }

  revalidateActivities()
  return { status: 'success', message: 'Kegiatan diumumkan.' }
}

export async function updateActivityStatus(formData: FormData) {
  await requireRole('coordinator', 'admin')
  const parsed = updateActivityStatusSchema.safeParse({
    activityId: formData.get('activityId'),
    status: formData.get('status'),
  })
  const supabase = await createClientIfConfigured()
  if (!parsed.success || !supabase) return

  await supabase
    .from('activities')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.activityId)
  revalidateActivities()
}
