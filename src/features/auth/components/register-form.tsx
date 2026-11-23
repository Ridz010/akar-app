'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui/button'

import { signUp } from '../actions'
import { initialAuthFormState } from '../types'
import { FormField } from './form-field'
import { FormMessage } from './form-message'

export function RegisterForm({ defaultEmail }: { defaultEmail?: string }) {
  const [state, action, pending] = useActionState(signUp, initialAuthFormState)

  if (state.status === 'success') return <FormMessage state={state} />

  return (
    <form action={action} className="space-y-5" noValidate>
      <FormField
        name="fullName"
        label="Nama lengkap"
        autoComplete="name"
        defaultValue={state.values?.fullName}
        error={state.fieldErrors?.fullName}
        required
      />
      <FormField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="nama@email.com"
        defaultValue={state.values?.email ?? defaultEmail}
        error={state.fieldErrors?.email}
        required
      />
      <FormField
        name="password"
        label="Kata sandi"
        type="password"
        autoComplete="new-password"
        minLength={8}
        error={state.fieldErrors?.password}
        required
      />
      <FormMessage state={state} />
      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-full text-base font-normal"
      >
        {pending ? 'Memproses…' : 'Buat akun'}
      </Button>
    </form>
  )
}
