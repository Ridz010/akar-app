import Link from 'next/link'

import CountUp from '@/components/motion/CountUp'
import { Reveal } from '@/components/motion/reveal'
import { StatusBadge } from '@/components/shared/status-badge'
import { OBSERVATION_STATUSES, type ObservationStatus } from '@/config/constants'
import { cn } from '@/lib/utils'

const TINTS: Record<ObservationStatus, string> = {
  pending: 'from-pending-bg/70',
  verified: 'from-verified-bg/80',
  revision_required: 'from-revision-bg/70',
  rejected: 'from-rejected-bg/60',
}

const HINTS: Record<ObservationStatus, string> = {
  pending: 'Sedang menunggu diperiksa pengelola.',
  verified: 'Sudah tampil di peta publik.',
  revision_required: 'Perlu kamu lengkapi kembali.',
  rejected: 'Tidak dapat digunakan.',
}

export function StatusSummary({ counts }: { counts: Record<ObservationStatus, number> }) {
  return (
    <Reveal stagger={0.06} className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {OBSERVATION_STATUSES.map((status) => (
        <Link
          key={status}
          href={`/observations?status=${status}`}
          className={cn(
            'group flex flex-col justify-between gap-8 rounded-[1.25rem] bg-linear-to-br to-white p-5 ring-1 ring-line transition-[box-shadow,translate] duration-300 outline-none hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-24px_rgba(28,38,29,0.45)] focus-visible:ring-3 focus-visible:ring-ring/50 sm:p-6',
            TINTS[status],
          )}
        >
          <StatusBadge status={status} className="self-start" />
          <div>
            <p className="font-display text-5xl leading-none text-ink">
              <CountUp to={counts[status]} duration={0.6} />
            </p>
            <p className="mt-2 text-sm text-slate">{HINTS[status]}</p>
          </div>
        </Link>
      ))}
    </Reveal>
  )
}
