import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { ArticleView, getPublishedArticle } from '@/features/knowledge'

export const metadata: Metadata = { title: 'Artikel' }

async function Article({ params }: { params: PageProps<'/knowledge/[slug]'>['params'] }) {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  if (!article) notFound()
  return <ArticleView article={article} backHref="/knowledge#artikel" backLabel="Edukasi" />
}

function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="h-4 w-32 animate-pulse rounded-full bg-surface" />
      <div className="h-24 animate-pulse rounded-2xl bg-surface" />
      <div className="aspect-16/9 animate-pulse rounded-[1.5rem] bg-surface" />
    </div>
  )
}

export default function KnowledgeArticlePage({ params }: PageProps<'/knowledge/[slug]'>) {
  return (
    <section className="container-page pt-32 pb-24 sm:pt-40">
      <Suspense fallback={<ArticleSkeleton />}>
        <Article params={params} />
      </Suspense>
    </section>
  )
}
