import type { Role } from '@/config/permissions'

export type Profile = {
  id: string
  fullName: string
  role: Role
  showNamePublicly: boolean
}

export type ProfileFormState = {
  status: 'idle' | 'error' | 'success'
  message?: string
}

export type UserSummary = {
  id: string
  fullName: string
  role: Role
  groupName: string | null
  createdAt: string
}

export type RoleFormState = {
  status: 'idle' | 'error' | 'success'
  message?: string
}
