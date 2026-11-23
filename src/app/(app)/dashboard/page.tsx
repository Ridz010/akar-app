import type { Metadata } from 'next'
import Link from 'next/link'

import { FeatureCard } from '@/components/shared/feature-card'
import { images } from '@/config/images'
import { ActivityList, listJoinedActivityIds, listOpenActivities } from '@/features/activities'
import { DashboardHero, DashboardSection, StatusSummary } from '@/features/dashboard'
import {
  ObservationList,
  countMyObservationsByStatus,
  listMyObservations,
} from '@/features/observations'
import { countPendingObservations } from '@/features/verification'
import { requireUser } from '@/lib/auth/guards'

export const metadata: Metadata = { title: 'Dasbor' }

export default async function DashboardPage() {
  const user = await requireUser()
  const isAdmin = user.role === 'admin'
  const isCoordinator = user.role === 'coordinator'

  const [counts, recent, activities, joinedIds, pendingReview] = await Promise.all([
    countMyObservationsByStatus(user.id),
    listMyObservations(user.id, 5),
    listOpenActivities(4),
    listJoinedActivityIds(user.id),
    isAdmin ? countPendingObservations() : Promise.resolve(0),
  ])

  return (
    <>
      <DashboardHero name={user.fullName} />
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        <FeatureCard
          title="Scan daun"
          description="Potret satu daun untuk prediksi awal spesies."
          href="/scanner"
          actionLabel="Mulai scan"
          image={images.leafRosette}
          icon="scan"
          imageHeight={170}
          emphasis
        />
        <FeatureCard
          title="Laporan baru"
          description="Catat lokasi, waktu, dan kondisi mangrove."
          href="/observations/new"
          actionLabel="Buat laporan"
          image={images.propRoots}
          icon="report"
          imageHeight={170}
        />
        <FeatureCard
          title="Peta mangrove"
          description="Lihat titik yang sudah diverifikasi."
          href="/mangrove-map"
          actionLabel="Buka peta"
          image={images.aerialCanopy}
          icon="map"
          imageHeight={170}
        />
      </div>

      <StatusSummary counts={counts} />

      {isCoordinator && (
        <Link
          href="/activities"
          className="group flex flex-col gap-2 rounded-[1.25rem] bg-sage-900 p-6 text-white transition-colors outline-none hover:bg-sage-800 focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex-row sm:items-center sm:justify-between sm:p-8"
        >
          <span className="font-display text-2xl">
            {activities.length > 0
              ? `${activities.length} aktivitas sedang berjalan atau direncanakan`
              : 'Belum ada aktivitas. Umumkan kegiatan pertama kelompokmu'}
          </span>
          <span className="text-sm text-lime-400">Kelola aktivitas</span>
        </Link>
      )}

      {isAdmin && (
        <Link
          href="/admin/verification"
          className="group flex flex-col gap-2 rounded-[1.25rem] bg-sage-900 p-6 text-white transition-colors outline-none hover:bg-sage-800 focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex-row sm:items-center sm:justify-between sm:p-8"
        >
          <span className="font-display text-2xl">
            {pendingReview > 0
              ? `${pendingReview} laporan menunggu pemeriksaanmu`
              : 'Antrean verifikasi sedang kosong'}
          </span>
          <span className="text-sm text-lime-400">Buka antrean</span>
        </Link>
      )}

      <div className="grid gap-12 xl:grid-cols-2 xl:gap-16">
        <DashboardSection
          title="Pengamatan terbaru"
          href="/observations"
          linkLabel="Semua pengamatan"
          empty="Belum ada laporan. Mulai dari scan daun pertamamu."
        >
          {recent.length > 0 ? <ObservationList items={recent} /> : undefined}
        </DashboardSection>
        <DashboardSection
          title="Kegiatan terdekat"
          href="/activities"
          linkLabel="Semua aktivitas"
          empty="Belum ada kegiatan yang diumumkan koordinator."
        >
          {activities.length > 0 ? (
            <ActivityList items={activities} joinable joinedIds={joinedIds} />
          ) : undefined}
        </DashboardSection>
      </div>
    </>
  )
}
