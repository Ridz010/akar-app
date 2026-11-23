import Link from 'next/link'

import { FallingLeaves } from '@/components/illustrations/night-forest'
import { CurrentYear } from '@/components/shared/current-year'
import { Logo } from '@/components/shared/logo'
import { landingNav, siteConfig } from '@/config/site'

const footerLink =
  'rounded-sm text-white/75 transition-colors outline-none hover:text-white focus-visible:ring-3 focus-visible:ring-white/50'

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-sage-950 text-white">
      <FallingLeaves count={5} className="-z-10 opacity-60" />
      <div className="container-page grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr] md:py-20">
        <div className="space-y-6">
          <Logo variant="white" className="h-10" />
          <p className="max-w-sm font-display text-3xl leading-snug text-white/90">
            {siteConfig.tagline}.
          </p>
        </div>

        <nav aria-label="Navigasi footer">
          <h2 className="font-sans text-sm text-white/60">Jelajahi</h2>
          <ul className="mt-5 space-y-3">
            {landingNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={footerLink}>
                  {item.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/login" className={footerLink}>
                Masuk
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-sm text-white/60">Kontak</h2>
          {siteConfig.contactEmail ? (
            <a href={`mailto:${siteConfig.contactEmail}`} className={`${footerLink} mt-5 block`}>
              {siteConfig.contactEmail}
            </a>
          ) : (
            <p className="mt-5 text-white/75">Kontak resmi segera diumumkan.</p>
          )}
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-6 text-sm text-white/60">
          © <CurrentYear />
          AKAR · {siteConfig.taglineEn}
        </p>
      </div>
    </footer>
  )
}
