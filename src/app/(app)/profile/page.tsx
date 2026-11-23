import type { Metadata } from 'next'

import { PageHeader } from '@/components/shared/page-header'
import { ProfileForm, getProfile } from '@/features/users'
import { requireUser } from '@/lib/auth/guards'

export const metadata: Metadata = { title: 'Profil' }

export default async function ProfilePage() {
  const user = await requireUser()
  const profile = (await getProfile(user.id)) ?? {
    id: user.id,
    fullName: user.fullName ?? '',
    role: user.role,
    showNamePublicly: false,
  }

  return (
    <>
      <PageHeader title="Profil" description="Kelola data diri dan preferensi privasimu." />
      <ProfileForm profile={profile} email={user.email} />
    </>
  )
}
