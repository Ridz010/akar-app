import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { AuthCard } from '@/components/shared/auth-card'
import { LoginForm } from '@/features/auth'

export const metadata: Metadata = { title: 'Masuk' }

async function LoginFormWithRedirect({ searchParams }: PageProps<'/login'>) {
  const { next } = await searchParams
  return <LoginForm next={typeof next === 'string' ? next : undefined} />
}

export default function LoginPage(props: PageProps<'/login'>) {
  return (
    <AuthCard
      title="Selamat datang kembali"
      description="Masuk untuk melanjutkan pengamatan dan memantau laporanmu."
      footer={
        <>
          Belum punya akun?{' '}
          <Link href="/register" className="text-lime-300 underline-offset-4 hover:underline">
            Daftar
          </Link>
        </>
      }
    >
      <Suspense fallback={<LoginForm />}>
        <LoginFormWithRedirect {...props} />
      </Suspense>
    </AuthCard>
  )
}
