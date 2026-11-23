import { Suspense, type ReactNode } from 'react'

import { AccountCard } from '@/components/layout/account-card'
import { AppShell, AppShellFallback } from '@/components/layout/app-shell'
import { appNavFor } from '@/config/site'
import type { Role } from '@/config/permissions'
import { SignOutButton } from '@/features/auth'
import { isPreviewUser, requireRole, requireUser } from '@/lib/auth/guards'

type AuthenticatedShellProps = {
  areaLabel: string
  roles?: Role[]
  children: ReactNode
}

async function Shell({ areaLabel, roles, children }: AuthenticatedShellProps) {
  const user = roles ? await requireRole(...roles) : await requireUser()
  const groups = [appNavFor[user.role]]

  return (
    <AppShell
      areaLabel={areaLabel}
      groups={groups}
      notice={
        isPreviewUser(user) && (
          <p className="mx-4 mb-6 rounded-xl bg-surface px-4 py-3 text-sm text-slate md:mx-8">
            Mode pratinjau: Supabase belum dikonfigurasi, jadi semua data masih kosong.
          </p>
        )
      }
      account={
        <AccountCard
          name={user.fullName}
          email={user.email}
          role={user.role}
          action={
            !isPreviewUser(user) && (
              <SignOutButton className="flex h-9 w-full items-center justify-center gap-2 rounded-full border border-line text-sm text-ink transition-colors outline-none hover:bg-surface focus-visible:ring-3 focus-visible:ring-ring/50" />
            )
          }
        />
      }
    >
      {children}
    </AppShell>
  )
}

export function AuthenticatedShell(props: AuthenticatedShellProps) {
  return (
    <Suspense fallback={<AppShellFallback />}>
      <Shell {...props} />
    </Suspense>
  )
}
