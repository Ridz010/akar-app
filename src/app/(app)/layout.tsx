import type { ReactNode } from 'react'

import { AuthenticatedShell } from '../_shell/authenticated-shell'

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AuthenticatedShell areaLabel="Ruang AKAR">{children}</AuthenticatedShell>
}
