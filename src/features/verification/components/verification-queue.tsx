import { ImageOff, MapPin } from 'lucide-react'
import Image from 'next/image'

import { StatusBadge } from '@/components/shared/status-badge'
import { PREDICTION_STATUS_LABELS, SITE_CONDITION_LABELS } from '@/config/constants'
import { formatDate, formatPercent } from '@/lib/format'

import type { QueueItem } from '../types'
import { DecisionForm } from './decision-form'

function predictionTitle(item: QueueItem) {
  const prediction = item.prediction
  if (!prediction) return 'Tanpa prediksi spesies'
  return prediction.speciesName ?? prediction.scientificName ?? 'Tidak dikenali model'
}

export function VerificationQueue({ items }: { items: QueueItem[] }) {
  return (
    <ul className="space-y-5">
      {items.map((item) => (
        <li
          key={item.id}
          className="grid gap-6 rounded-[1.5rem] bg-white p-5 ring-1 ring-line sm:p-6 xl:grid-cols-[14rem_1fr_22rem] xl:gap-8"
        >
          <a
            href={item.photoUrl ?? undefined}
            target="_blank"
            rel="noreferrer"
            aria-label="Buka foto laporan ukuran penuh"
            className="relative block aspect-4/3 overflow-hidden rounded-2xl bg-surface xl:aspect-square"
          >
            {item.photoUrl ? (
              <Image
                src={item.photoUrl}
                alt="Foto laporan dari kontributor"
                fill
                unoptimized
                sizes="(min-width: 1280px) 14rem, 100vw"
                className="object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-slate">
                <ImageOff aria-hidden className="size-6" />
              </span>
            )}
          </a>

          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={item.status} />
              {item.prediction && <StatusBadge status="prediction" />}
            </div>
            <div>
              <p className="font-display text-2xl leading-tight text-ink">
                {predictionTitle(item)}
              </p>
              {item.prediction?.scientificName && item.prediction.speciesName && (
                <p className="text-sm text-slate italic">{item.prediction.scientificName}</p>
              )}
            </div>
            <p className="flex flex-wrap items-center gap-x-1.5 text-sm text-slate">
              <MapPin aria-hidden className="size-3.5" />
              {item.locationName ?? `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`}
              <span>· {formatDate(item.observedAt)}</span>
              <span>· {SITE_CONDITION_LABELS[item.condition]}</span>
            </p>
            {item.prediction && (
              <p className="text-sm text-slate">
                {PREDICTION_STATUS_LABELS[item.prediction.status]} · keyakinan{' '}
                {formatPercent(item.prediction.confidence)}
              </p>
            )}
            {item.prediction && item.prediction.observedTraits.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {item.prediction.observedTraits.map((trait) => (
                  <li
                    key={trait}
                    className="rounded-full bg-surface px-2.5 py-1 text-xs text-ink ring-1 ring-line"
                  >
                    {trait}
                  </li>
                ))}
              </ul>
            )}
            {item.notes && (
              <p className="max-w-prose border-l-2 border-sage-300 pl-3 text-ink">{item.notes}</p>
            )}
          </div>

          <DecisionForm observationId={item.id} />
        </li>
      ))}
    </ul>
  )
}
