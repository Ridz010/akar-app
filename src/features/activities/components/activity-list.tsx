import { ACTIVITY_STATUS_LABELS } from '@/config/constants'
import { formatDate } from '@/lib/format'

import { joinActivity, leaveActivity } from '../actions'
import type { ActivitySummary } from '../types'

type ActivityListProps = {
  items: ActivitySummary[]
  joinable?: boolean
  joinedIds?: string[]
}

export function ActivityList({ items, joinable = false, joinedIds = [] }: ActivityListProps) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((activity) => (
        <li
          key={activity.id}
          className="grid gap-4 py-5 sm:grid-cols-[5rem_1fr_auto] sm:items-center"
        >
          <p className="leading-none text-ink">
            <span className="block font-display text-4xl tabular-nums">
              {formatDate(activity.startsAt, 'day')}
            </span>
            <span className="text-sm text-slate">{formatDate(activity.startsAt, 'monthYear')}</span>
          </p>
          <div className="min-w-0">
            <p className="text-lg text-ink">{activity.title}</p>
            <p className="mt-1 text-sm text-slate">
              {ACTIVITY_STATUS_LABELS[activity.status]}
              {activity.locationName && ` · ${activity.locationName}`}
              {` · ${formatDate(activity.startsAt, 'time')} WIB`}
            </p>
          </div>
          {joinable && (
            <form action={joinedIds.includes(activity.id) ? leaveActivity : joinActivity}>
              <input type="hidden" name="activityId" value={activity.id} />
              {joinedIds.includes(activity.id) ? (
                <button
                  type="submit"
                  className="h-10 rounded-full bg-verified-bg px-4 text-sm text-verified transition-colors outline-none hover:bg-rejected-bg hover:text-rejected focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  Terdaftar · batal ikut
                </button>
              ) : (
                <button
                  type="submit"
                  className="h-10 rounded-full border border-line px-4 text-sm text-ink transition-colors outline-none hover:bg-surface focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  Ikut serta
                </button>
              )}
            </form>
          )}
        </li>
      ))}
    </ul>
  )
}
