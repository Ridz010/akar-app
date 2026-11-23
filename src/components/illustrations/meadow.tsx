import { cn } from '@/lib/utils'

import { SCENE } from './parts'

const BLADES = [40, 92, 150, 214, 268, 330, 388, 446, 502, 560]
const FLOWERS = [
  [70, 52, '#ffffff'],
  [180, 58, '#f1b04f'],
  [300, 50, '#ffffff'],
  [420, 56, '#f1b04f'],
  [520, 50, '#ffffff'],
] as const

export function Meadow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 600 90"
      preserveAspectRatio="xMidYMax slice"
      className={cn('block w-full', className)}
    >
      <path d="M0 46C120 26 230 40 330 34S520 22 600 36V90H0Z" fill={SCENE.hillFar} />
      <path d="M0 60C140 44 260 62 380 54S540 44 600 54V90H0Z" fill={SCENE.hillNear} />
      <g stroke={SCENE.leaf} strokeWidth="2" strokeLinecap="round" fill="none">
        {BLADES.map((x) => (
          <path key={x} d={`M${x} 64q-2-10 -6-14M${x} 64q1-12 4-16M${x} 64q3-8 8-10`} />
        ))}
      </g>
      {FLOWERS.map(([cx, cy, fill]) => (
        <circle key={cx} cx={cx} cy={cy} r="3" fill={fill} />
      ))}
    </svg>
  )
}
