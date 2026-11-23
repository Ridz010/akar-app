'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import { verifyObservation } from '../actions'
import type { VerificationFormState } from '../types'

const DECISIONS = [
  { value: 'verified', label: 'Setujui' },
  { value: 'revision_required', label: 'Minta revisi' },
  { value: 'rejected', label: 'Tolak' },
] as const

const initialState: VerificationFormState = { status: 'idle' }

export function DecisionForm({ observationId }: { observationId: string }) {
  const [state, action, pending] = useActionState(verifyObservation, initialState)

  if (state.status === 'success') {
    return (
      <p role="status" className="text-sm text-verified">
        {state.message}
      </p>
    )
  }

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="observationId" value={observationId} />
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Keputusan</legend>
        {DECISIONS.map((decision) => (
          <label
            key={decision.value}
            className="cursor-pointer rounded-full border border-line px-3.5 py-1.5 text-sm text-ink has-checked:border-sage-900 has-checked:bg-sage-900 has-checked:text-white"
          >
            <input
              type="radio"
              name="decision"
              value={decision.value}
              className="sr-only"
              required
            />
            {decision.label}
          </label>
        ))}
      </fieldset>
      <Textarea
        name="note"
        placeholder="Catatan untuk kontributor (wajib bila meminta revisi atau menolak)"
        className="min-h-20 rounded-xl border-line"
      />
      {state.status === 'error' && (
        <p role="alert" className="text-sm text-rejected">
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={pending} variant="outline" className="h-10 rounded-full px-5">
        {pending ? 'Menyimpan…' : 'Simpan keputusan'}
      </Button>
    </form>
  )
}
