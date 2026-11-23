export type AuthFormState = {
  status: 'idle' | 'error' | 'success'
  message?: string
  fieldErrors?: Partial<Record<'fullName' | 'email' | 'password', string>>
  values?: { fullName?: string; email?: string }
}

export const initialAuthFormState: AuthFormState = { status: 'idle' }
