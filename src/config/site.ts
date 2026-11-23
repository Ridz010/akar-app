import type { Role } from './permissions'

export const siteConfig = {
  name: 'AKAR',
  fullName: 'AI-Assisted Community-Based Mangrove Monitoring Platform',
  tagline: 'Lindungi akar, berdayakan komunitas',
  taglineEn: 'Protect the roots, empower the community',
  title: 'AKAR — Pemantauan mangrove berbasis komunitas',
  description:
    'AKAR membantu masyarakat mengenali spesies mangrove dari foto daun, melaporkan kondisi lapangan, dan menindaklanjutinya bersama pengelola konservasi.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ogImage: '/img/web/og-akar.jpg',
  contactEmail: '',
} as const

export type NavIcon =
  | 'dashboard'
  | 'scanner'
  | 'map'
  | 'learn'
  | 'observations'
  | 'locations'
  | 'activities'
  | 'verification'
  | 'users'
  | 'profile'

export type NavItem = {
  title: string
  href: string
  icon?: NavIcon
}

export const landingNav: NavItem[] = [
  { title: 'Beranda', href: '/' },
  { title: 'Fitur', href: '/#fitur' },
  { title: 'Peta', href: '/map' },
  { title: 'Edukasi', href: '/knowledge' },
]

const NAV = {
  dashboard: { title: 'Dasbor', href: '/dashboard', icon: 'dashboard' },
  scanner: { title: 'Pindai AI', href: '/scanner', icon: 'scanner' },
  map: { title: 'Peta mangrove', href: '/mangrove-map', icon: 'map' },
  learn: { title: 'Pusat pengetahuan', href: '/learn', icon: 'learn' },
  observations: { title: 'Laporan saya', href: '/observations', icon: 'observations' },
  locations: { title: 'Riwayat lokasi', href: '/locations', icon: 'locations' },
  activities: { title: 'Aktivitas konservasi', href: '/activities', icon: 'activities' },
  verification: { title: 'Verifikasi', href: '/admin/verification', icon: 'verification' },
  users: { title: 'Kelola pengguna', href: '/admin/users', icon: 'users' },
  profile: { title: 'Profil', href: '/profile', icon: 'profile' },
} satisfies Record<string, NavItem>

const SHARED_NAV: NavItem[] = [
  NAV.dashboard,
  NAV.scanner,
  NAV.map,
  NAV.learn,
  NAV.observations,
  NAV.locations,
]

export const appNavFor: Record<Role, { label: string; items: NavItem[] }> = {
  community: { label: 'Ruang komunitas', items: [...SHARED_NAV, NAV.profile] },
  coordinator: {
    label: 'Ruang koordinator',
    items: [...SHARED_NAV, NAV.activities, NAV.profile],
  },
  admin: {
    label: 'Ruang administrator',
    items: [...SHARED_NAV, NAV.activities, NAV.verification, NAV.users, NAV.profile],
  },
}
