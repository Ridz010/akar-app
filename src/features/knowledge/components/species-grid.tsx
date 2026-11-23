import { Reveal } from '@/components/motion/reveal'

import { SPECIES_PROFILES } from '../content'

export function SpeciesGrid() {
  return (
    <Reveal
      stagger={0.08}
      className="grid gap-px overflow-hidden rounded-[1.25rem] border border-line bg-line md:grid-cols-2"
    >
      {SPECIES_PROFILES.map((species) => (
        <article key={species.scientificName} className="flex flex-col bg-white p-6 sm:p-8">
          <p className="text-sm text-slate">{species.family}</p>
          <h3 className="mt-3 text-3xl leading-tight text-ink italic">{species.scientificName}</h3>
          <p className="mt-1 text-slate">{species.localName}</p>
          <dl className="mt-8 divide-y divide-line border-t border-line">
            {species.traits.map((trait) => (
              <div key={trait.label} className="grid grid-cols-[6rem_1fr] gap-4 py-3 text-sm">
                <dt className="text-slate">{trait.label}</dt>
                <dd className="text-ink">{trait.value}</dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </Reveal>
  )
}
