import { StatusBadge } from '@/components/shared/status-badge'
import { SITE_CONDITION_LABELS } from '@/config/constants'
import { formatDate } from '@/lib/format'

import type { ObservationSummary } from '../types'

export function ObservationList({ items }: { items: ObservationSummary[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <li
          key={item.id}
          className="grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6"
        >
          <div className="min-w-0">
            <p className="truncate text-lg text-ink">
              {item.speciesName ?? 'Spesies belum ditetapkan'}
            </p>
            <p className="mt-1 text-sm text-slate">
              {formatDate(item.observedAt)}
              {item.locationName && ` · ${item.locationName}`}
              {` · ${SITE_CONDITION_LABELS[item.condition]}`}
            </p>
          </div>
          <StatusBadge status={item.status} className="justify-self-start" />
        </li>
      ))}
    </ul>
  )
}
