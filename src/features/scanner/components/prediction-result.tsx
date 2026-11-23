import {
  ArrowUpRight,
  BookOpen,
  Camera,
  Check,
  Eye,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Users,
  type LucideIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { StatusBadge } from '@/components/shared/status-badge'
import { buttonVariants } from '@/components/ui/button'
import {
  PHOTO_QUALITY_LABELS,
  PREDICTION_STATUS_LABELS,
  PREDICTION_THRESHOLDS,
  type PhotoQuality,
} from '@/config/constants'
import { formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'

import type { Prediction } from '../types'

type PredictionResultProps = {
  prediction: Prediction
  photoUrl?: string | null
  onRetake?: () => void
}

function speciesName(prediction: Prediction) {
  const species = prediction.species
  if (!species) return null
  return species.local_name ?? species.scientific_name
}

function verdict(prediction: Prediction): { title: string; body: string } {
  const name = speciesName(prediction)
  if (prediction.prediction_status === 'confident' && name) {
    return {
      title: `Kemungkinan besar ${name}`,
      body: `Ciri daun di fotomu sangat cocok dengan ${name}. Saat kamu melapor, pengelola tetap memeriksa hasil ini sebelum tampil di peta.`,
    }
  }
  if (prediction.prediction_status === 'needs_review' && name) {
    return {
      title: `Mirip ${name}, tetapi belum pasti`,
      body: 'Ada kemiripan, tetapi belum cukup kuat untuk disimpulkan. Cocokkan ciri di bawah, atau foto ulang daun lain dari pohon yang sama.',
    }
  }
  if (prediction.observed_traits.length === 0) {
    return {
      title: 'Belum bisa dikenali',
      body: 'Foto ini sepertinya bukan daun, atau daunnya tidak terlihat jelas. Coba foto ulang satu daun utuh dengan latar polos.',
    }
  }
  return {
    title: 'Belum bisa dikenali',
    body: 'Ciri daun ini tidak cocok dengan spesies yang ada di katalog AKAR. Kamu tetap bisa melapor; pengelola akan menentukan spesiesnya.',
  }
}

function agreementText(agreement: number | null) {
  if (agreement === null) return null
  if (agreement >= 0.99) return 'Semua analisis sepakat'
  if (agreement >= 0.6) return 'Sebagian besar analisis sepakat'
  return 'Analisis belum sepakat'
}

function splitTraits(text: string | null) {
  if (!text) return []
  return text
    .split(/(?<=\.)\s+/)
    .map((part) => part.trim().replace(/\.$/, ''))
    .filter(Boolean)
}

function Panel({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: LucideIcon
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('rounded-[1.25rem] bg-white p-5 ring-1 ring-line sm:p-6', className)}>
      <h3 className="flex items-center gap-2 font-sans text-sm text-slate">
        <Icon aria-hidden className="size-4 text-sage-700" strokeWidth={1.7} />
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function ConfidenceMeter({ value }: { value: number }) {
  const { review, confident } = PREDICTION_THRESHOLDS
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="font-display text-4xl leading-none text-ink tabular-nums">
          {formatPercent(value)}
        </span>
        <span className="text-sm text-slate">keyakinan model</span>
      </div>
      <div
        role="meter"
        aria-label="Tingkat keyakinan model"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        className="relative mt-4 h-2.5 rounded-full bg-line"
      >
        <div
          className="h-full rounded-full bg-ink transition-[width] duration-700 ease-out-soft"
          style={{ width: formatPercent(value) }}
        />
        {[review, confident].map((mark) => (
          <span
            key={mark}
            aria-hidden
            className="absolute -top-1 h-4.5 w-px bg-slate/60"
            style={{ left: formatPercent(mark) }}
          />
        ))}
      </div>
      <div aria-hidden className="relative mt-2 h-4 text-[0.6875rem] text-slate">
        <span className="absolute left-0">Rendah</span>
        <span className="absolute -translate-x-1/2" style={{ left: formatPercent(review) }}>
          Perlu diperiksa
        </span>
        <span className="absolute right-0">Cukup yakin</span>
      </div>
    </div>
  )
}

function Chip({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'warn' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs',
        tone === 'warn' ? 'bg-pending-bg text-pending' : 'bg-surface text-ink ring-1 ring-line',
      )}
    >
      {children}
    </span>
  )
}

function qualityTone(quality: PhotoQuality | null) {
  return quality === 'good' || quality === null ? 'neutral' : 'warn'
}

export function PredictionResult({ prediction, photoUrl, onRetake }: PredictionResultProps) {
  const species = prediction.species
  const recognized = prediction.prediction_status !== 'unrecognized' && species
  const { title, body } = verdict(prediction)
  const alternatives = prediction.top_k.slice(recognized ? 1 : 0, 4)
  const speciesTraits = splitTraits(species?.leaf_traits ?? null)
  const agreement = agreementText(prediction.agreement)

  return (
    <section aria-live="polite" aria-label="Hasil identifikasi" className="space-y-5">
      <div className="rounded-[1.5rem] bg-sage-50 p-5 ring-1 ring-line sm:p-6">
        <div className="flex gap-4">
          {photoUrl && (
            <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-line sm:size-24">
              <Image
                src={photoUrl}
                alt="Foto daun yang kamu kirim"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status="prediction" />
              <span className="text-xs text-slate">
                {PREDICTION_STATUS_LABELS[prediction.prediction_status]}
              </span>
            </div>
            <h2 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">
              {title}
            </h2>
            {recognized && (
              <p className="mt-1 text-slate">
                <span className="italic">{species.scientific_name}</span>
                {species.family && ` · suku ${species.family}`}
              </p>
            )}
          </div>
        </div>
        <p className="mt-5 text-ink">{body}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {agreement && (
            <Chip tone={(prediction.agreement ?? 1) < 0.6 ? 'warn' : 'neutral'}>
              <Users aria-hidden className="size-3.5" />
              {agreement}
            </Chip>
          )}
          {prediction.photo_quality && (
            <Chip tone={qualityTone(prediction.photo_quality)}>
              <Camera aria-hidden className="size-3.5" />
              {PHOTO_QUALITY_LABELS[prediction.photo_quality]}
            </Chip>
          )}
        </div>
      </div>

      {recognized && (
        <Panel icon={ListChecks} title="Seberapa yakin?">
          <ConfidenceMeter value={prediction.confidence} />
          <p className="mt-4 text-sm text-slate">
            Angka ini perkiraan model, bukan kepastian. Di atas{' '}
            {formatPercent(PREDICTION_THRESHOLDS.confident)} berarti ciri daun sangat cocok; di
            antara {formatPercent(PREDICTION_THRESHOLDS.review)} dan{' '}
            {formatPercent(PREDICTION_THRESHOLDS.confident)} berarti perlu dicek manusia.
          </p>
        </Panel>
      )}

      {(prediction.observed_traits.length > 0 || speciesTraits.length > 0) && (
        <div className="grid gap-5 md:grid-cols-2">
          {prediction.observed_traits.length > 0 && (
            <Panel icon={Eye} title="Yang terlihat di fotomu">
              <ul className="space-y-2.5">
                {prediction.observed_traits.map((trait) => (
                  <li key={trait} className="flex gap-2.5 text-sm text-ink">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-sage-700" />
                    {trait}
                  </li>
                ))}
              </ul>
            </Panel>
          )}
          {recognized && speciesTraits.length > 0 && (
            <Panel icon={BookOpen} title={`Ciri khas ${speciesName(prediction)}`}>
              <ul className="space-y-2.5">
                {speciesTraits.map((trait) => (
                  <li key={trait} className="flex gap-2.5 text-sm text-ink">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sage-600" />
                    {trait}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate">
                Cocokkan dengan daun aslinya. Bila ada ciri yang jelas berbeda, catat di laporan.
              </p>
            </Panel>
          )}
        </div>
      )}

      {prediction.photo_feedback && (
        <div className="flex gap-3 rounded-[1.25rem] bg-pending-bg p-5 text-pending">
          <Lightbulb aria-hidden className="mt-0.5 size-5 shrink-0" strokeWidth={1.7} />
          <div>
            <p className="font-medium">Tips foto berikutnya</p>
            <p className="mt-1 text-sm">{prediction.photo_feedback}</p>
          </div>
        </div>
      )}

      {alternatives.length > 0 && (
        <Panel icon={ListChecks} title={recognized ? 'Kemungkinan lain' : 'Paling mendekati'}>
          <ul className="space-y-4">
            {alternatives.map((item) => (
              <li key={item.label}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-ink">
                    {item.local_name ?? item.label}
                    {item.local_name && (
                      <span className="ml-1.5 text-slate italic">{item.label}</span>
                    )}
                  </span>
                  <span className="text-slate tabular-nums">{formatPercent(item.confidence)}</span>
                </div>
                <div aria-hidden className="mt-1.5 h-1.5 rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-slate/70"
                    style={{ width: formatPercent(item.confidence) }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <div className="rounded-[1.25rem] bg-sage-900 p-5 text-white sm:p-6">
        <p className="text-sm text-white/70">Langkah berikutnya</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/observations/new?prediksi=${prediction.id}`}
            className={cn(buttonVariants(), 'h-11 rounded-full px-5 font-normal')}
          >
            Laporkan temuan ini
            <ArrowUpRight aria-hidden />
          </Link>
          {onRetake && (
            <button
              type="button"
              onClick={onRetake}
              className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm text-white ring-1 ring-white/30 transition-colors outline-none hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-white/60"
            >
              <RotateCcw aria-hidden className="size-4" />
              Foto ulang
            </button>
          )}
          {recognized && prediction.predicted_label && (
            <Link
              href={`/learn#${prediction.predicted_label}`}
              className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm text-white ring-1 ring-white/30 transition-colors outline-none hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-white/60"
            >
              <BookOpen aria-hidden className="size-4" />
              Pelajari spesies ini
            </Link>
          )}
        </div>
      </div>

      <details className="group rounded-[1.25rem] px-1 text-sm text-slate">
        <summary className="cursor-pointer list-none text-ink outline-none group-open:mb-2 focus-visible:underline">
          Bagaimana AKAR menilai foto ini?
        </summary>
        <p>
          Fotomu dianalisis beberapa kali, dari foto utuh dan dari bagian tengahnya. Setiap analisis
          mencatat ciri daun lebih dulu, lalu mencocokkannya dengan ciri pembeda spesies di katalog
          AKAR. Hasilnya digabung: semakin banyak analisis yang sepakat, semakin tinggi
          keyakinannya. Foto buram atau analisis yang tidak sepakat tidak akan pernah dinyatakan
          &ldquo;cukup yakin&rdquo;.
        </p>
        <p className="mt-2 text-xs">Model: {prediction.model_version}</p>
      </details>
    </section>
  )
}
