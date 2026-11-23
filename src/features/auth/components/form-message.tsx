import { CircleAlert, MailCheck } from 'lucide-react'

import type { AuthFormState } from '../types'

export function FormMessage({ state }: { state: AuthFormState }) {
  if (!state.message) return null
  const success = state.status === 'success'
  const Icon = success ? MailCheck : CircleAlert
  return (
    <p
      role={success ? 'status' : 'alert'}
      className={
        success
          ? 'flex gap-2 rounded-xl bg-verified-bg p-3 text-sm text-verified'
          : 'flex gap-2 rounded-xl bg-rejected-bg p-3 text-sm text-rejected'
      }
    >
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      {state.message}
    </p>
  )
}
