import type { Role } from './permissions'

export const DEMO_LOGIN_ENABLED = process.env.NEXT_PUBLIC_DEMO_LOGIN !== 'off'

export const DEMO_PASSWORD = 'AkarDemo#2026'

export const DEMO_ACCOUNTS: { role: Role; label: string; email: string; summary: string }[] = [
  {
    role: 'community',
    label: 'Relawan',
    email: 'demo-relawan@example.com',
    summary: 'Pindai daun, buat laporan, ikut aktivitas',
  },
  {
    role: 'coordinator',
    label: 'Koordinator',
    email: 'demo-koordinator@example.com',
    summary: 'Kelola aktivitas konservasi',
  },
  {
    role: 'admin',
    label: 'Administrator',
    email: 'demo-admin@example.com',
    summary: 'Verifikasi laporan dan kelola pengguna',
  },
]
