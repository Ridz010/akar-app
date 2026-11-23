import type { ComponentProps } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FormFieldProps = ComponentProps<typeof Input> & {
  name: string
  label: string
  error?: string
}

export function FormField({ name, label, error, ...props }: FormFieldProps) {
  const errorId = `${name}-error`
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="font-normal text-white/85">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="h-12 rounded-full border-transparent bg-white px-5 text-base text-ink placeholder:text-slate"
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-[#ffb4ab]">
          {error}
        </p>
      )}
    </div>
  )
}
