import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { formatDate } from '@/lib/format'

import type { ArticleSummary } from '../types'

type ArticleListProps = {
  articles: ArticleSummary[]
  basePath?: string
}

export function ArticleList({ articles, basePath = '/knowledge' }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <p className="border-y border-line py-8 text-slate">
        Artikel dari pengelola AKAR akan diterbitkan bertahap di sini.
      </p>
    )
  }
  return (
    <ul className="divide-y divide-line border-y border-line">
      {articles.map((article) => (
        <li key={article.slug}>
          <Link
            href={`${basePath}/${article.slug}`}
            className="group grid gap-4 py-6 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:grid-cols-[7rem_1fr_auto] sm:items-center"
          >
            {article.coverPath?.startsWith('/') ? (
              <span className="relative hidden aspect-4/3 overflow-hidden rounded-xl sm:block">
                <Image
                  src={article.coverPath}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </span>
            ) : (
              <span className="hidden sm:block" />
            )}
            <span className="min-w-0">
              <span className="text-sm text-slate">
                {formatDate(article.publishedAt, 'shortDate')}
              </span>
              <span className="mt-1 block font-display text-2xl leading-tight text-ink group-hover:text-sage-800">
                {article.title}
              </span>
              <span className="mt-1 block text-slate">{article.summary}</span>
            </span>
            <ArrowUpRight
              aria-hidden
              className="hidden size-5 text-slate transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block"
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}
