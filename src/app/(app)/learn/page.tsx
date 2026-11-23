import type { Metadata } from 'next'

import { PageHeader } from '@/components/shared/page-header'
import {
  ArticleList,
  GuideList,
  SpeciesCatalog,
  listPublishedArticles,
  listSpecies,
} from '@/features/knowledge'
import { requireUser } from '@/lib/auth/guards'

export const metadata: Metadata = { title: 'Pusat pengetahuan' }

const SECTIONS = [
  { href: '#spesies', label: 'Katalog spesies' },
  { href: '#panduan', label: 'Panduan lapangan' },
  { href: '#artikel', label: 'Artikel' },
]

export default async function LearnPage() {
  await requireUser()
  const [species, articles] = await Promise.all([listSpecies(), listPublishedArticles(24)])

  return (
    <>
      <PageHeader
        title="Pusat pengetahuan"
        description="Kenali ciri tiap spesies, pelajari cara memotret dan melapor, lalu baca artikel dari pengelola."
      />
      <nav aria-label="Isi halaman" className="flex flex-wrap gap-2">
        {SECTIONS.map((section) => (
          <a
            key={section.href}
            href={section.href}
            className="inline-flex h-10 items-center rounded-full border border-line px-4 text-sm text-ink transition-colors outline-none hover:bg-surface focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {section.label}
          </a>
        ))}
      </nav>

      <section id="spesies" aria-labelledby="spesies-title" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="spesies-title" className="text-3xl text-ink">
            Katalog spesies
          </h2>
          <p className="text-sm text-slate">{species.length} spesies tercatat</p>
        </div>
        <SpeciesCatalog species={species} />
      </section>

      <section id="panduan" aria-labelledby="panduan-title" className="scroll-mt-24 space-y-6">
        <h2 id="panduan-title" className="text-3xl text-ink">
          Panduan lapangan
        </h2>
        <GuideList />
      </section>

      <section id="artikel" aria-labelledby="artikel-title" className="scroll-mt-24 space-y-6">
        <h2 id="artikel-title" className="text-3xl text-ink">
          Artikel
        </h2>
        <ArticleList articles={articles} basePath="/learn" />
      </section>
    </>
  )
}
