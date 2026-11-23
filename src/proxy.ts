import { NextResponse, type NextRequest } from 'next/server'

import { isSupabaseConfigured } from '@/lib/env'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.next()
  return updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon/|img/|.*\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)',
  ],
}
