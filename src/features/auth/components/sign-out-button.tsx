import { LogOut } from 'lucide-react'

import { signOut } from '../actions'

export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={signOut}>
      <button type="submit" className={className}>
        <LogOut aria-hidden className="size-4" />
        Keluar
      </button>
    </form>
  )
}
