import { ArrowUpRight, MapPin } from 'lucide-react'
import Link from 'next/link'

import { StatusBadge } from '@/components/shared/status-badge'
import { SITE_CONDITION_COLORS, SITE_CONDITION_LABELS } from '@/config/constants'
import { formatDate } from '@/lib/format'

import type { LocationSummary } from '../types'

export function LocationList({ locations }: { locations: LocationSummary[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {locations.map((location) => (
        <li key={location.id}>
          <Link
            href={`/locations/${location.id}`}
            className="group flex h-full flex-col rounded-[1.5rem] bg-white p-6 ring-1 ring-line transition-shadow outline-none hover:shadow-[0_20px_40px_-28px_rgba(28,38,29,0.5)] focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-display text-2xl leading-tight text-ink">{location.name}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate">
                  <MapPin aria-hidden className="size-3.5" />
                  {location.groupName ?? 'Belum terhubung ke kelompok'}
                  {location.isSensitive && ' · lokasi sensitif'}
                </p>
              </div>
              <ArrowUpRight
                aria-hidden
                className="size-5 shrink-0 text-slate transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
              <p>
                <span className="font-display text-4xl leading-none text-ink tabular-nums">
                  {location.reportCount}
                </span>
                <span className="ml-2 text-sm text-slate">laporan</span>
              </p>
              {location.latest ? (
                <div className="text-right">
                  <p className="flex items-center justify-end gap-2 text-sm text-ink">
                    <span
                      aria-hidden
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: SITE_CONDITION_COLORS[location.latest.condition] }}
                    />
                    {SITE_CONDITION_LABELS[location.latest.condition]}
                  </p>
                  <p className="mt-1 text-xs text-slate">
                    Terakhir {formatDate(location.latest.observedAt, 'shortDate')}
                  </p>
                  <StatusBadge status={location.latest.status} className="mt-2" />
                </div>
              ) : (
                <p className="text-sm text-slate">Belum ada pengamatan</p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
