import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { AuthCard } from '@/components/shared/auth-card'
import { images } from '@/config/images'
import { RegisterForm } from '@/features/auth'
import { getCurrentUser } from '@/lib/auth/get-current-user'

export const metadata: Metadata = { title: 'Daftar' }

async function RegisterFormWithEmail({ searchParams }: PageProps<'/register'>) {
  const [{ email }, user] = await Promise.all([searchParams, getCurrentUser()])
  if (user) redirect('/dashboard')
  return <RegisterForm defaultEmail={typeof email === 'string' ? email : undefined} />
}

export default function RegisterPage(props: PageProps<'/register'>) {
  return (
    <AuthCard
      title="Bergabung dengan AKAR"
      description="Bantu pengelola memahami kondisi mangrove di pesisirmu."
      image={images.saplings}
      footer={
        <>
          Sudah punya akun?{' '}
          <Link href="/login" className="text-lime-300 underline-offset-4 hover:underline">
            Masuk
          </Link>
        </>
      }
    >
      <Suspense fallback={<RegisterForm />}>
        <RegisterFormWithEmail {...props} />
      </Suspense>
    </AuthCard>
  )
}
