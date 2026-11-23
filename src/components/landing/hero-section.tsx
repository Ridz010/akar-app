import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { SKY_GRADIENT } from '@/components/illustrations/parts'
import { ShoreHorizon } from '@/components/illustrations/shore-horizon'
import { Reveal } from '@/components/motion/reveal'
import SplitText from '@/components/motion/SplitText'
import { FeatureCard } from '@/components/shared/feature-card'
import { buttonVariants } from '@/components/ui/button'
import { images } from '@/config/images'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

const ENTRY_CARDS = [
  {
    title: 'Scan daun',
    description: 'Potret satu daun dan dapatkan prediksi awal spesiesnya dalam hitungan detik.',
    href: '/scanner',
    actionLabel: 'Mulai scan',
    image: images.leafRosette,
    icon: 'leaf',
    emphasis: true,
  },
  {
    title: 'Peta mangrove',
    description: 'Lihat titik pengamatan yang sudah diperiksa pengelola di seluruh pesisir.',
    href: '/map',
    actionLabel: 'Buka peta',
    image: images.aerialCanopy,
    icon: 'map',
  },
  {
    title: 'Edukasi',
    description: 'Kenali ciri daun dan akar, serta cara aman memotret di lapangan.',
    href: '/knowledge',
    actionLabel: 'Pelajari',
    image: images.shoreline,
    icon: 'book',
  },
] as const

export function HeroSection() {
  const { hero } = images

  return (
    <>
      <section
        id="beranda"
        aria-label="Beranda"
        className="relative isolate flex min-h-[92svh] flex-col overflow-hidden bg-sage-950 text-white"
      >
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          priority
          sizes="100vw"
          className="-z-30 object-cover object-[center_60%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-linear-to-l from-sage-800/85 via-sage-800/35 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-b from-sage-950/55 via-transparent to-sage-950/70"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 -z-10 w-3/5 bg-linear-to-r from-sage-950/55 to-transparent"
        />

        <div className="container-page flex flex-1 flex-col justify-center pt-32 pb-44 sm:pb-52">
          <SplitText
            tag="h1"
            text={siteConfig.tagline}
            splitType="words"
            effect="rise"
            mask
            trigger="load"
            textAlign="left"
            delay={70}
            duration={0.6}
            className="max-w-4xl type-display text-white"
          />

          <Reveal onMount delay={0.35} className="mt-8 flex max-w-xl flex-col gap-8 sm:mt-10">
            <p className="text-base text-white/85 sm:text-lg">
              Kenali spesies mangrove dari foto daun, laporkan kondisinya, lalu tindak lanjuti
              bersama pengelola konservasi di pesisirmu.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className={cn(buttonVariants(), 'h-12 rounded-full px-6 text-base font-normal')}
              >
                Gabung sebagai kontributor
              </Link>
              <Link
                href="#tentang"
                className="group inline-flex h-12 items-center gap-2 rounded-full px-5 text-base text-white transition-colors outline-none hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-white/50"
              >
                Kenali AKAR
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="relative isolate z-10 -mt-36 sm:-mt-40">
        <div
          aria-hidden
          className="absolute inset-x-0 top-36 bottom-0 -z-10 sm:top-40"
          style={{ background: SKY_GRADIENT }}
        />
        <Reveal
          onMount
          delay={0.5}
          stagger={0.08}
          className="container-page grid gap-4 md:grid-cols-3 md:gap-5"
        >
          {ENTRY_CARDS.map((card) => (
            <FeatureCard key={card.href} {...card} />
          ))}
        </Reveal>
        <ShoreHorizon className="-mt-6 h-[clamp(11rem,24vw,22rem)]" />
      </div>
    </>
  )
}
