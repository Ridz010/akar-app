import { ScanLine } from 'lucide-react'

import type { SpeciesEntry } from '../types'

function traitsOf(text: string | null) {
  if (!text) return []
  return text
    .split(/(?<=\.)\s+/)
    .map((part) => part.trim().replace(/\.$/, ''))
    .filter(Boolean)
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
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {species.map((entry) => (
        <li
          key={entry.id}
          id={entry.modelLabel ?? entry.id}
          className="flex scroll-mt-24 flex-col rounded-[1.5rem] bg-white p-6 ring-1 ring-line target:ring-2 target:ring-sage-600"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-2xl leading-tight text-ink">
                {entry.localName ?? entry.scientificName}
              </h3>
              <p className="mt-1 text-sm text-slate">
                <span className="italic">{entry.scientificName}</span>
                {entry.family && ` · suku ${entry.family}`}
              </p>
            </div>
            {entry.isSupported && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs text-ink ring-1 ring-line">
                <ScanLine aria-hidden className="size-3.5" />
                Pindai AI
              </span>
            )}
          </div>
          <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm text-ink">
            {traitsOf(entry.leafTraits).map((trait) => (
              <li key={trait} className="flex gap-2.5">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sage-600" />
                {trait}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
