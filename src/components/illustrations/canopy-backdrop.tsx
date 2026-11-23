import { cn } from '@/lib/utils'

import { FallingLeaves } from './night-forest'
import { MangroveSilhouette, SCENE } from './parts'

const LEAF_PATH = 'M0 0C10-11 32-12 48 0C32 12 10 11 0 0Z'

const BRANCH_LEAVES = [
  { x: 262, y: 26, angle: 150, scale: 1.05, tone: SCENE.leaf },
  { x: 236, y: 52, angle: 205, scale: 0.95, tone: SCENE.leafLight },
  { x: 214, y: 70, angle: 140, scale: 1.1, tone: SCENE.leaf },
  { x: 190, y: 96, angle: 215, scale: 0.9, tone: SCENE.leafLight },
  { x: 170, y: 116, angle: 135, scale: 1, tone: SCENE.leaf },
  { x: 150, y: 142, angle: 200, scale: 0.85, tone: SCENE.leafLight },
  { x: 132, y: 162, angle: 150, scale: 0.8, tone: SCENE.leaf },
  { x: 118, y: 186, angle: 178, scale: 0.7, tone: SCENE.leafLight },
]

function LeafBranch({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 320 240" className={cn('block h-auto', className)}>
      <path
        d="M320 4C280 30 240 60 205 98S150 168 112 204"
        fill="none"
        stroke={SCENE.trunk}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      {BRANCH_LEAVES.map((leaf) => (
        <g
          key={`${leaf.x}-${leaf.y}`}
          transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle}) scale(${leaf.scale})`}
        >
          <path d={LEAF_PATH} fill={leaf.tone} opacity="0.26" />
          <path d="M2 0H44" stroke={SCENE.leaf} strokeWidth="1" opacity="0.3" />
        </g>
      ))}
    </svg>
  )
}

const BASE_TREES = [
  { x: -20, base: 200, width: 150 },
  { x: 110, base: 210, width: 110 },
  { x: 1180, base: 205, width: 130 },
  { x: 1300, base: 212, width: 160 },
]

export function CanopyBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-[34rem]"
        style={{
          background:
            'radial-gradient(60rem 26rem at 100% 0%, rgba(207, 234, 94, 0.16), transparent 70%), radial-gradient(48rem 22rem at 70% 0%, rgba(91, 115, 92, 0.12), transparent 70%), linear-gradient(180deg, rgba(243, 246, 242, 0.9), rgba(255, 255, 255, 0))',
        }}
      />
      <div className="absolute -top-2 -right-4 w-[min(22rem,48vw)] origin-top-right motion-safe:animate-sway">
        <LeafBranch />
      </div>
      <FallingLeaves count={4} className="opacity-40" />
      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-40 w-full opacity-[0.07]"
      >
        {BASE_TREES.map((tree) => (
          <MangroveSilhouette key={tree.x} {...tree} color={SCENE.leaf} />
        ))}
        <path d="M0 196C260 182 520 206 760 196S1180 184 1440 198V220H0Z" fill={SCENE.leaf} />
      </svg>
    </div>
  )
}

export function SidebarSprig() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-t from-sage-100/70 to-transparent" />
      <svg
        viewBox="0 0 240 160"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-40 w-full opacity-[0.12]"
      >
        <MangroveSilhouette x={-24} base={168} width={120} color={SCENE.leaf} />
        <MangroveSilhouette x={120} base={172} width={150} color={SCENE.leaf} />
      </svg>
    </div>
  )
}
