import { cn } from '@/lib/utils'

import { Cloud, MangroveTree, Ripple, SCENE, Sun } from './parts'

type ShoreHorizonProps = {
  className?: string
  floorColor?: string
}

const TREES = [
  { x: 24, base: 300, width: 170 },
  { x: 176, base: 304, width: 112 },
  { x: 372, base: 318, width: 88 },
  { x: 610, base: 296, width: 100 },
  { x: 880, base: 314, width: 120 },
  { x: 1090, base: 298, width: 158 },
  { x: 1250, base: 306, width: 110 },
]

export function ShoreHorizon({
  className,
  floorColor = 'var(--color-background)',
}: ShoreHorizonProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 360"
      preserveAspectRatio="xMidYMax slice"
      className={cn('block w-full', className)}
    >
      <defs>
        <linearGradient id="shore-horizon-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SCENE.seaTop} />
          <stop offset="1" stopColor={SCENE.seaBottom} />
        </linearGradient>
      </defs>
      <Sun cx={790} cy={92} r={38} />
      <g className="motion-safe:animate-drift">
        <Cloud x={110} y={36} width={210} />
        <Cloud x={420} y={24} width={160} opacity={0.9} />
        <Cloud x={1150} y={40} width={180} opacity={0.85} />
      </g>
      <path
        d="M0 214C160 168 300 184 440 204S740 168 920 200s360-36 520 4V360H0Z"
        fill={SCENE.hillFar}
      />
      <path d="M0 240C220 210 380 236 580 228s520-34 860 6V360H0Z" fill={SCENE.hillNear} />
      <rect y="252" width="1440" height="108" fill="url(#shore-horizon-sea)" />
      <Ripple x={60} y={288} />
      <Ripple x={480} y={312} />
      <Ripple x={1010} y={282} />
      <Ripple x={1230} y={318} />
      {TREES.map((tree) => (
        <MangroveTree key={tree.x} {...tree} />
      ))}
      <path d="M0 330C240 312 460 346 720 332S1180 312 1440 330V360H0Z" fill={floorColor} />
    </svg>
  )
}
