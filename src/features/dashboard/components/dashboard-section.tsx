import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Reveal } from '@/components/motion/reveal'

type DashboardSectionProps = {
  title: string
  href?: string
  linkLabel?: string
  empty?: string
  children?: ReactNode
}

export function DashboardSection({
  title,
  href,
  linkLabel,
  empty,
  children,
}: DashboardSectionProps) {
  return (
    <Reveal className="flex flex-col">
      <div className="flex items-end justify-between gap-4 pb-4">
        <h2 className="text-2xl text-ink">{title}</h2>
        {href && linkLabel && (
          <Link
            href={href}
            className="group inline-flex items-center gap-1.5 rounded-full text-sm text-sage-700 outline-none hover:text-sage-900 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {linkLabel}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </div>
      {children ?? <p className="border-y border-line py-8 text-slate">{empty}</p>}
    </Reveal>
  )
}
