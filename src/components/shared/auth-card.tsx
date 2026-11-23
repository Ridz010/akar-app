import { BadgeCheck, HandHeart, Leaf, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import type { ReactNode } from 'react'

import { FallingLeaves } from '@/components/illustrations/night-forest'
import { Reveal } from '@/components/motion/reveal'
import SplitText from '@/components/motion/SplitText'
import { images, type SiteImage } from '@/config/images'

import { Logo } from './logo'

const BENEFITS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Leaf,
    title: 'Kenali dari foto daun',
    body: 'Prediksi awal spesies membantu kamu belajar di lapangan.',
  },
  {
    icon: BadgeCheck,
    title: 'Diperiksa pengelola',
    body: 'Setiap laporan ditinjau sebelum tampil di peta publik.',
  },
  {
    icon: HandHeart,
    title: 'Berujung aksi nyata',
    body: 'Temuan terverifikasi menjadi kegiatan konservasi bersama.',
  },
]

const CURVE_OFFSETS = ['ml-0', 'ml-10', 'ml-0']

type AuthCardProps = {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
  image?: SiteImage
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  image = images.propRoots,
}: AuthCardProps) {
  return (
    <main className="grid min-h-svh flex-1 lg:grid-cols-[1fr_1.05fr]">
      <section className="relative flex flex-col overflow-hidden bg-sage-50 px-4 py-6 sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-sage-100"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -bottom-40 size-[28rem] rounded-full border border-sage-200"
        />
        <Logo className="relative h-9" />
        <div className="relative flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md rounded-[2rem] bg-sage-800 p-7 text-white shadow-[0_40px_80px_-40px_rgba(28,38,29,0.7)] sm:p-10">
            <SplitText
              tag="h1"
              text={title}
              splitType="words"
              effect="rise"
              mask
              trigger="load"
              textAlign="center"
              delay={70}
              duration={0.55}
              className="w-full font-display text-4xl leading-tight text-white"
            />
            <Reveal onMount delay={0.2}>
              <p className="mt-3 text-center text-sm text-white/75">{description}</p>
              <div className="mt-8">{children}</div>
              <p className="mt-6 text-center text-sm text-white/75">{footer}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <aside className="relative isolate hidden flex-col justify-center overflow-hidden bg-sage-900 px-12 py-16 text-white lg:flex xl:px-20">
        <FallingLeaves count={6} className="-z-10" />
        <Reveal onMount delay={0.15} from="right">
          <p className="text-sm text-lime-300">Mengapa bergabung</p>
          <h2 className="mt-4 max-w-md type-title text-white">
            Pesisir terjaga dimulai dari laporanmu
          </h2>
        </Reveal>

        <div className="relative mt-14 grid grid-cols-[14rem_1fr] items-center gap-10 xl:grid-cols-[16rem_1fr]">
          <Reveal onMount delay={0.25} scale={0.94}>
            <div className="relative aspect-square overflow-hidden rounded-full ring-8 ring-white/5">
              <Image src={image.src} alt={image.alt} fill sizes="16rem" className="object-cover" />
            </div>
          </Reveal>

          <div className="relative">
            <svg
              aria-hidden
              viewBox="0 0 60 320"
              preserveAspectRatio="none"
              className="absolute top-6 bottom-6 left-6 h-[calc(100%-3rem)] w-12 text-lime-400/50"
            >
              <path
                d="M 4 0 C 60 80, 60 240, 4 320"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <Reveal onMount delay={0.35} stagger={0.12} className="relative space-y-8">
              {BENEFITS.map(({ icon: Icon, title: benefit, body }, index) => (
                <div key={benefit} className={`flex items-start gap-4 ${CURVE_OFFSETS[index]}`}>
                  <span
                    aria-hidden
                    className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sage-700 text-lime-300 ring-4 ring-sage-900"
                  >
                    <Icon className="size-5" strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="font-display text-xl text-white">{benefit}</p>
                    <p className="mt-1 text-sm text-white/70">{body}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </aside>
    </main>
  )
}
