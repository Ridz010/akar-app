import Link from 'next/link'

import { Logo } from '@/components/shared/logo'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <main className="container-page flex min-h-svh flex-1 flex-col justify-between py-8">
      <Logo className="h-9" />
      <div className="max-w-2xl py-16">
        <p className="text-sm text-slate">404</p>
        <h1 className="mt-4 type-display text-ink">Halaman tidak ditemukan</h1>
        <p className="mt-6 max-w-md text-lg text-slate">
          Halaman yang kamu cari mungkin sudah dipindahkan atau tidak pernah ada.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants(), 'mt-10 h-12 rounded-full px-6 text-base font-normal')}
        >
          Kembali ke beranda
        </Link>
      </div>
      <span />
    </main>
  )
}
