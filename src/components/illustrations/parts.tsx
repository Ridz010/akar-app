export const SCENE = {
  skyTop: '#cde7f1',
  skyBottom: '#eef7f2',
  sun: '#fff3c2',
  cloud: '#ffffff',
  cloudShade: '#dbebf2',
  hillFar: '#bcdcc3',
  hillNear: '#93c4a1',
  seaTop: '#97cde3',
  seaBottom: '#5f9fc5',
  wave: '#ffffff',
  sand: '#f1e0b5',
  sandDeep: '#e4cc93',
  mud: '#8a6c4a',
  leaf: '#3f7d52',
  leafLight: '#6aad74',
  trunk: '#7c5a3c',
  crab: '#e1825b',
  fish: '#f1b04f',
  fishTail: '#e49840',
  eye: '#1c261d',
  cloudTint: '#e4f0f4',
  cloudTintShade: '#d2e5ec',
} as const

export const SKY_GRADIENT = `linear-gradient(180deg, ${SCENE.skyTop} 0%, ${SCENE.skyBottom} 100%)`

type Placement = {
  x?: number
  y?: number
  width: number
  opacity?: number
}

export function Cloud({
  x = 0,
  y = 0,
  width,
  opacity = 1,
  tone = 'white',
}: Placement & { tone?: 'white' | 'tint' }) {
  const tint = tone === 'tint'
  return (
    <svg x={x} y={y} width={width} height={width * 0.4} viewBox="0 0 200 80" opacity={opacity}>
      <g fill={tint ? SCENE.cloudTint : SCENE.cloud}>
        <circle cx="60" cy="48" r="28" />
        <circle cx="102" cy="36" r="34" />
        <circle cx="146" cy="50" r="26" />
        <rect x="34" y="50" width="146" height="28" rx="14" />
      </g>
      <rect
        x="44"
        y="66"
        width="130"
        height="10"
        rx="5"
        fill={tint ? SCENE.cloudTintShade : SCENE.cloudShade}
        opacity="0.7"
      />
    </svg>
  )
}

export function Sun({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g fill={SCENE.sun}>
      <circle cx={cx} cy={cy} r={r * 1.55} opacity="0.35" />
      <circle cx={cx} cy={cy} r={r} />
    </g>
  )
}

type TreeProps = {
  x: number
  base: number
  width: number
  opacity?: number
}

export function MangroveTree({ x, base, width, opacity = 1 }: TreeProps) {
  const height = width * 1.25
  return (
    <svg
      x={x}
      y={base - height}
      width={width}
      height={height}
      viewBox="0 0 160 200"
      opacity={opacity}
    >
      <g fill="none" stroke={SCENE.trunk} strokeWidth="4" strokeLinecap="round">
        <path d="M80 120C58 128 40 150 30 196" />
        <path d="M80 120C70 140 62 166 58 196" />
        <path d="M80 120C90 140 98 166 102 196" />
        <path d="M80 120C102 128 120 150 130 196" />
        <path d="M80 90V122" strokeWidth="7" />
      </g>
      <g fill={SCENE.leaf}>
        <circle cx="80" cy="52" r="40" />
        <circle cx="44" cy="78" r="30" />
        <circle cx="116" cy="78" r="30" />
        <circle cx="80" cy="86" r="30" />
      </g>
      <g fill={SCENE.leafLight}>
        <circle cx="66" cy="40" r="16" />
        <circle cx="100" cy="58" r="12" />
        <circle cx="40" cy="72" r="11" />
      </g>
    </svg>
  )
}

export function Crab({ x = 0, y = 0, width, opacity = 1 }: Placement) {
  return (
    <svg x={x} y={y} width={width} height={width * (2 / 3)} viewBox="0 0 60 40" opacity={opacity}>
      <g fill={SCENE.crab}>
        <ellipse cx="30" cy="24" rx="16" ry="10" />
        <circle cx="9" cy="10" r="6" />
        <circle cx="51" cy="10" r="6" />
      </g>
      <g stroke={SCENE.crab} strokeWidth="3" strokeLinecap="round">
        <path d="M16 20L9 12M44 20L51 12M16 28l-8 6M44 28l8 6M22 33l-4 6M38 33l4 6" />
      </g>
      <circle cx="25" cy="18" r="2" fill={SCENE.eye} />
      <circle cx="35" cy="18" r="2" fill={SCENE.eye} />
    </svg>
  )
}

export function Fish({ x = 0, y = 0, width, opacity = 1 }: Placement) {
  return (
    <svg x={x} y={y} width={width} height={width * (32 / 60)} viewBox="0 0 60 32" opacity={opacity}>
      <path d="M4 16C16 2 38 2 48 16 38 30 16 30 4 16Z" fill={SCENE.fish} />
      <path d="M46 16L58 6V26Z" fill={SCENE.fishTail} />
      <circle cx="14" cy="14" r="2.5" fill={SCENE.eye} />
    </svg>
  )
}

export function Ripple({ x, y, width = 120 }: { x: number; y: number; width?: number }) {
  const step = width / 4
  return (
    <path
      d={`M${x} ${y}q${step / 2}-${step / 3} ${step} 0t${step} 0t${step} 0t${step} 0`}
      fill="none"
      stroke={SCENE.wave}
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.6"
    />
  )
}

export function MangroveSilhouette({ x, base, width, color }: TreeProps & { color: string }) {
  const height = width * 1.25
  return (
    <svg x={x} y={base - height} width={width} height={height} viewBox="0 0 160 200">
      <g fill="none" stroke={color} strokeWidth="5" strokeLinecap="round">
        <path d="M80 120C58 128 40 150 30 198" />
        <path d="M80 120C70 140 62 168 58 198" />
        <path d="M80 120C90 140 98 168 102 198" />
        <path d="M80 120C102 128 120 150 130 198" />
        <path d="M66 124C52 140 48 170 46 198" />
        <path d="M94 124C108 140 112 170 114 198" />
        <path d="M80 80V122" strokeWidth="8" />
      </g>
      <g fill={color}>
        <circle cx="80" cy="52" r="40" />
        <circle cx="42" cy="80" r="31" />
        <circle cx="118" cy="80" r="31" />
        <circle cx="80" cy="88" r="32" />
        <circle cx="20" cy="98" r="16" />
        <circle cx="140" cy="98" r="16" />
      </g>
    </svg>
  )
}
