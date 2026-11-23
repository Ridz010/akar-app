import type { Metadata } from 'next'

import { PageHeader } from '@/components/shared/page-header'
import { ScannerPanel } from '@/features/scanner'

export const metadata: Metadata = { title: 'Scan daun' }

export default function ScannerPage() {
  return (
    <>
      <PageHeader
        title="Pindai AI"
        description="Potret satu daun mangrove. Hasilnya adalah prediksi awal yang tetap diperiksa pengelola."
      />
      <ScannerPanel />
    </>
  )
}
