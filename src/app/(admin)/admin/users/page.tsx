import type { Metadata } from 'next'

import { PageHeader } from '@/components/shared/page-header'
import { UserDirectory, listUsers } from '@/features/users'
import { requireRole } from '@/lib/auth/guards'

export const metadata: Metadata = { title: 'Kelola pengguna' }

export default async function UsersPage() {
  const admin = await requireRole('admin')
  const users = await listUsers()

  return (
    <>
      <PageHeader
        title="Kelola pengguna"
        description="Atur peran setiap akun. Perubahan peran berlaku saat pengguna masuk ulang."
      />
      <UserDirectory users={users} currentUserId={admin.id} />
    </>
  )
}
