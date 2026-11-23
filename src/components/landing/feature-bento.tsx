'use client'

import { CircleDashed, ImageDown, MapPin, Sprout, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import type { ReactNode } from 'react'

import { Meadow } from '@/components/illustrations/meadow'
import MagicBento, { type MagicBentoItem } from '@/components/motion/MagicBento'
import { INITIAL_SUPPORTED_SPECIES, IMAGE_UPLOAD } from '@/config/constants'
import { images, type SiteImage } from '@/config/images'
import { cn } from '@/lib/utils'

function PhotoFill({
  image,
  sizes,
  shade,
}: {
  image: SiteImage
  sizes: string
  shade: 'top' | 'bottom'
}) {
  return (
    <div className="absolute inset-[calc(var(--mb-pad)*-1)] -z-10">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out-soft group-hover/bento:scale-[1.04]"
      />
      <div
        className={cn(
          'absolute inset-0',
          shade === 'top'
            ? 'bg-linear-to-b from-sage-950/70 via-sage-950/15 to-transparent'
            : 'bg-linear-to-t from-sage-950/80 via-sage-950/20 to-transparent',
        )}
      />
    </div>
  )
}

function Dash({ className }: { className?: string }) {
  return <span aria-hidden className={cn('block h-0.5 w-6 rounded-full bg-current', className)} />
}

function SpeciesCard() {
  return (
    <div className="flex h-full flex-col justify-between">
      <p className="text-sm text-slate">Scan daun</p>
      <div>
        <p className="font-display text-6xl leading-none text-ink">{INITIAL_SUPPORTED_SPECIES}+</p>
        <p className="mt-2 text-sm text-slate">spesies mangrove dikenali dari foto daun</p>
      </div>
    </div>
  )
}

function LeafPhotoCard() {
  return (
    <div className="group/bento relative isolate flex h-full flex-col justify-between text-white">
      <PhotoFill image={images.handLeaf} sizes="(min-width: 1024px) 25vw, 100vw" shade="bottom" />
      <span className="flex w-fit items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs text-prediction backdrop-blur">
        <CircleDashed aria-hidden className="size-3.5" />
        Prediksi awal
      </span>
      <div>
        <Dash />
        <p className="mt-3 text-lg">Potret satu daun,</p>
        <h3 className="font-display text-2xl leading-tight">dapatkan prediksi spesiesnya</h3>
      </div>
    </div>
  )
}

function MapPhotoCard() {
  return (
    <div className="group/bento relative isolate flex h-full flex-col text-white">
      <PhotoFill image={images.aerialCanopy} sizes="(min-width: 1024px) 50vw, 100vw" shade="top" />
      <Dash />
      <h3 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.6rem)] leading-tight">
        Peta titik terverifikasi.
      </h3>
      <p className="text-[clamp(1.4rem,2.4vw,2.1rem)] leading-tight font-light">
        Hanya yang sudah diperiksa.
      </p>
      <p className="mt-4 max-w-sm text-sm text-white/85">
        Pengelola memeriksa setiap laporan sebelum titiknya tampil untuk publik. Lokasi sensitif
        disamarkan.
      </p>
    </div>
  )
}

const FIELD_FACTS: { icon: LucideIcon; value: string; caption: string }[] = [
  { icon: MapPin, value: 'GPS', caption: 'tercatat otomatis di setiap laporan' },
  {
    icon: ImageDown,
    value: `≤ ${IMAGE_UPLOAD.maxSizeMB} MB`,
    caption: 'per foto setelah dikompres di perangkat',
  },
]

function FieldFactsCard() {
  return (
    <div className="flex h-full flex-col">
      <p className="text-sm text-slate">Dirancang untuk lapangan</p>
      <dl className="flex flex-1 flex-col justify-center gap-10 text-center">
        {FIELD_FACTS.map(({ icon: Icon, value, caption }) => (
          <div key={value} className="flex flex-col items-center">
            <Icon aria-hidden className="size-7 text-sage-700" strokeWidth={1.6} />
            <dt className="sr-only">{caption}</dt>
            <dd className="mt-3 font-display text-4xl leading-none text-ink">{value}</dd>
            <dd className="mt-2 max-w-[12rem] text-sm text-slate">{caption}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function FollowUpCard() {
  return (
    <div className="relative isolate flex h-full flex-col">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate">
          <span className="text-ink">Tindak lanjut</span> setiap laporan
        </p>
        <Sprout aria-hidden className="size-5 text-sage-600" strokeWidth={1.7} />
      </div>
      <p className="mt-4 text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight text-ink">
        Temuan terverifikasi jadi <span className="font-display">aksi bersama</span> di pesisir.
      </p>
      <Meadow className="absolute bottom-[calc(var(--mb-pad)*-1)] left-[calc(var(--mb-pad)*-1)] -z-10 h-16 w-[calc(100%+var(--mb-pad)*2)]" />
    </div>
  )
}

function HistoryPhotoCard() {
  return (
    <div className="group/bento relative isolate flex h-full flex-col justify-end text-white">
      <PhotoFill
        image={images.underwaterRoots}
        sizes="(min-width: 1024px) 25vw, 100vw"
        shade="bottom"
      />
      <Dash />
      <p className="mt-3 font-display text-xl leading-tight">Riwayat setiap lokasi</p>
      <p className="mt-1 text-sm text-white/80">Bandingkan kondisi dari waktu ke waktu.</p>
    </div>
  )
}

const CARDS: { id: string; content: ReactNode; colSpan?: number; rowSpan?: number }[] = [
  { id: 'species', content: <SpeciesCard /> },
  { id: 'map', content: <MapPhotoCard />, colSpan: 2, rowSpan: 2 },
  { id: 'facts', content: <FieldFactsCard />, rowSpan: 2 },
  { id: 'leaf', content: <LeafPhotoCard />, rowSpan: 2 },
  { id: 'follow-up', content: <FollowUpCard />, colSpan: 2 },
  { id: 'history', content: <HistoryPhotoCard /> },
]

const ITEMS: MagicBentoItem[] = CARDS.map(({ id, content, colSpan, rowSpan }) => ({
  id,
  content,
  colSpan,
  rowSpan,
}))

export function FeatureBento() {
  return (
    <MagicBento
      items={ITEMS}
      theme="light"
      columns={4}
      rowHeight={220}
      gap={16}
      radius={24}
      glowColor="#5b735c"
      textAutoHide={false}
      enableSpotlight
      enableBorderGlow
      clickEffect={false}
      spotlightRadius={320}
    />
  )
}
