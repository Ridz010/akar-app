import type { Metadata } from 'next'
import Link from 'next/link'

import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { buttonVariants } from '@/components/ui/button'
import { OBSERVATION_STATUSES, type ObservationStatus } from '@/config/constants'
import { ObservationList, listMyObservations } from '@/features/observations'
import { requireUser } from '@/lib/auth/guards'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Pengamatan saya' }

const FILTERS: { value: ObservationStatus | null; label: string }[] = [
  { value: null, label: 'Semua' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'verified', label: 'Terverifikasi' },
  { value: 'revision_required', label: 'Perlu revisi' },
  { value: 'rejected', label: 'Ditolak' },
]

const isStatus = (value: unknown): value is ObservationStatus =>
  typeof value === 'string' && (OBSERVATION_STATUSES as readonly string[]).includes(value)

export default async function ObservationsPage({ searchParams }: PageProps<'/observations'>) {
  const user = await requireUser()
  const { status } = await searchParams
  const active = isStatus(status) ? status : null
  const all = await listMyObservations(user.id)
  const items = active ? all.filter((item) => item.status === active) : all

  return (
    <>
      <PageHeader
        title="Pengamatan saya"
        description="Semua laporan yang kamu kirim beserta status verifikasinya."
        actions={
          <Link
            href="/observations/new"
            className={cn(buttonVariants(), 'h-11 rounded-full px-5 font-normal')}
          >
            Laporan baru
          </Link>
        }
      />

      <nav aria-label="Saring status" className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const selected = filter.value === active
          return (
            <Link
              key={filter.label}
              href={filter.value ? `/observations?status=${filter.value}` : '/observations'}
              aria-current={selected ? 'page' : undefined}
              className={cn(
                'inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                selected
                  ? 'border-sage-900 bg-sage-900 text-white'
                  : 'border-line text-ink hover:bg-surface',
              )}
            >
              {filter.label}
            </Link>
          )
        })}
      </nav>

      {items.length > 0 ? (
        <ObservationList items={items} />
      ) : (
        <EmptyState
          title={active ? 'Tidak ada laporan dengan status ini' : 'Belum ada pengamatan'}
          description="Laporan yang kamu kirim akan tercantum di sini beserta status verifikasinya."
          points={[
            'Potret daun lewat menu scan.',
            'Lengkapi lokasi, waktu, dan kondisi lapangan.',
            'Pantau statusnya hingga terverifikasi.',
          ]}
          action={
            <Link
              href="/scanner"
              className={cn(buttonVariants({ variant: 'outline' }), 'h-11 rounded-full px-5')}
            >
              Mulai scan daun
            </Link>
          }
        />
      )}
    </>
  )
}
