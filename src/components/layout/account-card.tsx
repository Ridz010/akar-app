import type { ReactNode } from 'react'

import { ROLE_LABELS, type Role } from '@/config/permissions'

type AccountCardProps = {
  name: string | null
  email: string | null
  role: Role
  action: ReactNode
}

export function AccountCard({ name, email, role, action }: AccountCardProps) {
  const display = name || email || 'Mode pratinjau'
  return (
    <div className="space-y-3 rounded-2xl border border-line bg-white p-3">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sm text-sage-800"
        >
          {display.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm text-ink">{display}</p>
          <p className="truncate text-xs text-slate">{ROLE_LABELS[role]}</p>
        </div>
      </div>
      {action}
    </div>
  )
}
