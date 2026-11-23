import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArticleView, getPublishedArticle } from '@/features/knowledge'
import { requireUser } from '@/lib/auth/guards'

export const metadata: Metadata = { title: 'Artikel' }

export default async function LearnArticlePage({ params }: PageProps<'/learn/[slug]'>) {
  await requireUser()
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  if (!article) notFound()

  return <ArticleView article={article} backHref="/learn#artikel" backLabel="Pusat pengetahuan" />
}
