'use client'

import { Search } from 'lucide-react'
import { useActionState, useMemo, useState } from 'react'

import { ROLES, ROLE_LABELS, type Role } from '@/config/permissions'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

import { changeUserRole } from '../actions'
import type { RoleFormState, UserSummary } from '../types'

const initialState: RoleFormState = { status: 'idle' }

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')
}

function RoleForm({ user, isSelf }: { user: UserSummary; isSelf: boolean }) {
  const [state, action, pending] = useActionState(changeUserRole, initialState)

  return (
    <form action={action} className="flex flex-col items-start gap-1.5 sm:items-end">
      <input type="hidden" name="userId" value={user.id} />
      <div className="flex items-center gap-2">
        <label htmlFor={`role-${user.id}`} className="sr-only">
          Peran {user.fullName || 'pengguna'}
        </label>
        <select
          id={`role-${user.id}`}
          name="role"
          defaultValue={user.role}
          disabled={isSelf || pending}
          className="h-10 rounded-full border border-line bg-white px-3 text-sm text-ink outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isSelf || pending}
          className="h-10 rounded-full bg-sage-900 px-4 text-sm text-white transition-colors outline-none hover:bg-sage-800 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
        >
          {pending ? 'Menyimpan…' : 'Simpan'}
        </button>
      </div>
      {isSelf && <p className="text-xs text-slate">Ini akunmu</p>}
      {state.message && (
        <p
          role={state.status === 'error' ? 'alert' : 'status'}
          className={cn('text-xs', state.status === 'error' ? 'text-rejected' : 'text-verified')}
        >
          {state.message}
        </p>
      )}
    </form>
  )
}

export function UserDirectory({
  users,
  currentUserId,
}: {
  users: UserSummary[]
  currentUserId: string
}) {
  const [query, setQuery] = useState('')
  const [role, setRole] = useState<Role | null>(null)

  const counts = useMemo(() => {
    const result = Object.fromEntries(ROLES.map((value) => [value, 0])) as Record<Role, number>
    for (const user of users) result[user.role] += 1
    return result
  }, [users])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return users.filter(
      (user) =>
        (role === null || user.role === role) &&
        (!needle || user.fullName.toLowerCase().includes(needle)),
    )
  }, [users, query, role])

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {ROLES.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={role === value}
            onClick={() => setRole(role === value ? null : value)}
            className={cn(
              'rounded-[1.25rem] p-5 text-left ring-1 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
              role === value
                ? 'bg-sage-900 text-white ring-sage-900'
                : 'bg-white text-ink ring-line hover:bg-surface',
            )}
          >
            <span className={cn('text-sm', role === value ? 'text-white/75' : 'text-slate')}>
              {ROLE_LABELS[value]}
            </span>
            <span className="mt-2 block font-display text-4xl leading-none tabular-nums">
              {counts[value]}
            </span>
          </button>
        ))}
      </div>

      <label className="relative block">
        <span className="sr-only">Cari pengguna</span>
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari nama pengguna"
          className="h-12 w-full rounded-full border border-line bg-white pr-4 pl-11 text-base text-ink outline-none placeholder:text-slate focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </label>

      <p className="text-sm text-slate" aria-live="polite">
        Menampilkan {visible.length} dari {users.length} pengguna
      </p>

      <ul className="divide-y divide-line rounded-[1.5rem] bg-white ring-1 ring-line">
        {visible.map((user) => (
          <li
            key={user.id}
            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-4">
              <span
                aria-hidden
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sm text-sage-900"
              >
                {initials(user.fullName)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-ink">{user.fullName || 'Tanpa nama'}</p>
                <p className="text-sm text-slate">
                  {ROLE_LABELS[user.role]}
                  {user.groupName && ` · ${user.groupName}`} · bergabung{' '}
                  {formatDate(user.createdAt, 'shortDate')}
                </p>
              </div>
            </div>
            <RoleForm user={user} isSelf={user.id === currentUserId} />
          </li>
        ))}
        {visible.length === 0 && (
          <li className="p-8 text-center text-slate">Tidak ada pengguna yang cocok.</li>
        )}
      </ul>
    </div>
  )
}
