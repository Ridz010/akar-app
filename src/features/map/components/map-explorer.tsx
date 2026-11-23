'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'

import { SITE_CONDITION_LABELS, SITE_CONDITIONS, type SiteCondition } from '@/config/constants'
import { cn } from '@/lib/utils'

import { CONDITION_COLORS } from '../condition-style'
import type { MapPoint } from '../types'

const MangroveMap = dynamic(() => import('./mangrove-map'), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-sage-100" />,
})

export function MapExplorer({ points }: { points: MapPoint[] }) {
  const [condition, setCondition] = useState<SiteCondition | null>(null)
  const visible = useMemo(
    () => (condition ? points.filter((point) => point.condition === condition) : points),
    [points, condition],
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr] lg:gap-8">
      <aside className="flex flex-col gap-8">
        <div>
          <h2 className="font-sans text-sm text-slate">Kondisi lokasi</h2>
          <div role="group" aria-label="Saring kondisi" className="mt-3 flex flex-wrap gap-2">
            <FilterChip active={condition === null} onClick={() => setCondition(null)}>
              Semua
            </FilterChip>
            {SITE_CONDITIONS.map((value) => (
              <FilterChip
                key={value}
                active={condition === value}
                onClick={() => setCondition(value)}
                color={CONDITION_COLORS[value]}
              >
                {SITE_CONDITION_LABELS[value]}
              </FilterChip>
            ))}
          </div>
        </div>

        <dl className="grid grid-cols-2 border-y border-line">
          <div className="border-r border-line py-5 pr-4">
            <dt className="text-sm text-slate">Titik ditampilkan</dt>
            <dd className="mt-1 font-display text-4xl text-ink tabular-nums">{visible.length}</dd>
          </div>
          <div className="py-5 pl-4">
            <dt className="text-sm text-slate">Disamarkan</dt>
            <dd className="mt-1 font-display text-4xl text-ink tabular-nums">
              {visible.filter((point) => point.isApproximate).length}
            </dd>
          </div>
        </dl>

        <p className="text-sm text-slate">
          Hanya laporan yang sudah diverifikasi pengelola yang tampil. Lokasi sensitif digambar
          sebagai lingkaran besar dengan koordinat yang dibulatkan.
        </p>
      </aside>

      <div className="relative isolate h-[70svh] min-h-[28rem] overflow-hidden rounded-[1.25rem] border border-line">
        <MangroveMap points={visible} />
        {points.length === 0 && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[500] rounded-2xl bg-white/95 p-5 shadow-sm backdrop-blur sm:inset-x-auto sm:left-4 sm:max-w-sm">
            <p className="text-ink">Belum ada titik terverifikasi.</p>
            <p className="mt-1 text-sm text-slate">
              Titik akan muncul setelah laporan pertama diperiksa pengelola.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

type FilterChipProps = {
  active: boolean
  onClick: () => void
  color?: string
  children: React.ReactNode
}

function FilterChip({ active, onClick, color, children }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        active
          ? 'border-sage-900 bg-sage-900 text-white'
          : 'border-line bg-white text-ink hover:bg-surface',
      )}
    >
      {color && (
        <span aria-hidden className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
      )}
      {children}
    </button>
  )
}
