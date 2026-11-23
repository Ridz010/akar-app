export const ROLES = ['community', 'coordinator', 'admin'] as const

export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  community: 'Masyarakat & relawan',
  coordinator: 'Koordinator kelompok konservasi',
  admin: 'Administrator',
}

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value)
}

export const VERIFIER_ROLES: readonly Role[] = ['coordinator', 'admin']

export function hasRole(role: Role, allowed: readonly Role[]): boolean {
  return allowed.includes(role)
}
