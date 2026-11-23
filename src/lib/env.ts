import { z } from 'zod'

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
})

export type PublicEnv = z.infer<typeof publicEnvSchema>

function readPublicEnv() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  }
}

export function isSupabaseConfigured(): boolean {
  return publicEnvSchema.safeParse(readPublicEnv()).success
}

export function getPublicEnv(): PublicEnv {
  const parsed = publicEnvSchema.safeParse(readPublicEnv())
  if (!parsed.success) {
    throw new Error(formatEnvError('publik', parsed.error))
  }
  return parsed.data
}

export function formatEnvError(scope: string, error: z.ZodError): string {
  const fields = error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
  return [
    `[AKAR] Variabel lingkungan ${scope} belum lengkap atau tidak valid:`,
    ...fields,
    'Salin .env.example menjadi .env.local lalu isi nilainya.',
  ].join('\n')
}
