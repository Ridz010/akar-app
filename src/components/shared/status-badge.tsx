import { BadgeCheck, CircleDashed, Clock, PencilLine, XCircle, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export type StatusBadgeStatus =
  'pending' | 'verified' | 'revision_required' | 'rejected' | 'prediction'

const STATUS: Record<StatusBadgeStatus, { label: string; icon: LucideIcon; className: string }> = {
  pending: { label: 'Menunggu verifikasi', icon: Clock, className: 'bg-pending-bg text-pending' },
  verified: { label: 'Terverifikasi', icon: BadgeCheck, className: 'bg-verified-bg text-verified' },
  revision_required: {
    label: 'Perlu revisi',
    icon: PencilLine,
    className: 'bg-revision-bg text-revision',
  },
  rejected: { label: 'Ditolak', icon: XCircle, className: 'bg-rejected-bg text-rejected' },
  prediction: {
    label: 'Prediksi awal',
    icon: CircleDashed,
    className: 'bg-prediction-bg text-prediction',
  },
}

type StatusBadgeProps = {
  status: StatusBadgeStatus
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const { label: defaultLabel, icon: Icon, className: tone } = STATUS[status]
  return (
    <span
      data-status={status}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        tone,
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5" />
      {label ?? defaultLabel}
    </span>
  )
}
