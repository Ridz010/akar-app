import type { Metadata } from 'next'

import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import {
  ActivityForm,
  ActivityList,
  ActivityManager,
  listJoinedActivityIds,
  listLocationOptions,
  listManagedActivities,
  listOpenActivities,
} from '@/features/activities'
import { requireUser } from '@/lib/auth/guards'

export const metadata: Metadata = { title: 'Aktivitas konservasi' }

async function CommunityActivities({ userId }: { userId: string }) {
  const [activities, joinedIds] = await Promise.all([
    listOpenActivities(),
    listJoinedActivityIds(userId),
  ])

  return (
    <>
      <PageHeader
        title="Aktivitas konservasi"
        description="Aksi nyata yang lahir dari laporan terverifikasi. Daftar untuk ikut serta."
      />
      {activities.length > 0 ? (
        <ActivityList items={activities} joinable joinedIds={joinedIds} />
      ) : (
        <EmptyState
          title="Belum ada kegiatan"
          description="Penanaman atau bersih pesisir akan diumumkan di sini oleh koordinator."
          points={['Jadwal dan lokasi kegiatan.', 'Pendaftaran sebagai peserta.']}
        />
      )}
    </>
  )
}

async function ManagedActivities() {
  const [activities, locations] = await Promise.all([
    listManagedActivities(),
    listLocationOptions(),
  ])
  const upcoming = activities.filter((activity) => ['planned', 'ongoing'].includes(activity.status))
  const participants = activities.reduce((total, activity) => total + activity.participantCount, 0)

  return (
    <>
      <PageHeader
        title="Aktivitas konservasi"
        description="Umumkan kegiatan, pantau peserta, dan perbarui statusnya sampai selesai."
      />
      <dl className="grid grid-cols-3 divide-x divide-line rounded-[1.5rem] bg-white ring-1 ring-line">
        {[
          { label: 'Kegiatan aktif', value: upcoming.length },
          { label: 'Total kegiatan', value: activities.length },
          { label: 'Total peserta', value: participants },
        ].map((stat) => (
          <div key={stat.label} className="p-5 sm:p-6">
            <dt className="text-sm text-slate">{stat.label}</dt>
            <dd className="mt-2 font-display text-4xl leading-none text-ink tabular-nums">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="xl:sticky xl:top-6 xl:self-start">
          <ActivityForm locations={locations} />
        </div>
        {activities.length > 0 ? (
          <ActivityManager items={activities} />
        ) : (
          <EmptyState
            title="Belum ada kegiatan"
            description="Kegiatan yang kamu umumkan akan tampil di sini beserta jumlah pesertanya."
          />
        )}
      </div>
    </>
  )
}

export default async function ActivitiesPage() {
  const user = await requireUser()
  return user.role === 'community' ? (
    <CommunityActivities userId={user.id} />
  ) : (
    <ManagedActivities />
  )
}
