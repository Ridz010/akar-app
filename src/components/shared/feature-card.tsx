'use client'

import {
  ArrowUpRight,
  BookOpen,
  ClipboardPen,
  Leaf,
  Map,
  ScanLine,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'

import TiltedCard from '@/components/motion/TiltedCard'
import type { SiteImage } from '@/config/images'
import { optimizedImage } from '@/lib/image'
import { cn } from '@/lib/utils'

const ICONS = {
  leaf: Leaf,
  map: Map,
  book: BookOpen,
  scan: ScanLine,
  report: ClipboardPen,
} satisfies Record<string, LucideIcon>

export type FeatureCardIcon = keyof typeof ICONS

type FeatureCardProps = {
  title: string
  description: string
  href: string
  actionLabel: string
  image: SiteImage
  icon: FeatureCardIcon
  emphasis?: boolean
  imageHeight?: number
  className?: string
}

export function FeatureCard({
  title,
  description,
  href,
  actionLabel,
  image,
  icon,
  emphasis = false,
  imageHeight = 210,
  className,
}: FeatureCardProps) {
  const Icon = ICONS[icon]
  return (
    <article
      className={cn(
        'isolate flex flex-col rounded-[1.75rem] bg-paper p-2.5 shadow-[0_28px_60px_-30px_rgba(28,38,29,0.5)] ring-1 ring-line',
        className,
      )}
    >
      <div className="relative z-10">
        <TiltedCard
          imageSrc={optimizedImage(image.src)}
          altText={image.alt}
          containerHeight={imageHeight}
          containerWidth="100%"
          imageHeight={imageHeight}
          imageWidth="100%"
          radius={22}
          rotateAmplitude={5}
          scaleOnHover={1}
          glare={0.2}
          shadow={0}
          showTooltip={false}
          flipOnClick={false}
          gyroscope={false}
        />
        <Link
          href={href}
          aria-label={`${actionLabel}: ${title}`}
          className="absolute top-3 right-3 z-10 flex size-11 items-center justify-center rounded-full bg-sage-700/90 text-white backdrop-blur transition-colors outline-none hover:bg-sage-800 focus-visible:ring-3 focus-visible:ring-white/70"
        >
          <ArrowUpRight aria-hidden className="size-5" />
        </Link>
      </div>

      <div className="relative flex flex-1 flex-col px-4 pt-0 pb-4">
        <span
          aria-hidden
          className="relative z-20 -mt-7 flex size-14 items-center justify-center rounded-full border-4 border-paper bg-sage-900 text-lime-300"
        >
          <Icon className="size-6" strokeWidth={1.6} />
        </span>
        <h3 className="mt-3 font-display text-2xl leading-tight text-ink">{title}</h3>
        <p className="mt-2 flex-1 text-sm text-slate">{description}</p>
        <Link
          href={href}
          className={cn(
            'mt-5 inline-flex h-10 items-center gap-2 self-start rounded-full px-5 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
            emphasis
              ? 'bg-sage-900 text-white hover:bg-sage-800'
              : 'border border-sage-300 text-ink hover:bg-white',
          )}
        >
          {actionLabel}
          {emphasis && <ArrowUpRight aria-hidden className="size-4" />}
        </Link>
      </div>
    </article>
  )
}
