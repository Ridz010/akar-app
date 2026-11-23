import { cn } from '@/lib/utils'

import { Cloud } from './parts'

export function CloudCluster({
  className,
  tone = 'tint',
  mirrored = false,
}: {
  className?: string
  tone?: 'white' | 'tint'
  mirrored?: boolean
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 360 160"
      className={cn('block h-auto', mirrored && '-scale-x-100', className)}
    >
      <g className="motion-safe:animate-drift">
        <Cloud x={20} y={20} width={220} tone={tone} />
      </g>
      <g className="motion-safe:animate-drift-slow">
        <Cloud x={190} y={86} width={150} tone={tone} opacity={0.85} />
      </g>
    </svg>
  )
}
