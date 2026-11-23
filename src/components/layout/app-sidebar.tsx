'use client'

import {
  BadgeCheck,
  BookOpen,
  CalendarHeart,
  ClipboardList,
  History,
  LayoutGrid,
  Map,
  ScanLine,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense, type ReactNode } from 'react'

import { SidebarSprig } from '@/components/illustrations/canopy-backdrop'
import { Logo } from '@/components/shared/logo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import type { NavIcon, NavItem } from '@/config/site'

const ICONS: Record<NavIcon, LucideIcon> = {
  dashboard: LayoutGrid,
  scanner: ScanLine,
  map: Map,
  learn: BookOpen,
  observations: ClipboardList,
  locations: History,
  activities: CalendarHeart,
  verification: BadgeCheck,
  users: Users,
  profile: UserRound,
}

export type NavGroup = { label: string; items: NavItem[] }

function NavMenu({ items, pathname }: { items: NavItem[]; pathname: string | null }) {
  return (
    <SidebarMenu className="gap-0.5">
      {items.map((item) => {
        const Icon = item.icon ? ICONS[item.icon] : undefined
        const active =
          pathname !== null && (pathname === item.href || pathname.startsWith(`${item.href}/`))
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={active}
              tooltip={item.title}
              className="h-10 rounded-xl px-3 text-[0.9375rem] text-slate hover:text-ink data-active:bg-sage-900 data-active:font-normal data-active:text-white"
              render={<Link href={item.href} aria-current={active ? 'page' : undefined} />}
            >
              {Icon && <Icon aria-hidden strokeWidth={1.6} />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

function ActiveNavMenu({ items }: { items: NavItem[] }) {
  return <NavMenu items={items} pathname={usePathname()} />
}

type AppSidebarProps = {
  groups: NavGroup[]
  account: ReactNode
}

export function AppSidebar({ groups, account }: AppSidebarProps) {
  return (
    <Sidebar
      variant="inset"
      className="border-none [&>[data-slot=sidebar-inner]]:relative [&>[data-slot=sidebar-inner]]:isolate"
    >
      <SidebarSprig />
      <SidebarHeader className="px-4 pt-5 pb-6">
        <Logo className="h-9" />
      </SidebarHeader>
      <SidebarContent className="gap-4">
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="px-3 text-xs font-normal text-slate">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <Suspense fallback={<NavMenu items={group.items} pathname={null} />}>
                <ActiveNavMenu items={group.items} />
              </Suspense>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-3">{account}</SidebarFooter>
    </Sidebar>
  )
}
