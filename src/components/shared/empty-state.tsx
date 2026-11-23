import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title: string
  description: string
  points?: string[]
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, points, action, className }: EmptyStateProps) {
  return (
    <section
      className={cn(
        'grid gap-8 rounded-[1.25rem] border border-line bg-paper p-6 sm:p-10 lg:grid-cols-[1fr_1fr] lg:gap-16',
        className,
      )}
    >
      <div className="max-w-md">
        <h2 className="text-2xl leading-tight text-ink sm:text-3xl">{title}</h2>
        <p className="mt-3 text-slate">{description}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
      {points && points.length > 0 && (
        <ol className="divide-y divide-line border-y border-line">
          {points.map((point) => (
            <li key={point} className="flex gap-5 py-4 text-sm text-ink">
              <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-sage-500" />
              {point}
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
