'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense, useEffect, useState, type CSSProperties } from 'react'

import GooeyNav from '@/components/motion/GooeyNav'
import { Logo } from '@/components/shared/logo'
import { buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { landingNav } from '@/config/site'
import { cn } from '@/lib/utils'

const WATER_SPLASH = ['#2f7fb8', '#5ba8d9', '#8fcbea', '#bde6f7']

const FRAME_OVER_PHOTO = {
  '--gn-frame': 'rgba(20, 30, 22, 0.32)',
  '--gn-frame-edge': 'rgba(255, 255, 255, 0.18)',
  '--gn-frame-highlight': 'rgba(255, 255, 255, 0.12)',
  '--gn-ink': '#ffffff',
  '--gn-muted': 'rgba(255, 255, 255, 0.82)',
} as CSSProperties

const FRAME_ON_PAPER = {
  '--gn-frame': 'rgba(243, 246, 242, 0.92)',
  '--gn-frame-edge': 'rgba(24, 33, 26, 0.08)',
  '--gn-frame-highlight': 'rgba(255, 255, 255, 1)',
  '--gn-ink': '#18211a',
  '--gn-muted': '#5e6a60',
} as CSSProperties

function useScrolled(threshold: number) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [threshold])
  return scrolled
}

function useSectionInView(id: string, enabled: boolean) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!enabled) return
    const update = () => {
      const section = document.getElementById(id)
      if (!section) return setInView(false)
      const { top, bottom } = section.getBoundingClientRect()
      const line = window.innerHeight * 0.4
      setInView(top < line && bottom > line)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [id, enabled])
  return enabled && inView
}

function activeIndexFor(pathname: string | null, featuresInView: boolean) {
  if (pathname === '/') return featuresInView ? 1 : 0
  const index = landingNav.findIndex(
    (item) => item.href !== '/' && !item.href.includes('#') && pathname?.startsWith(item.href),
  )
  return index === -1 ? 0 : index
}

function NavbarView({ pathname }: { pathname: string | null }) {
  const isHome = pathname === '/'
  const scrolled = useScrolled(24)
  const featuresInView = useSectionInView('fitur', isHome)
  const [open, setOpen] = useState(false)
  const overPhoto = isHome && !scrolled

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500 ease-out-soft',
        overPhoto
          ? 'bg-transparent'
          : 'bg-white/90 shadow-[0_1px_0_0_var(--color-line)] backdrop-blur-md',
      )}
    >
      <nav
        aria-label="Navigasi utama"
        className="container-page grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 sm:h-20"
      >
        <Logo variant={overPhoto ? 'white' : 'color'} className="h-9" />

        <div className="hidden justify-center md:flex">
          <GooeyNav
            items={landingNav.map((item) => ({ label: item.title, href: item.href }))}
            activeIndex={activeIndexFor(pathname, featuresInView)}
            theme={overPhoto ? 'dark' : 'light'}
            color={overPhoto ? '#ffffff' : '#2b3a2d'}
            activeTextColor={overPhoto ? '#18211a' : '#ffffff'}
            colors={WATER_SPLASH}
            particleCount={18}
            spread={64}
            animationTime={560}
            style={overPhoto ? FRAME_OVER_PHOTO : FRAME_ON_PAPER}
          />
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="/login"
            className={cn(
              'rounded-full px-4 py-2 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
              overPhoto ? 'text-white hover:bg-white/15' : 'text-ink hover:bg-surface',
            )}
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className={cn(
              'inline-flex h-10 items-center rounded-full px-5 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
              overPhoto
                ? 'bg-white text-ink hover:bg-white/90'
                : 'bg-sage-900 text-white hover:bg-sage-800',
            )}
          >
            Daftar
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Buka menu"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon-lg' }),
              'col-start-3 justify-self-end rounded-full md:hidden',
              overPhoto ? 'text-white hover:bg-white/15 hover:text-white' : 'text-ink',
            )}
          >
            <Menu aria-hidden className="size-6" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] max-w-xs gap-0 p-6">
            <SheetHeader className="p-0">
              <SheetTitle>
                <Logo href={null} />
              </SheetTitle>
              <SheetDescription className="sr-only">Menu navigasi AKAR</SheetDescription>
            </SheetHeader>
            <ul className="mt-8 flex flex-col">
              {landingNav.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-4 text-2xl font-light text-ink outline-none focus-visible:text-sage-700"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-2 pt-8">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: 'outline' }), 'h-11 rounded-full')}
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-full bg-sage-900 text-sm text-white"
              >
                Daftar
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}

function NavbarWithPathname() {
  return <NavbarView pathname={usePathname()} />
}

export function SiteNavbar() {
  return (
    <Suspense fallback={<NavbarView pathname={null} />}>
      <NavbarWithPathname />
    </Suspense>
  )
}
