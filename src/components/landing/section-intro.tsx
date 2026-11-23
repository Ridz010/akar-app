import type { ReactNode } from 'react'

import { Reveal } from '@/components/motion/reveal'
import { cn } from '@/lib/utils'

type SectionIntroProps = {
  id: string
  label: string
  title: ReactNode
  description?: ReactNode
  tone?: 'light' | 'dark'
  align?: 'split' | 'stack'
  className?: string
}

export function SectionIntro({
  id,
  label,
  title,
  description,
  tone = 'light',
  align = 'split',
  className,
}: SectionIntroProps) {
  const dark = tone === 'dark'
  return (
    <Reveal
      className={cn(
        'grid gap-4',
        align === 'split' && 'md:grid-cols-[1fr_3fr] md:gap-12',
        className,
      )}
    >
      <p className={cn('text-sm md:pt-4', dark ? 'text-lime-300' : 'text-sage-700')}>{label}</p>
      <div className="max-w-3xl">
        <h2 id={id} className={cn('type-title', dark ? 'text-white' : 'text-ink')}>
          {title}
        </h2>
        {description && (
          <p className={cn('mt-5 max-w-xl sm:text-lg', dark ? 'text-white/80' : 'text-slate')}>
            {description}
          </p>
        )}
      </div>
    </Reveal>
  )
}
