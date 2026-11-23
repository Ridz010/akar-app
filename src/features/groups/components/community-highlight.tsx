import { ArrowUpRight, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Reveal } from '@/components/motion/reveal'
import { images, type SiteImage } from '@/config/images'
import { cn } from '@/lib/utils'

import type { CommunityGroup } from '../types'

const COMMUNITY_KINDS: { title: string; description: string; image: SiteImage }[] = [
  {
    title: 'Kelompok tani hutan mangrove',
    description: 'Pantau lahan rehabilitasi dan jadwalkan penanaman berikutnya.',
    image: images.saplings,
  },
  {
    title: 'Komunitas peduli pesisir',
    description: 'Laporkan sampah dan kerusakan, lalu ajak warga bersih pantai.',
    image: images.shoreline,
  },
  {
    title: 'Sekolah dan kampus',
    description: 'Belajar mengenali spesies langsung dari daun di lapangan.',
    image: images.handLeaf,
  },
]

const OFFSETS = ['lg:mr-8', 'lg:ml-8', 'lg:mr-4']

const cardClass =
  'flex items-center gap-4 rounded-[1.25rem] bg-white/95 p-3 pr-5 text-ink shadow-[0_28px_50px_-24px_rgba(0,0,0,0.6)] backdrop-blur'

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

function GroupCard({ group, className }: { group: CommunityGroup; className?: string }) {
  return (
    <div className={cn(cardClass, className)}>
      <span
        aria-hidden
        className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-sage-900 font-display text-xl text-lime-300"
      >
        {initials(group.name)}
      </span>
      <div className="min-w-0">
        <p className="truncate font-display text-lg leading-tight">{group.name}</p>
        {group.region && (
          <p className="mt-1 flex items-center gap-1 text-sm text-slate">
            <MapPin aria-hidden className="size-3.5" />
            {group.region}
          </p>
        )}
      </div>
    </div>
  )
}

function KindCard({
  kind,
  className,
}: {
  kind: (typeof COMMUNITY_KINDS)[number]
  className?: string
}) {
  return (
    <div className={cn(cardClass, className)}>
      <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl">
        <Image src={kind.image.src} alt="" fill sizes="64px" className="object-cover" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-lg leading-tight">{kind.title}</p>
        <p className="mt-1 text-sm text-slate">{kind.description}</p>
      </div>
    </div>
  )
}

export function CommunityHighlight({ groups }: { groups: CommunityGroup[] }) {
  const hasGroups = groups.length > 0
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-white/75">
        {hasGroups ? 'Komunitas yang sudah bergabung' : 'Komunitas yang bisa bergabung'}
      </p>
      <Reveal from="right" stagger={0.1} className="flex flex-col gap-3">
        {hasGroups
          ? groups.map((group, index) => (
              <GroupCard key={group.id} group={group} className={OFFSETS[index]} />
            ))
          : COMMUNITY_KINDS.map((kind, index) => (
              <KindCard key={kind.title} kind={kind} className={OFFSETS[index]} />
            ))}
      </Reveal>
      <Link
        href="/register"
        className="group mt-1 inline-flex items-center gap-2 self-start rounded-full text-sm text-lime-300 outline-none hover:text-lime-100 focus-visible:ring-3 focus-visible:ring-white/50"
      >
        Daftarkan kelompokmu
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </div>
  )
}
