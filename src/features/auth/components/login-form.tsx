'use client'

import { useActionState, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { DEMO_LOGIN_ENABLED } from '@/config/demo'

import { signIn } from '../actions'
import { initialAuthFormState } from '../types'
import { DemoAccounts } from './demo-accounts'
import { FormField } from './form-field'
import { FormMessage } from './form-message'

function setField(form: HTMLFormElement, name: string, value: string) {
  const field = form.elements.namedItem(name)
  if (field instanceof HTMLInputElement) field.value = value
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signIn, initialAuthFormState)
  const formRef = useRef<HTMLFormElement>(null)

  const signInAsDemo = (email: string, password: string) => {
    const form = formRef.current
    if (!form) return
    setField(form, 'email', email)
    setField(form, 'password', password)
    form.requestSubmit()
  }

  return (
    <div className="space-y-6">
      <form ref={formRef} action={action} className="space-y-5" noValidate>
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
      {DEMO_LOGIN_ENABLED && <DemoAccounts disabled={pending} onPick={signInAsDemo} />}
    </div>
  )
}
