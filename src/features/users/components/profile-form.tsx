'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROLE_LABELS } from '@/config/permissions'

import { updateProfile } from '../actions'
import type { Profile, ProfileFormState } from '../types'

const initialState: ProfileFormState = { status: 'idle' }

type ProfileFormProps = {
  profile: Profile
  email: string | null
}

export function ProfileForm({ profile, email }: ProfileFormProps) {
  const [state, action, pending] = useActionState(updateProfile, initialState)

  return (
    <form action={action} className="max-w-xl space-y-8">
      <dl className="grid grid-cols-2 border-y border-line">
        <div className="border-r border-line py-4 pr-4">
          <dt className="text-sm text-slate">Email</dt>
          <dd className="mt-1 truncate text-ink">{email ?? 'Tidak tersedia'}</dd>
        </div>
        <div className="py-4 pl-4">
          <dt className="text-sm text-slate">Peran</dt>
          <dd className="mt-1 text-ink">{ROLE_LABELS[profile.role]}</dd>
        </div>
      </dl>

      <div className="space-y-2">
        <Label htmlFor="fullName" className="font-normal text-ink">
          Nama lengkap
        </Label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={profile.fullName}
          autoComplete="name"
          required
          className="h-12 rounded-xl border-line px-4 text-base"
        />
      </div>

      <label className="flex items-start gap-3 text-ink">
        <input
          type="checkbox"
          name="showNamePublicly"
          defaultChecked={profile.showNamePublicly}
          className="mt-1 size-4 accent-sage-700"
        />
        <span>
          Tampilkan namaku pada laporan publik
          <span className="block text-sm text-slate">
            Bila tidak dicentang, laporanmu tampil tanpa nama.
          </span>
        </span>
      </label>

      {state.message && (
        <p
          role={state.status === 'error' ? 'alert' : 'status'}
          className={state.status === 'error' ? 'text-sm text-rejected' : 'text-sm text-verified'}
        >
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-12 rounded-full px-6 text-base font-normal"
      >
        {pending ? 'Menyimpan…' : 'Simpan perubahan'}
      </Button>
    </form>
  )
}
