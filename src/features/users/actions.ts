'use server'

import { revalidatePath } from 'next/cache'

import { z } from 'zod'

import { BackendError, backendFetch } from '@/lib/api/backend'
import { requireRole, requireUser } from '@/lib/auth/guards'
import { createClientIfConfigured } from '@/lib/supabase/server'

import { changeRoleSchema, updateProfileSchema } from './schemas'
import type { ProfileFormState, RoleFormState } from './types'

export async function updateProfile(
  _: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await requireUser()
  const parsed = updateProfileSchema.safeParse({
    fullName: formData.get('fullName'),
    showNamePublicly: formData.get('showNamePublicly') === 'on',
  })
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Data tidak valid.' }
  }

  const supabase = await createClientIfConfigured()
  if (!supabase) return { status: 'error', message: 'Basis data belum dikonfigurasi.' }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: parsed.data.fullName,
      show_name_publicly: parsed.data.showNamePublicly,
    })
    .eq('id', user.id)
  if (error) return { status: 'error', message: 'Profil gagal disimpan. Coba lagi.' }

  revalidatePath('/profile')
  return { status: 'success', message: 'Profil tersimpan.' }
}

const roleResponseSchema = z.object({ id: z.uuid(), role: z.string() })

export async function changeUserRole(_: RoleFormState, formData: FormData): Promise<RoleFormState> {
  const admin = await requireRole('admin')
  const parsed = changeRoleSchema.safeParse({
    userId: formData.get('userId'),
    role: formData.get('role'),
  })
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Data tidak valid.' }
  }
  if (parsed.data.userId === admin.id && parsed.data.role !== 'admin') {
    return { status: 'error', message: 'Kamu tidak dapat menurunkan peranmu sendiri.' }
  }

  try {
    await backendFetch({
      path: `/v1/admin/users/${parsed.data.userId}/role`,
      method: 'POST',
      json: { role: parsed.data.role },
      schema: roleResponseSchema,
      signal: AbortSignal.timeout(15_000),
    })
  } catch (error) {
    if (error instanceof BackendError) return { status: 'error', message: error.message }
    return { status: 'error', message: 'Layanan backend belum dapat dihubungi.' }
  }

  revalidatePath('/admin/users')
  return { status: 'success', message: 'Tersimpan. Berlaku saat pengguna masuk ulang.' }
}
