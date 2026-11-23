import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { LocationTimeline, getLocationHistory } from '@/features/locations'
import { requireUser } from '@/lib/auth/guards'
import { isSupabaseConfigured } from '@/lib/env'

export const metadata: Metadata = { title: 'Riwayat lokasi' }

export default async function LocationDetailPage({ params }: PageProps<'/locations/[id]'>) {
  await requireUser()
  const { id } = await params
  const location = await getLocationHistory(id)

  if (!location) {
    if (isSupabaseConfigured()) notFound()
    return (
      <>
        <PageHeader title="Riwayat lokasi" description="Kondisi satu lokasi dari waktu ke waktu." />
        <EmptyState
          title="Data lokasi belum tersedia"
          description="Hubungkan Supabase untuk melihat riwayat pengamatan di lokasi ini."
        />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title={location.name}
        description={
          location.isSensitive
            ? 'Lokasi sensitif. Koordinat tidak ditampilkan untuk publik.'
            : `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
        }
      />
      {location.entries.length > 0 ? (
        <LocationTimeline entries={location.entries} />
      ) : (
        <EmptyState
          title="Belum ada pengamatan"
          description="Pengamatan di lokasi ini akan tersusun sebagai linimasa."
        />
      )}
    </>
  )
}
