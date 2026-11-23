'use client'

import { useEffect, useState } from 'react'

import { isSupabaseConfigured } from '@/lib/env'
import { createClient } from '@/lib/supabase/client'

export function useSignedIn(recheckKey?: string | null) {
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    const supabase = createClient()
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (active) setSignedIn(Boolean(data.session))
    })
    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      if (active) setSignedIn(Boolean(session))
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [recheckKey])

  return signedIn
}
