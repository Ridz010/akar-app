import 'server-only'

import { connection } from 'next/server'

import { createPublicClient } from '@/lib/supabase/public'

import { articleSlugSchema } from './schemas'
import type { Article, ArticleSummary, SpeciesEntry } from './types'

const SUMMARY_COLUMNS = 'slug, title, summary, cover_path, published_at'

type ArticleRow = {
  slug: string
  title: string
  summary: string
  cover_path: string | null
  published_at: string | null
}

function toSummary(row: ArticleRow): ArticleSummary {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    coverPath: row.cover_path,
    publishedAt: row.published_at ?? '',
  }
}

export async function listPublishedArticles(limit = 12): Promise<ArticleSummary[]> {
  const supabase = createPublicClient()
  if (!supabase) return []
  await connection()

  const { data, error } = await supabase
    .from('articles')
    .select(SUMMARY_COLUMNS)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('[AKAR] Gagal memuat artikel:', error.message)
    return []
  }

  return data.map(toSummary)
}

export async function getPublishedArticle(slug: string): Promise<Article | null> {
  const parsed = articleSlugSchema.safeParse(slug)
  const supabase = createPublicClient()
  if (!parsed.success || !supabase) return null
  await connection()

  const { data, error } = await supabase
    .from('articles')
    .select(`${SUMMARY_COLUMNS}, body`)
    .eq('slug', parsed.data)
    .not('published_at', 'is', null)
    .maybeSingle()
  if (error) {
    console.error('[AKAR] Gagal memuat artikel:', error.message)
    return null
  }
  if (!data) return null

  return { ...toSummary(data), body: data.body }
}

export async function listSpecies(): Promise<SpeciesEntry[]> {
  const supabase = createPublicClient()
  if (!supabase) return []
  await connection()

  const { data, error } = await supabase
    .from('species')
    .select('id, scientific_name, local_name, family, leaf_traits, model_label, is_supported')
    .order('scientific_name')
  if (error) {
    console.error('[AKAR] Gagal memuat spesies:', error.message)
    return []
  }

  return data.map((row) => ({
    id: row.id,
    scientificName: row.scientific_name,
    localName: row.local_name,
    family: row.family,
    leafTraits: row.leaf_traits,
    modelLabel: row.model_label,
    isSupported: row.is_supported,
  }))
}
