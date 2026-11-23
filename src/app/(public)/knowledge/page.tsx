import type { Metadata } from 'next'
import Image from 'next/image'
import { Suspense } from 'react'

import { SectionIntro } from '@/components/landing/section-intro'
import { Reveal } from '@/components/motion/reveal'
import AccordionGallery from '@/components/motion/AccordionGallery'
import SplitText from '@/components/motion/SplitText'
import { images } from '@/config/images'
import { optimizedImage } from '@/lib/image'
import { ArticleList, GuideList, SpeciesGrid, listPublishedArticles } from '@/features/knowledge'

export const metadata: Metadata = { title: 'Edukasi mangrove' }

const GALLERY = [
  { label: 'Akar tunjang', image: images.propRoots },
  { label: 'Akar di bawah air', image: images.underwaterRoots },
  { label: 'Hutan di tepi sungai', image: images.quietRiver },
  { label: 'Bibit di pesisir', image: images.saplings },
  { label: 'Tajuk dari udara', image: images.aerialCanopy },
]

async function Articles() {
  const articles = await listPublishedArticles()
  return <ArticleList articles={articles} />
}

export default function KnowledgePage() {
  const { shoreline } = images

  return (
    <>
      <section className="container-page pt-32 pb-16 sm:pt-40">
        <SplitText
          tag="h1"
          text="Mengenal mangrove dari dekat"
          splitType="words"
          effect="rise"
          mask
          trigger="load"
          textAlign="left"
          delay={70}
          duration={0.6}
          className="max-w-5xl type-display text-ink"
        />
        <Reveal
          onMount
          delay={0.3}
          className="mt-10 grid gap-6 border-t border-line pt-6 md:grid-cols-[1fr_1fr]"
        >
          <p className="max-w-md text-lg text-slate">
            Panduan singkat untuk mengenali spesies, memotret daun, dan menjaga diri saat berada di
            kawasan mangrove.
          </p>
          <nav aria-label="Isi halaman" className="flex flex-wrap gap-2 md:justify-end">
            {[
              { href: '#spesies', label: 'Spesies' },
              { href: '#panduan', label: 'Panduan' },
              { href: '#artikel', label: 'Artikel' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex h-10 items-center rounded-full border border-line px-4 text-sm text-ink transition-colors outline-none hover:bg-surface focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </Reveal>
      </section>

      <Reveal className="container-page">
        <AccordionGallery
          ariaLabel="Ragam bentuk mangrove"
          items={GALLERY.map((item) => ({
            image: optimizedImage(item.image.src, 1080),
            label: item.label,
            alt: item.image.alt,
          }))}
          defaultIndex={0}
          height={480}
          radius={22}
          expandRatio={0.5}
          accentColor="#cfea5e"
          overlayColor="#1c261d"
          tilt={4}
          grayscale={false}
        />
      </Reveal>

      <section id="spesies" aria-labelledby="spesies-title" className="scroll-mt-24 py-24 sm:py-32">
        <div className="container-page">
          <SectionIntro
            id="spesies-title"
            label="Spesies"
            title="Empat mangrove yang umum di pesisir Indonesia"
            description="Kenali dari bentuk daun dan akarnya. Daftar ini untuk pengenalan, bukan daftar spesies yang didukung model."
          />
          <div className="mt-14">
            <SpeciesGrid />
          </div>
        </div>
      </section>

      <section
        id="panduan"
        aria-labelledby="panduan-title"
        className="scroll-mt-24 bg-surface py-24 sm:py-32"
      >
        <div className="container-page">
          <SectionIntro id="panduan-title" label="Panduan" title="Sebelum dan saat di lapangan" />
          <div className="mt-14">
            <GuideList />
          </div>
        </div>
      </section>

      <section id="artikel" aria-labelledby="artikel-title" className="scroll-mt-24 py-24 sm:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <Reveal from="left" className="space-y-6">
            <p className="text-sm text-sage-700">Artikel</p>
            <h2 id="artikel-title" className="type-title text-ink">
              Bacaan dari pengelola
            </h2>
            <div className="relative aspect-4/3 overflow-hidden rounded-[1.25rem]">
              <Image
                src={shoreline.src}
                alt={shoreline.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Suspense fallback={<div className="h-48 animate-pulse rounded-[1.25rem] bg-surface" />}>
            <Articles />
          </Suspense>
        </div>
      </section>
    </>
  )
}
