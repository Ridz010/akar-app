import type { Metadata } from 'next'
import Image from 'next/image'
import { Suspense } from 'react'

import { Reveal } from '@/components/motion/reveal'
import SplitText from '@/components/motion/SplitText'
import { images } from '@/config/images'
import { MapExplorer, listPublicMapPoints } from '@/features/map'

export const metadata: Metadata = { title: 'Peta mangrove' }

async function MapData() {
  const points = await listPublicMapPoints()
  return <MapExplorer points={points} />
}

function MapSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr] lg:gap-8">
      <div className="h-64 animate-pulse rounded-[1.25rem] bg-surface" />
      <div className="h-[70svh] min-h-[28rem] animate-pulse rounded-[1.25rem] bg-surface" />
    </div>
  )
}

export default function MapPage() {
  const { aerialRiver } = images

  return (
    <>
      <section className="relative isolate overflow-hidden bg-sage-950 text-white">
        <Image
          src={aerialRiver.src}
          alt={aerialRiver.alt}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-b from-sage-950/75 via-sage-950/35 to-sage-950/80"
        />
        <div className="container-page flex min-h-[60svh] flex-col justify-end pt-32 pb-12">
          <SplitText
            tag="h1"
            text="Peta mangrove"
            splitType="words"
            effect="rise"
            mask
            trigger="load"
            textAlign="left"
            delay={80}
            duration={0.6}
            className="type-display text-white"
          />
          <Reveal onMount delay={0.3} className="mt-8 max-w-xl border-t border-white/25 pt-6">
            <p className="text-lg text-white/85">
              Titik pengamatan yang sudah diperiksa pengelola. Setiap titik adalah laporan nyata
              dari masyarakat pesisir.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-label="Peta interaktif" className="container-page py-16 sm:py-20">
        <Suspense fallback={<MapSkeleton />}>
          <MapData />
        </Suspense>
      </section>
    </>
  )
}
