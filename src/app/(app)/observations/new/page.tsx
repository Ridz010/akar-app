import type { Metadata } from 'next'

import { PageHeader } from '@/components/shared/page-header'
import { ObservationForm } from '@/features/observations'
import { getMyPrediction } from '@/features/scanner'
import { requireUser } from '@/lib/auth/guards'

export const metadata: Metadata = { title: 'Laporan baru' }

export default async function NewObservationPage({ searchParams }: PageProps<'/observations/new'>) {
  const user = await requireUser()
  const { prediksi } = await searchParams
  const prediction = typeof prediksi === 'string' ? await getMyPrediction(prediksi, user.id) : null

  return (
    <>
      <PageHeader
        title="Laporan baru"
        description="Catat foto, lokasi, waktu, dan kondisi mangrove yang kamu temui."
      />
      <ObservationForm
        userId={user.id}
        initialPhotoPath={prediction?.photoPath}
        initialPhotoLabel={prediction?.label}
      />
    </>
  )
}
