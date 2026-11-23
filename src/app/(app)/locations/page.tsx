import type { Metadata } from 'next'
import Link from 'next/link'

import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { buttonVariants } from '@/components/ui/button'
import { LocationList, listLocations } from '@/features/locations'
import { requireUser } from '@/lib/auth/guards'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Riwayat lokasi' }

export default async function LocationsPage() {
  const user = await requireUser()
  const seesAll = user.role !== 'community'
  const locations = await listLocations(seesAll)

  return (
    <>
      <PageHeader
        title="Riwayat lokasi"
        description={
          seesAll
            ? 'Semua lokasi pemantauan beserta kondisi terakhirnya. Buka satu lokasi untuk melihat perubahan dari waktu ke waktu.'
            : 'Lokasi yang pernah kamu laporkan beserta kondisi terakhirnya.'
        }
      />
      {locations.length > 0 ? (
        <LocationList locations={locations} />
      ) : (
        <EmptyState
          title="Belum ada lokasi"
          description="Lokasi muncul di sini setelah ada laporan yang menyertakannya."
          points={[
            'Kondisi terakhir setiap lokasi.',
            'Jumlah laporan dan statusnya.',
            'Linimasa perubahan kondisi.',
          ]}
          action={
            <Link
              href="/observations/new"
              className={cn(buttonVariants(), 'h-11 rounded-full px-5 font-normal')}
            >
              Buat laporan
            </Link>
          }
        />
      )}
    </>
  )
}
