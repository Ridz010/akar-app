import type { Metadata } from 'next'

import { PageHeader } from '@/components/shared/page-header'
import { MapExplorer, listPublicMapPoints } from '@/features/map'
import { requireUser } from '@/lib/auth/guards'

export const metadata: Metadata = { title: 'Peta mangrove' }

export default async function MangroveMapPage() {
  await requireUser()
  const points = await listPublicMapPoints()

  return (
    <>
      <PageHeader
        title="Peta mangrove"
        description="Titik pengamatan yang sudah diverifikasi. Saring berdasarkan kondisi untuk melihat lokasi yang perlu ditindaklanjuti."
      />
      <MapExplorer points={points} />
    </>
  )
}
