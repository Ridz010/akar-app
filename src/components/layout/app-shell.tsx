import type { CSSProperties, ReactNode } from 'react'

import { CanopyBackdrop } from '@/components/illustrations/canopy-backdrop'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

import { AppSidebar, type NavGroup } from './app-sidebar'

type AppShellProps = {
  groups: NavGroup[]
  areaLabel: string
  account: ReactNode
  notice?: ReactNode
  children: ReactNode
}

export function AppShell({ groups, areaLabel, account, notice, children }: AppShellProps) {
  return (
    <SidebarProvider style={{ '--sidebar-width': '15.5rem' } as CSSProperties}>
      <AppSidebar groups={groups} account={account} />
      <SidebarInset className="relative isolate overflow-hidden bg-white">
        <CanopyBackdrop />
        <header className="flex h-16 shrink-0 items-center gap-3 px-4 md:px-8">
          <SidebarTrigger
            className="-ml-1 rounded-full"
            aria-label="Buka atau tutup menu samping"
          />
          <span className="rounded-full bg-white/70 px-3 py-1 text-sm text-slate ring-1 ring-line backdrop-blur">
            {areaLabel}
          </span>
        </header>
        {notice}
        <div className="flex flex-1 flex-col gap-10 px-4 pb-16 md:px-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export function AppShellFallback() {
  return (
    <div className="flex min-h-svh flex-1">
      <div className="hidden w-62 shrink-0 bg-sidebar md:block" />
      <div className="flex flex-1 flex-col gap-6 p-8">
        <div className="h-72 animate-pulse rounded-[1.5rem] bg-surface" />
        <div className="h-40 animate-pulse rounded-[1.25rem] bg-surface" />
      </div>
    </div>
  )
}
