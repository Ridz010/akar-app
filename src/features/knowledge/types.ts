export type Guide = {
  slug: string
  title: string
  summary: string
  steps: string[]
}

export type ArticleSummary = {
  slug: string
  title: string
  summary: string
  coverPath: string | null
  publishedAt: string
}

export type Article = ArticleSummary & {
  body: string
}

export type SpeciesEntry = {
  id: string
  scientificName: string
  localName: string | null
  family: string | null
  leafTraits: string | null
  modelLabel: string | null
  isSupported: boolean
}
