import type { ReactNode } from 'react'

import { Reveal } from '@/components/motion/reveal'
import { cn } from '@/lib/utils'

type PageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <Reveal
      className={cn(
        'flex flex-col gap-5 pb-2 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="max-w-2xl space-y-3">
        <h1 className="text-4xl leading-[1.05] text-ink sm:text-5xl">{title}</h1>
        {description && <p className="text-slate sm:text-lg">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </Reveal>
  )
}
