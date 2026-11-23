'use client'

import 'leaflet/dist/leaflet.css'

import { circleMarker, latLngBounds, map as createMap, tileLayer } from 'leaflet'
import { useEffect, useRef } from 'react'

import { MAP_DEFAULT_VIEW, SITE_CONDITION_LABELS } from '@/config/constants'
import { formatDate } from '@/lib/format'

import { CONDITION_COLORS } from '../condition-style'
import type { MapPoint } from '../types'

type MangroveMapProps = {
  points: MapPoint[]
  scrollWheelZoom?: boolean
}

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ESCAPES[char])
}

function popupHtml(point: MapPoint) {
  const title = point.speciesName ?? point.scientificName ?? 'Spesies belum ditetapkan'
  const lines = [`<p class="text-base text-ink">${escapeHtml(title)}</p>`]
  if (point.scientificName && point.speciesName) {
    lines.push(`<p class="text-xs text-slate italic">${escapeHtml(point.scientificName)}</p>`)
  }
  if (point.locationName) {
    lines.push(`<p class="text-xs text-slate">${escapeHtml(point.locationName)}</p>`)
  }
  lines.push(
    `<p class="text-xs text-slate">${SITE_CONDITION_LABELS[point.condition]} · ${formatDate(point.observedAt, 'shortDate')}</p>`,
  )
  if (point.isApproximate) {
    lines.push('<p class="text-xs text-slate">Lokasi disamarkan untuk perlindungan.</p>')
  }
  return `<div class="space-y-1 font-sans">${lines.join('')}</div>`
}

export default function MangroveMap({ points, scrollWheelZoom = true }: MangroveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const instance = createMap(container, {
      center: MAP_DEFAULT_VIEW.center,
      zoom: MAP_DEFAULT_VIEW.zoom,
      scrollWheelZoom,
    })

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(instance)

    for (const point of points) {
      circleMarker([point.latitude, point.longitude], {
        radius: point.isApproximate ? 14 : 8,
        color: '#ffffff',
        weight: 2,
        fillColor: CONDITION_COLORS[point.condition],
        fillOpacity: point.isApproximate ? 0.45 : 0.9,
      })
        .bindPopup(popupHtml(point))
        .addTo(instance)
    }

    if (points.length > 0) {
      const bounds = latLngBounds(points.map((point) => [point.latitude, point.longitude]))
      instance.fitBounds(bounds, { padding: [48, 48], maxZoom: 12 })
    }

    const resize = new ResizeObserver(() => instance.invalidateSize())
    resize.observe(container)

    return () => {
      resize.disconnect()
      instance.remove()
    }
  }, [points, scrollWheelZoom])

  return <div ref={containerRef} className="size-full" />
}
