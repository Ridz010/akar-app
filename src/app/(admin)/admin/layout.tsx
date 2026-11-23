import type { ReactNode } from 'react'

import { AuthenticatedShell } from '../../_shell/authenticated-shell'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthenticatedShell areaLabel="Ruang administrator" roles={['admin']}>
      {children}
    </AuthenticatedShell>
  )
}
