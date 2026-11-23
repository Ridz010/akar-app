import Image from 'next/image'

import { CloudCluster } from '@/components/illustrations/cloud-cluster'
import { BenefitArt, type BenefitArtKind } from '@/components/illustrations/benefit-art'
import CountUp from '@/components/motion/CountUp'
import { Parallax } from '@/components/motion/parallax'
import { Reveal } from '@/components/motion/reveal'
import { INITIAL_SUPPORTED_SPECIES } from '@/config/constants'
import { images } from '@/config/images'

import { SectionIntro } from './section-intro'

const BENEFITS: { kind: BenefitArtKind; title: string; description: string }[] = [
  {
    kind: 'erosion',
    title: 'Menahan abrasi',
    description: 'Akar yang rapat mengikat tanah sehingga garis pantai tidak cepat tergerus.',
  },
  {
    kind: 'waves',
    title: 'Meredam gelombang',
    description: 'Batang dan akar memecah energi ombak sebelum sampai ke permukiman.',
  },
  {
    kind: 'habitat',
    title: 'Rumah ikan dan kepiting',
    description: 'Celah di antara akar menjadi tempat berlindung dan berkembang biak.',
  },
]

export function AboutSection() {
  const { tangledRoots } = images

  return (
    <section
      id="tentang"
      aria-labelledby="tentang-title"
      className="relative isolate scroll-mt-24 overflow-hidden py-20 sm:py-28"
    >
      <Parallax depth={16} className="absolute top-4 -right-8 -z-10 w-[clamp(12rem,22vw,20rem)]">
        <CloudCluster />
      </Parallax>
      <div className="container-page">
        <SectionIntro
          id="tentang-title"
          label="Tentang"
          title="Mangrove, perisai alami pesisir kita"
          description="AKAR membantu masyarakat pesisir mencatat kondisi mangrove, dari satu foto daun hingga aksi bersama."
        />

        <Reveal stagger={0.1} className="mt-14 grid gap-5 sm:mt-16 md:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <article
              key={benefit.kind}
              className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_50px_-28px_rgba(28,38,29,0.45)] ring-1 ring-line"
            >
              <BenefitArt kind={benefit.kind} />
              <div className="p-6">
                <h3 className="font-display text-2xl leading-tight text-ink">{benefit.title}</h3>
                <p className="mt-2 text-slate">{benefit.description}</p>
              </div>
            </article>
          ))}
        </Reveal>

        <Reveal stagger={0.1} className="mt-5 grid gap-5 md:grid-cols-12">
          <figure className="relative min-h-64 overflow-hidden rounded-[1.5rem] md:col-span-7">
            <Image
              src={tangledRoots.src}
              alt={tangledRoots.alt}
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out-soft hover:scale-[1.03]"
            />
            <figcaption className="absolute inset-x-4 bottom-4 w-fit rounded-full bg-white/90 px-4 py-2 text-sm text-ink backdrop-blur">
              Akar yang membelit menahan sedimen dan memecah arus.
            </figcaption>
          </figure>

          <div className="flex flex-col justify-between gap-10 rounded-[1.5rem] bg-sage-900 p-6 text-white shadow-[0_24px_50px_-28px_rgba(28,38,29,0.6)] sm:p-8 md:col-span-5">
            <p className="text-sm text-white/70">Cakupan model awal</p>
            <div>
              <p className="font-display text-[clamp(4rem,9vw,7rem)] leading-none text-lime-400">
                <CountUp to={INITIAL_SUPPORTED_SPECIES} suffix="+" duration={1.2} />
              </p>
              <p className="mt-3 max-w-xs text-white/85">
                spesies mangrove dapat dikenali dari foto daun pada tahap awal.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
