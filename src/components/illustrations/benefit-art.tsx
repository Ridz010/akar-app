import type { ReactElement, ReactNode } from 'react'

import { Crab, Fish, MangroveTree, SCENE } from './parts'

export type BenefitArtKind = 'erosion' | 'waves' | 'habitat'

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg role="img" aria-label={label} viewBox="0 0 220 130" className="block h-auto w-full">
      <rect width="220" height="130" fill={SCENE.skyBottom} />
      {children}
    </svg>
  )
}

function ErosionArt() {
  return (
    <Frame label="Akar mangrove menahan tanah pantai dari arus">
      <rect y="84" width="220" height="46" fill={SCENE.seaTop} />
      <path d="M96 96C130 86 170 88 220 94V130H96Z" fill={SCENE.sand} />
      <path d="M120 112C150 106 186 108 220 112V130H120Z" fill={SCENE.sandDeep} />
      <g fill="none" stroke={SCENE.seaBottom} strokeWidth="4" strokeLinecap="round">
        <path d="M10 70q14-12 28 0t28 0" />
        <path d="M44 92l20-8-20-8" />
        <path d="M14 104h44" opacity="0.6" />
      </g>
      <MangroveTree x={112} base={112} width={84} />
    </Frame>
  )
}

function WavesArt() {
  return (
    <Frame label="Gelombang besar mengecil setelah melewati hutan mangrove">
      <rect y="92" width="220" height="38" fill={SCENE.seaBottom} />
      <g fill="none" stroke={SCENE.wave} strokeWidth="5" strokeLinecap="round">
        <path d="M8 92q14-40 28 0" />
        <path d="M44 92q11-26 22 0" opacity="0.85" />
        <path d="M74 92q8-14 16 0" opacity="0.7" />
      </g>
      <MangroveTree x={116} base={118} width={88} />
    </Frame>
  )
}

function HabitatArt() {
  return (
    <Frame label="Ikan dan kepiting hidup di antara akar mangrove">
      <rect y="62" width="220" height="68" fill={SCENE.seaTop} />
      <path d="M0 110C60 102 140 116 220 106V130H0Z" fill={SCENE.mud} />
      <MangroveTree x={150} base={112} width={84} opacity={0.95} />
      <Fish x={26} y={70} width={50} />
      <Fish x={92} y={74} width={30} opacity={0.9} />
      <Crab x={104} y={100} width={40} />
      <Crab x={40} y={106} width={30} />
    </Frame>
  )
}

const ART: Record<BenefitArtKind, () => ReactElement> = {
  erosion: ErosionArt,
  waves: WavesArt,
  habitat: HabitatArt,
}

export function BenefitArt({ kind }: { kind: BenefitArtKind }) {
  const Art = ART[kind]
  return <Art />
}
