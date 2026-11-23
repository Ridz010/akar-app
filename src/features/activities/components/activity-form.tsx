'use client'

import { useActionState, useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { createActivity } from '../actions'
import type { ActivityFormState, LocationOption } from '../types'

const initialState: ActivityFormState = { status: 'idle' }

const fieldClass = 'h-11 rounded-xl border-line px-4 text-base'

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="text-sm text-rejected">
      {message}
    </p>
  )
}

export function ActivityForm({ locations }: { locations: LocationOption[] }) {
  const [state, action, pending] = useActionState(createActivity, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const errors = state.fieldErrors ?? {}

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset()
  }, [state])

  return (
    <form
      ref={formRef}
      action={action}
      className="space-y-5 rounded-[1.5rem] bg-white p-6 ring-1 ring-line sm:p-7"
    >
      <div>
        <h2 className="font-display text-2xl text-ink">Umumkan kegiatan</h2>
        <p className="mt-1 text-sm text-slate">
          Penanaman, bersih pesisir, atau pemantauan bersama. Waktu dalam WIB.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title" className="font-normal text-ink">
          Judul kegiatan
        </Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="Penanaman bibit Rhizophora"
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? 'title-error' : undefined}
          className={fieldClass}
        />
        <FieldError id="title-error" message={errors.title} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="locationId" className="font-normal text-ink">
          Lokasi
        </Label>
        <select
          id="locationId"
          name="locationId"
          defaultValue=""
          className="h-11 w-full rounded-xl border border-line bg-white px-3 text-base text-ink outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Belum ditentukan</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
        <FieldError id="location-error" message={errors.locationId} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startsAt" className="font-normal text-ink">
            Mulai
          </Label>
          <Input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            required
            aria-invalid={errors.startsAt ? true : undefined}
            className={fieldClass}
          />
          <FieldError id="startsAt-error" message={errors.startsAt} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endsAt" className="font-normal text-ink">
            Selesai <span className="text-slate">(opsional)</span>
          </Label>
          <Input
            id="endsAt"
            name="endsAt"
            type="datetime-local"
            aria-invalid={errors.endsAt ? true : undefined}
            className={fieldClass}
          />
          <FieldError id="endsAt-error" message={errors.endsAt} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-normal text-ink">
          Deskripsi <span className="text-slate">(opsional)</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Titik kumpul, perlengkapan yang perlu dibawa, dan kontak koordinator."
          className="rounded-xl border-line px-4 py-3 text-base"
        />
        <FieldError id="description-error" message={errors.description} />
      </div>

      {state.message && (
        <p
          role={state.status === 'error' ? 'alert' : 'status'}
          className={
            state.status === 'error'
              ? 'rounded-xl bg-rejected-bg p-3 text-sm text-rejected'
              : 'rounded-xl bg-verified-bg p-3 text-sm text-verified'
          }
        >
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-full text-base font-normal"
      >
        {pending ? 'Menyimpan…' : 'Umumkan kegiatan'}
      </Button>
    </form>
  )
}
