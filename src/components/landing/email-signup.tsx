'use client'

import { useRouter } from 'next/navigation'

import CurvedInput from '@/components/motion/CurvedInput'

export function EmailSignup() {
  const router = useRouter()

  const submit = (email: string) => {
    const value = email.trim()
    router.push(value ? `/register?email=${encodeURIComponent(value)}` : '/register')
  }

  return (
    <div className="w-full max-w-lg">
      <CurvedInput
        theme="light"
        type="email"
        name="email"
        placeholder="Email kamu"
        ariaLabel="Email untuk mendaftar"
        buttonText="Daftar"
        width="100%"
        height={60}
        bend={18}
        cornerRadius={30}
        fontSize={16}
        backgroundColor="#ffffff"
        textColor="#18211a"
        placeholderColor="#5e6a60"
        borderColor="#c8d6c5"
        buttonColor="#cfea5e"
        buttonTextColor="#18211a"
        iconColor="#5b735c"
        shadowColor="#1c261d"
        shadowSize="md"
        onSubmit={submit}
      />
    </div>
  )
}
