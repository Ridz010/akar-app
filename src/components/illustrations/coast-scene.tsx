import { cn } from '@/lib/utils'

import { Cloud, Crab, Fish, MangroveTree, Ripple, SCENE, Sun } from './parts'

const TREES = [
  { x: 20, base: 384, width: 196 },
  { x: 190, base: 396, width: 128 },
  { x: 1170, base: 388, width: 176 },
  { x: 1320, base: 400, width: 112 },
]

export function CoastScene({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 480"
      preserveAspectRatio="xMidYMax slice"
      className={cn('block w-full', className)}
    >
      <defs>
        <linearGradient id="coast-scene-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SCENE.seaTop} />
          <stop offset="1" stopColor={SCENE.seaBottom} />
        </linearGradient>
      </defs>
      <Sun cx={1250} cy={60} r={36} />
      <g className="motion-safe:animate-drift-slow">
        <Cloud x={140} y={20} width={190} />
        <Cloud x={860} y={56} width={150} opacity={0.85} />
      </g>
      <path d="M0 176C160 150 300 168 460 160S800 140 1440 166V480H0Z" fill={SCENE.hillFar} />
      <rect y="180" width="1440" height="300" fill="url(#coast-scene-sea)" />
      <Ripple x={90} y={226} width={160} />
      <Ripple x={520} y={212} width={160} />
      <Ripple x={900} y={246} width={160} />
      <Ripple x={330} y={276} width={160} />
      <Ripple x={1040} y={300} width={140} />
      <Fish x={700} y={258} width={44} opacity={0.9} />
      <Fish x={780} y={286} width={30} opacity={0.8} />
      <path
        d="M0 352C200 326 420 382 640 364S1000 326 1440 352V480H0Z"
        fill={SCENE.wave}
        opacity="0.55"
      />
      {TREES.map((tree) => (
        <MangroveTree key={tree.x} {...tree} />
      ))}
      <path d="M0 380C240 352 460 400 700 386S1040 362 1440 386V480H0Z" fill={SCENE.sand} />
      <path d="M0 432C260 416 520 448 800 432S1060 422 1440 436V480H0Z" fill={SCENE.sandDeep} />
      <Crab x={560} y={404} width={46} />
      <Crab x={880} y={420} width={34} />
    </svg>
  )
}
