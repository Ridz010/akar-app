import type { Metadata } from 'next'

import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { VerificationQueue, listVerificationQueue } from '@/features/verification'

export const metadata: Metadata = { title: 'Verifikasi laporan' }

export default async function VerificationPage() {
  const queue = await listVerificationQueue()

  return (
    <>
      <PageHeader
        title="Verifikasi laporan"
        description="Tinjau laporan masyarakat sebelum tampil di peta publik. Laporan terlama tampil lebih dulu."
      />
      {queue.length > 0 ? (
        <VerificationQueue items={queue} />
      ) : (
        <EmptyState
          title="Antrean verifikasi kosong"
          description="Laporan baru dari masyarakat akan masuk ke sini untuk ditinjau."
          points={[
            'Bandingkan prediksi model dengan foto asli.',
            'Setujui, minta revisi dengan catatan, atau tolak.',
            'Laporan terverifikasi otomatis tampil di peta publik.',
          ]}
        />
      )}
    </>
  )
}
