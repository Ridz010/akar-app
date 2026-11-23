import { cn } from '@/lib/utils'

import { MangroveSilhouette } from './parts'

const BACK_ROW = [
  { x: -20, base: 438, width: 150 },
  { x: 250, base: 440, width: 120 },
  { x: 520, base: 445, width: 140 },
  { x: 820, base: 448, width: 150 },
  { x: 1080, base: 455, width: 140 },
  { x: 1300, base: 446, width: 150 },
]

const MID_ROW = [
  { x: 110, base: 543, width: 170 },
  { x: 400, base: 538, width: 150 },
  { x: 700, base: 565, width: 180 },
  { x: 960, base: 548, width: 150 },
  { x: 1220, base: 552, width: 160 },
]

const FRONT_ROW = [
  { x: -40, base: 680, width: 240 },
  { x: 1240, base: 715, width: 260 },
]

const FIREFLIES = [
  [330, 330, 3, 0],
  [620, 260, 2.5, 1.2],
  [900, 310, 3, 2.1],
  [1120, 240, 2, 0.6],
  [200, 250, 2, 1.7],
  [1340, 330, 2.5, 2.6],
  [760, 380, 2, 3.1],
] as const

export function NightForest({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 640"
      preserveAspectRatio="xMidYMax slice"
      className={cn('block w-full', className)}
    >
      <defs>
        <linearGradient id="night-forest-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fd68a" stopOpacity="0" />
          <stop offset="1" stopColor="#9fd68a" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <circle cx="1180" cy="150" r="150" fill="#d4ee8f" opacity="0.05" />
      <circle cx="1180" cy="150" r="70" fill="#d4ee8f" opacity="0.07" />
      <path
        d="M0 400C150 340 300 370 450 350S760 300 900 345s300 20 540-15V640H0Z"
        fill="#2d4535"
      />
      {BACK_ROW.map((tree) => (
        <MangroveSilhouette key={tree.x} {...tree} color="#2f4636" />
      ))}
      <rect y="330" width="1440" height="310" fill="url(#night-forest-mist)" />
      {MID_ROW.map((tree) => (
        <MangroveSilhouette key={tree.x} {...tree} color="#34503c" />
      ))}
      <path d="M0 560C220 540 420 575 680 558S1130 540 1440 562V640H0Z" fill="#243a2d" />
      {FRONT_ROW.map((tree) => (
        <MangroveSilhouette key={tree.x} {...tree} color="#3c5c45" />
      ))}
      <g fill="#d4ee8f">
        {FIREFLIES.map(([cx, cy, r, delay]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={r}
            className="motion-safe:animate-twinkle"
            style={{ animationDelay: `${delay}s` }}
            opacity="0.7"
          />
        ))}
      </g>
    </svg>
  )
}

const LEAVES = [
  { left: '6%', size: 22, duration: 19, delay: -2, tone: '#9fcf7a' },
  { left: '18%', size: 16, duration: 24, delay: -11, tone: '#cfea5e' },
  { left: '31%', size: 26, duration: 21, delay: -6, tone: '#6aad74' },
  { left: '47%', size: 14, duration: 27, delay: -17, tone: '#9fcf7a' },
  { left: '58%', size: 20, duration: 22, delay: -9, tone: '#cfea5e' },
  { left: '72%', size: 24, duration: 20, delay: -14, tone: '#6aad74' },
  { left: '84%', size: 18, duration: 25, delay: -4, tone: '#9fcf7a' },
  { left: '94%', size: 15, duration: 23, delay: -19, tone: '#cfea5e' },
]

export function FallingLeaves({
  className,
  count = LEAVES.length,
}: {
  className?: string
  count?: number
}) {
  return (
    <div
      aria-hidden
      className={cn(
        '[container-type:size] pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden',
        className,
      )}
    >
      {LEAVES.slice(0, count).map((leaf) => (
        <span
          key={leaf.left}
          className="absolute -top-10 animate-leaf-fall"
          style={{
            left: leaf.left,
            animationDuration: `${leaf.duration}s`,
            animationDelay: `${leaf.delay}s`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={leaf.size}
            height={leaf.size}
            className="animate-leaf-sway"
            style={{ animationDuration: `${leaf.duration / 6}s` }}
          >
            <path d="M3 21C3 10 10 3 21 3c0 11-7 18-18 18Z" fill={leaf.tone} opacity="0.75" />
            <path
              d="M4.5 19.5L17 7"
              stroke="#1c261d"
              strokeOpacity="0.35"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ))}
    </div>
  )
}
