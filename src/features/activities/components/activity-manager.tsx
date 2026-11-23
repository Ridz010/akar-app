import { MapPin, Users } from 'lucide-react'

import { ACTIVITY_STATUSES, ACTIVITY_STATUS_LABELS } from '@/config/constants'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

import { updateActivityStatus } from '../actions'
import type { ActivityStatus, ManagedActivity } from '../types'

const STATUS_TONE: Record<ActivityStatus, string> = {
  planned: 'bg-surface text-ink ring-1 ring-line',
  ongoing: 'bg-lime-100 text-ink',
  completed: 'bg-verified-bg text-verified',
  cancelled: 'bg-rejected-bg text-rejected',
}

export function ActivityManager({ items }: { items: ManagedActivity[] }) {
  return (
    <ul className="space-y-4">
      {items.map((activity) => (
        <li key={activity.id} className="rounded-[1.5rem] bg-white p-5 ring-1 ring-line sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-slate">
                {formatDate(activity.startsAt, 'date')} · {formatDate(activity.startsAt, 'time')}{' '}
                WIB
                {activity.endsAt && ` – ${formatDate(activity.endsAt, 'time')} WIB`}
              </p>
              <h3 className="mt-1 font-display text-2xl leading-tight text-ink">
                {activity.title}
              </h3>
            </div>
            <span className={cn('rounded-full px-3 py-1 text-xs', STATUS_TONE[activity.status])}>
              {ACTIVITY_STATUS_LABELS[activity.status]}
            </span>
          </div>
          {activity.description && (
            <p className="mt-3 text-sm text-slate">{activity.description}</p>
          )}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink">
              <span className="inline-flex items-center gap-1.5">
                <Users aria-hidden className="size-4 text-sage-700" />
                {activity.participantCount} peserta
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden className="size-4 text-sage-700" />
                {activity.locationName ?? 'Lokasi belum ditentukan'}
              </span>
            </p>
            <form action={updateActivityStatus} className="flex items-center gap-2">
              <input type="hidden" name="activityId" value={activity.id} />
              <label htmlFor={`status-${activity.id}`} className="sr-only">
                Status {activity.title}
              </label>
              <select
                id={`status-${activity.id}`}
                name="status"
                defaultValue={activity.status}
                className="h-10 rounded-full border border-line bg-white px-3 text-sm text-ink outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {ACTIVITY_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {ACTIVITY_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="h-10 rounded-full bg-sage-900 px-4 text-sm text-white transition-colors outline-none hover:bg-sage-800 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Simpan
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  )
}
