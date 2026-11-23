import type { ReactNode } from 'react'

import Image from 'next/image'

import { Reveal } from '@/components/motion/reveal'
import SplitText from '@/components/motion/SplitText'
import { images } from '@/config/images'

import { EmailSignup } from './email-signup'

export function CtaSection({ aside }: { aside?: ReactNode }) {
  const { riverReflection } = images

  return (
    <section aria-label="Ajakan bergabung" className="px-4 py-4 sm:px-6 sm:py-6">
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-sage-950">
        <Image src={riverReflection.src} alt="" fill sizes="100vw" className="-z-20 object-cover" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-l from-sage-800/90 via-sage-950/70 to-sage-950/80"
        />
        <div className="container-page flex min-h-[64svh] flex-col justify-between gap-14 py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <SplitText
              tag="h2"
              text="Mulai dari satu daun di sekitarmu"
              splitType="words"
              effect="rise"
              mask
              textAlign="left"
              delay={60}
              duration={0.6}
              rootMargin="0px"
              className="max-w-3xl type-display text-white"
            />
            {aside}
          </div>
          <Reveal className="flex flex-col gap-8 border-t border-white/20 pt-8 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-md text-lg text-white/85">
              Tulis emailmu untuk mulai mendaftar sebagai kontributor dan bantu pengelola memahami
              kondisi mangrove di pesisirmu.
            </p>
            <EmailSignup />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
