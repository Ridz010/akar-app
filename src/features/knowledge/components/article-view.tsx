import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { formatDate } from '@/lib/format'

import type { Article } from '../types'
import { ArticleBody } from './article-body'

type ArticleViewProps = {
  article: Article
  backHref: string
  backLabel: string
}

export function ArticleView({ article, backHref, backLabel }: ArticleViewProps) {
  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 rounded-full text-sm text-sage-700 outline-none hover:text-sage-900 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeft aria-hidden className="size-4" />
        {backLabel}
      </Link>
      <p className="mt-8 text-sm text-slate">{formatDate(article.publishedAt, 'date')}</p>
      <h1 className="mt-3 text-4xl leading-[1.08] text-ink sm:text-5xl">{article.title}</h1>
      <p className="mt-5 text-lg text-slate">{article.summary}</p>
      {article.coverPath?.startsWith('/') && (
        <div className="relative mt-10 aspect-16/9 overflow-hidden rounded-[1.5rem]">
          <Image
            src={article.coverPath}
            alt=""
            fill
            sizes="(min-width: 768px) 48rem, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="mt-10 border-t border-line pt-8">
        <ArticleBody markdown={article.body} />
      </div>
    </article>
  )
}
