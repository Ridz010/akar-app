'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui/button'

import { signIn } from '../actions'
import { initialAuthFormState } from '../types'
import { FormField } from './form-field'
import { FormMessage } from './form-message'

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signIn, initialAuthFormState)

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={next ?? ''} />
      <FormField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="nama@email.com"
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
        required
      />
      <FormField
        name="password"
        label="Kata sandi"
        type="password"
        autoComplete="current-password"
        error={state.fieldErrors?.password}
        required
      />
      <FormMessage state={state} />
      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-full text-base font-normal"
      >
        {pending ? 'Memproses…' : 'Masuk'}
      </Button>
    </form>
  )
}
