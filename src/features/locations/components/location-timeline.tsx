import { StatusBadge } from '@/components/shared/status-badge'
import { SITE_CONDITION_LABELS } from '@/config/constants'
import { formatDate } from '@/lib/format'

import type { LocationHistory } from '../types'

export function LocationTimeline({ entries }: { entries: LocationHistory['entries'] }) {
  return (
    <ol className="relative space-y-8 border-l border-line pl-6">
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span
            aria-hidden
            className="absolute top-2 -left-[1.6rem] size-2.5 rounded-full border-2 border-white bg-sage-600"
          />
          <p className="text-sm text-slate">{formatDate(entry.observedAt)}</p>
          <p className="mt-1 text-xl text-ink">
            {SITE_CONDITION_LABELS[entry.condition]}
            {entry.speciesName && <span className="text-slate"> · {entry.speciesName}</span>}
          </p>
          <StatusBadge status={entry.status} className="mt-2" />
        </li>
      ))}
    </ol>
  )
}
