import { cn } from '@/lib/utils'

import { Cloud, SCENE } from './parts'

export function DriftingClouds({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 420"
      preserveAspectRatio="xMidYMin slice"
      className={cn('block size-full', className)}
    >
      <g className="motion-safe:animate-drift">
        <Cloud x={-150} y={0} width={300} />
        <Cloud x={1040} y={52} width={330} />
        <Cloud x={1120} y={250} width={170} opacity={0.75} />
      </g>
      <g className="motion-safe:animate-drift-slow">
        <Cloud x={520} y={-6} width={210} opacity={0.9} />
        <Cloud x={-60} y={300} width={190} opacity={0.7} />
      </g>
    </svg>
  )
}

const BANK = [
  [80, 132, 86],
  [230, 112, 104],
  [400, 136, 88],
  [580, 110, 110],
  [770, 134, 92],
  [950, 112, 106],
  [1130, 136, 90],
  [1310, 116, 104],
  [1450, 136, 80],
] as const

const BANK_BACK = [
  [150, 104, 74],
  [490, 98, 80],
  [860, 102, 76],
  [1220, 96, 82],
] as const

export function CloudBank({
  className,
  floorColor = 'var(--color-background)',
}: {
  className?: string
  floorColor?: string
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 200"
      preserveAspectRatio="xMidYMax slice"
      className={cn('block w-full', className)}
    >
      <g fill={SCENE.cloud} opacity="0.7">
        {BANK_BACK.map(([cx, cy, r]) => (
          <circle key={cx} cx={cx} cy={cy} r={r} />
        ))}
      </g>
      <g fill={floorColor}>
        {BANK.map(([cx, cy, r]) => (
          <circle key={cx} cx={cx} cy={cy} r={r} />
        ))}
      </g>
      <rect y="168" width="1440" height="32" fill={floorColor} />
    </svg>
  )
}
