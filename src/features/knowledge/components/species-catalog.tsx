import { Leaf, ScanLine } from 'lucide-react'
import Image from 'next/image'

import { SPECIES_PHOTOS } from '@/config/species-photos'

import type { SpeciesEntry } from '../types'

function traitsOf(text: string | null) {
  if (!text) return []
  return text
    .split(/(?<=\.)\s+/)
    .map((part) => part.trim().replace(/\.$/, ''))
    .filter(Boolean)
}

function SpeciesPhoto({ entry }: { entry: SpeciesEntry }) {
  const photo = entry.modelLabel ? SPECIES_PHOTOS[entry.modelLabel] : undefined

  return (
    <figure className="relative aspect-4/3 overflow-hidden bg-sage-50">
      {photo ? (
        <>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
          />
          <figcaption className="absolute right-2 bottom-2 max-w-[85%] truncate rounded-full bg-sage-950/60 px-2.5 py-1 text-[0.6875rem] text-white backdrop-blur">
            <a
              href={photo.credit.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="outline-none hover:underline focus-visible:underline"
            >
              Foto: {photo.credit.author} · {photo.credit.license}
            </a>
          </figcaption>
        </>
      ) : (
        <span className="flex size-full items-center justify-center text-sage-400">
          <Leaf aria-hidden className="size-10" strokeWidth={1.4} />
        </span>
      )}
      {entry.isSupported && (
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs text-ink backdrop-blur">
          <ScanLine aria-hidden className="size-3.5" />
          Pindai AI
        </span>
      )}
    </figure>
  )
}

export function SpeciesCatalog({ species }: { species: SpeciesEntry[] }) {
  if (species.length === 0) {
    return (
      <p className="border-y border-line py-8 text-slate">
        Katalog spesies akan tampil setelah administrator mengisinya.
      </p>
    )
  }

  return (
    <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {species.map((entry) => (
        <li
          key={entry.id}
          id={entry.modelLabel ?? entry.id}
          className="group flex scroll-mt-24 flex-col overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-line transition-shadow target:ring-2 target:ring-sage-600 hover:shadow-[0_24px_48px_-30px_rgba(28,38,29,0.5)]"
        >
          <SpeciesPhoto entry={entry} />
          <div className="flex flex-1 flex-col p-6">
            <h3 className="font-display text-2xl leading-tight text-ink">
              {entry.localName ?? entry.scientificName}
            </h3>
            <p className="mt-1 text-sm text-slate">
              <span className="italic">{entry.scientificName}</span>
              {entry.family && ` · suku ${entry.family}`}
            </p>
            <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm text-ink">
              {traitsOf(entry.leafTraits).map((trait) => (
                <li key={trait} className="flex gap-2.5">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sage-600" />
                  {trait}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  )
}
