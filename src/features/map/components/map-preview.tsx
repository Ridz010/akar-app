'use client'

import { ArrowUpRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { SITE_CONDITION_LABELS, SITE_CONDITIONS } from '@/config/constants'

import { CONDITION_COLORS } from '../condition-style'
import type { MapPoint } from '../types'

const MangroveMap = dynamic(() => import('./mangrove-map'), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-sage-100" />,
})

export function MapPreview({ points }: { points: MapPoint[] }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_3fr] lg:items-stretch lg:gap-14">
      <div className="flex flex-col justify-between gap-10">
        <div>
          <p className="text-sm text-sage-700">Peta</p>
          <h2 id="peta-title" className="mt-4 type-title text-ink">
            Lihat titik mangrove yang sudah diperiksa
          </h2>
          <p className="mt-5 max-w-md text-slate sm:text-lg">
            {points.length > 0
              ? `${points.length} titik pengamatan terverifikasi dari laporan masyarakat.`
              : 'Titik akan muncul setelah laporan pertama diverifikasi pengelola.'}
          </p>
        </div>

        <div className="space-y-6">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink">
            {SITE_CONDITIONS.map((condition) => (
              <li key={condition} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: CONDITION_COLORS[condition] }}
                />
                {SITE_CONDITION_LABELS[condition]}
              </li>
            ))}
          </ul>
          <Link
            href="/map"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-sage-900 px-6 text-white transition-colors outline-none hover:bg-sage-800 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Buka peta lengkap
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>

      <div className="relative isolate h-[26rem] overflow-hidden rounded-[1.75rem] ring-1 ring-line sm:h-[32rem]">
        <MangroveMap points={points} scrollWheelZoom={false} />
      </div>
    </div>
  )
}
