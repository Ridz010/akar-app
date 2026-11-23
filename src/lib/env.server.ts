import 'server-only'

import { z } from 'zod'

import { formatEnvError } from './env'

const serverEnvSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(1).optional(),
  BACKEND_API_URL: z.url(),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

export function getServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse({
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY || undefined,
    BACKEND_API_URL: process.env.BACKEND_API_URL,
  })
  if (!parsed.success) {
    throw new Error(formatEnvError('server', parsed.error))
  }
  return parsed.data
}
