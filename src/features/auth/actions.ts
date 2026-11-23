'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { siteConfig } from '@/config/site'
import { isSupabaseConfigured } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'

import { signInSchema, signUpSchema } from './schemas'
import type { AuthFormState } from './types'

const NOT_CONFIGURED: AuthFormState = {
  status: 'error',
  message: 'Autentikasi belum dikonfigurasi. Isi variabel Supabase di .env.local.',
}

function fieldErrorsOf(error: z.ZodError): AuthFormState['fieldErrors'] {
  const flat = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>
  return Object.fromEntries(Object.entries(flat).map(([key, messages]) => [key, messages?.[0]]))
}

export async function signIn(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const values = { email: String(formData.get('email') ?? '') }
  const parsed = signInSchema.safeParse({ ...values, password: formData.get('password') })
  if (!parsed.success) return { status: 'error', fieldErrors: fieldErrorsOf(parsed.error), values }
  if (!isSupabaseConfigured()) return { ...NOT_CONFIGURED, values }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) {
    return { status: 'error', message: 'Email atau kata sandi tidak cocok.', values }
  }

  const next = String(formData.get('next') ?? '')
  redirect(next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard')
}

export async function signUp(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const values = {
    fullName: String(formData.get('fullName') ?? ''),
    email: String(formData.get('email') ?? ''),
  }
  const parsed = signUpSchema.safeParse({ ...values, password: formData.get('password') })
  if (!parsed.success) return { status: 'error', fieldErrors: fieldErrorsOf(parsed.error), values }
  if (!isSupabaseConfigured()) return { ...NOT_CONFIGURED, values }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: new URL('/auth/confirm', siteConfig.url).toString(),
    },
  })
  if (error) {
    return { status: 'error', message: 'Pendaftaran gagal. Coba gunakan email lain.', values }
  }
  if (data.session) redirect('/dashboard')

  return {
    status: 'success',
    message: `Tautan konfirmasi telah dikirim ke ${parsed.data.email}. Buka email tersebut untuk mengaktifkan akun.`,
  }
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  redirect('/')
}
