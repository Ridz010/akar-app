import 'server-only'

import type { z } from 'zod'

import { getServerEnv } from '@/lib/env.server'
import { createClient } from '@/lib/supabase/server'

export class BackendError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'BackendError'
  }
}

type BackendRequest<Schema extends z.ZodType> = {
  path: `/${string}`
  schema: Schema
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: BodyInit
  json?: unknown
  signal?: AbortSignal
}

async function accessToken(): Promise<string> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new BackendError(401, 'unauthenticated', 'Sesi berakhir. Silakan masuk lagi.')
  return token
}

export async function backendFetch<Schema extends z.ZodType>({
  path,
  schema,
  method = 'GET',
  body,
  json,
  signal,
}: BackendRequest<Schema>): Promise<z.infer<Schema>> {
  const { BACKEND_API_URL } = getServerEnv()
  const headers = new Headers({ Authorization: `Bearer ${await accessToken()}` })
  if (json !== undefined) headers.set('Content-Type', 'application/json')

  const response = await fetch(new URL(path, BACKEND_API_URL), {
    method,
    headers,
    body: json !== undefined ? JSON.stringify(json) : body,
    signal,
    cache: 'no-store',
  })

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const error = (payload as { error?: { code?: string; message?: string } } | null)?.error
    throw new BackendError(
      response.status,
      error?.code ?? 'backend_error',
      error?.message ?? 'Layanan sedang bermasalah. Coba lagi nanti.',
    )
  }

  return schema.parse(payload)
}
