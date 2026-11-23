'use client'

import { ArrowRight, KeyRound } from 'lucide-react'

import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '@/config/demo'

type DemoAccountsProps = {
  disabled?: boolean
  onPick: (email: string, password: string) => void
}

export function DemoAccounts({ disabled = false, onPick }: DemoAccountsProps) {
  return (
    <section aria-labelledby="demo-title" className="space-y-3 border-t border-white/15 pt-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id="demo-title" className="font-sans text-sm text-white/85">
          Coba dengan akun demo
        </h2>
        <p className="flex items-center gap-1.5 text-xs text-white/70">
          <KeyRound aria-hidden className="size-3.5" />
          <span>
            Sandi{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-lime-300">{DEMO_PASSWORD}</code>
          </span>
        </p>
      </div>
      <ul className="space-y-2">
        {DEMO_ACCOUNTS.map((account) => (
          <li key={account.email}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPick(account.email, DEMO_PASSWORD)}
              className="group flex w-full items-center gap-3 rounded-2xl bg-white/8 px-4 py-3 text-left ring-1 ring-white/15 transition-colors outline-none hover:bg-white/15 focus-visible:ring-3 focus-visible:ring-lime-300/60 disabled:opacity-60"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-white">
                  Masuk sebagai {account.label.toLowerCase()}
                </span>
                <span className="block truncate text-xs text-white/65">
                  {account.email} · {account.summary}
                </span>
              </span>
              <ArrowRight
                aria-hidden
                className="size-4 shrink-0 text-lime-300 transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
