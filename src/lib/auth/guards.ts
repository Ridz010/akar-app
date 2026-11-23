import 'server-only'

import { redirect } from 'next/navigation'

import type { Role } from '@/config/permissions'
import { isSupabaseConfigured } from '@/lib/env'

import { getCurrentUser, type CurrentUser } from './get-current-user'

const PREVIEW_USER: CurrentUser = {
  id: 'preview',
  email: null,
  fullName: null,
  role: 'admin',
}

export async function requireUser(): Promise<CurrentUser> {
  if (!isSupabaseConfigured()) return PREVIEW_USER
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function requireRole(...roles: Role[]): Promise<CurrentUser> {
  const user = await requireUser()
  if (!roles.includes(user.role)) redirect('/dashboard')
  return user
}

export function isPreviewUser(user: CurrentUser) {
  return user.id === PREVIEW_USER.id
}
