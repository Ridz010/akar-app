import 'server-only'

import { connection } from 'next/server'

import { createPublicClient } from '@/lib/supabase/public'

import type { CommunityGroup } from './types'

export async function listFeaturedGroups(limit = 3): Promise<CommunityGroup[]> {
  const supabase = createPublicClient()
  if (!supabase) return []
  await connection()

  const { data, error } = await supabase
    .from('conservation_groups')
    .select('id, name, region')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('[AKAR] Gagal memuat kelompok konservasi:', error.message)
    return []
  }

  return data
}
