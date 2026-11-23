import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteNavbar } from '@/components/layout/site-navbar'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#konten"
        className="sr-only z-60 rounded-full bg-white px-4 py-2 text-sm text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Lewati ke konten utama
      </a>
      <SiteNavbar />
      <main id="konten" className="flex flex-1 flex-col">
        {children}
      </main>
      <SiteFooter />
    </>
  )
}
