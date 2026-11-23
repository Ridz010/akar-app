import Image from 'next/image'
import Link from 'next/link'

import { Reveal } from '@/components/motion/reveal'
import SplitText from '@/components/motion/SplitText'
import { buttonVariants } from '@/components/ui/button'
import { images } from '@/config/images'
import { cn } from '@/lib/utils'

export function DashboardHero({ name }: { name: string | null }) {
  const { quietRiver } = images
  const greeting = name ? `Halo, ${name.split(' ')[0]}` : 'Halo, penjaga pesisir'

  return (
    <section className="relative isolate overflow-hidden rounded-[1.5rem] bg-sage-950 text-white">
      <Image
        src={quietRiver.src}
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 70vw, 100vw"
        className="-z-20 object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-l from-sage-800/85 via-sage-900/45 to-sage-950/70"
      />
      <div className="flex min-h-72 flex-col justify-end gap-6 p-6 sm:min-h-80 sm:p-10">
        <SplitText
          tag="h1"
          text={greeting}
          splitType="words"
          effect="rise"
          mask
          trigger="load"
          textAlign="left"
          delay={80}
          duration={0.55}
          className="font-display text-5xl leading-tight text-white sm:text-6xl"
        />
        <Reveal
          onMount
          delay={0.25}
          className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-md text-white/85">
            Sudah lihat mangrove di sekitarmu hari ini? Satu foto daun cukup untuk memulai laporan.
          </p>
          <Link
            href="/scanner"
            className={cn(
              buttonVariants(),
              'h-12 shrink-0 rounded-full px-6 text-base font-normal',
            )}
          >
            Scan daun
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
