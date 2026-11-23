import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

type LogoProps = {
  variant?: 'color' | 'white'
  href?: string | null
  className?: string
}

export function Logo({ variant = 'color', href = '/', className }: LogoProps) {
  const mark = (
    <Image
      src={variant === 'white' ? '/icon/akar-logo-white.svg' : '/icon/akar-logo-transparent.svg'}
      alt="AKAR"
      width={113}
      height={85}
      loading="eager"
      className={cn('h-8 w-auto', className)}
    />
  )

  if (!href) return mark

  return (
    <Link
      href={href}
      aria-label="AKAR, kembali ke beranda"
      className="inline-flex rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {mark}
    </Link>
  )
}
