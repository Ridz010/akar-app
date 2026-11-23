import { CoastScene } from '@/components/illustrations/coast-scene'
import { SKY_GRADIENT } from '@/components/illustrations/parts'
import { Reveal } from '@/components/motion/reveal'
import { ROLE_LABELS, type Role } from '@/config/permissions'

import { SectionIntro } from './section-intro'

const ROLES: { role: Role; summary: string; points: string[] }[] = [
  {
    role: 'community',
    summary: 'Mata dan telinga di lapangan.',
    points: [
      'Kenali spesies cukup dari foto daun',
      'Laporkan kondisi mangrove di sekitarmu',
      'Ikuti kegiatan yang lahir dari laporanmu',
    ],
  },
  {
    role: 'coordinator',
    summary: 'Penggerak aksi di wilayahnya.',
    points: [
      'Susun aktivitas konservasi dari temuan lapangan',
      'Pantau perubahan kondisi lokasi',
      'Kelola peserta penanaman dan bersih pesisir',
    ],
  },
  {
    role: 'admin',
    summary: 'Pengelola platform secara keseluruhan.',
    points: [
      'Verifikasi laporan sebelum tampil di peta',
      'Kelola pengguna dan peran',
      'Jaga kualitas data di peta publik',
    ],
  },
]

export function RolesSection() {
  return (
    <section
      id="peran"
      aria-labelledby="peran-title"
      className="relative isolate scroll-mt-24 overflow-hidden"
      style={{ background: SKY_GRADIENT }}
    >
      <div className="relative z-10 container-page pt-24 sm:pt-32">
        <SectionIntro
          id="peran-title"
          label="Peran"
          title="Dibuat untuk semua yang menjaga pesisir"
        />

        <Reveal stagger={0.1} className="mt-12 grid gap-5 sm:mt-16 lg:grid-cols-3">
          {ROLES.map(({ role, summary, points }) => (
            <article
              key={role}
              className="flex flex-col rounded-[1.5rem] bg-white/95 p-6 shadow-[0_30px_60px_-30px_rgba(23,50,58,0.55)] ring-1 ring-white backdrop-blur sm:p-7"
            >
              <h3 className="font-display text-2xl leading-tight text-ink sm:text-[1.75rem]">
                {ROLE_LABELS[role]}
              </h3>
              <p className="mt-2 text-slate">{summary}</p>
              <ul className="mt-6 space-y-2.5 border-t border-line pt-5">
                {points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm text-ink">
                    <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-sage-600" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Reveal>
      </div>
      <CoastScene className="-mt-28 h-[clamp(16rem,34vw,30rem)] sm:-mt-36" />
    </section>
  )
}
