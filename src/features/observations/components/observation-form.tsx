'use client'

import imageCompression from 'browser-image-compression'
import { Crosshair, ImageUp } from 'lucide-react'
import { useActionState, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { IMAGE_UPLOAD, SITE_CONDITION_LABELS, SITE_CONDITIONS } from '@/config/constants'
import { createClient } from '@/lib/supabase/client'

import { createObservation } from '../actions'
import type { ObservationFormState } from '../types'

type ObservationFormProps = {
  userId: string
  initialPhotoPath?: string
  initialPhotoLabel?: string | null
}

const initialState: ObservationFormState = { status: 'idle' }

const toLocalInput = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export function ObservationForm({
  userId,
  initialPhotoPath,
  initialPhotoLabel,
}: ObservationFormProps) {
  const [state, action, pending] = useActionState(createObservation, initialState)
  const [photoPath, setPhotoPath] = useState(initialPhotoPath ?? '')
  const [photoName, setPhotoName] = useState<string | null>(
    initialPhotoPath ? 'Foto dari hasil scan' : null,
  )
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploading, startUpload] = useTransition()
  const [coords, setCoords] = useState({ latitude: '', longitude: '' })
  const [locating, setLocating] = useState(false)
  const [observedAt, setObservedAt] = useState('')

  const errors = state.fieldErrors ?? {}

  const upload = (file: File | undefined) => {
    if (!file) return
    setUploadError(null)
    startUpload(async () => {
      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: IMAGE_UPLOAD.maxSizeMB,
          maxWidthOrHeight: IMAGE_UPLOAD.maxWidthOrHeight,
          useWebWorker: true,
          fileType: 'image/jpeg',
        })
        const path = `${userId}/${crypto.randomUUID()}.jpg`
        const { error } = await createClient()
          .storage.from(IMAGE_UPLOAD.bucket)
          .upload(path, compressed, { contentType: 'image/jpeg' })
        if (error) throw error
        setPhotoPath(path)
        setPhotoName(file.name)
      } catch {
        setUploadError('Foto gagal diunggah. Periksa koneksi lalu coba lagi.')
      }
    })
  }

  const locate = () => {
    if (!('geolocation' in navigator)) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords: position }) => {
        setCoords({
          latitude: position.latitude.toFixed(6),
          longitude: position.longitude.toFixed(6),
        })
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 15_000 },
    )
  }

  return (
    <form action={action} className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
      <fieldset className="space-y-4">
        <legend className="text-2xl text-ink">Foto</legend>
        <label
          htmlFor="photo"
          className="flex aspect-4/3 cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.25rem] border border-dashed border-sage-300 bg-paper px-6 text-center transition-colors hover:bg-sage-50"
        >
          <ImageUp aria-hidden className="size-8 text-sage-600" strokeWidth={1.5} />
          <span className="text-lg font-light text-ink">
            {uploading ? 'Mengunggah…' : (photoName ?? 'Pilih foto daun atau pohon')}
          </span>
          {initialPhotoLabel && photoPath === initialPhotoPath && (
            <span className="text-sm text-slate italic">{initialPhotoLabel}</span>
          )}
        </label>
        <input
          id="photo"
          type="file"
          accept={IMAGE_UPLOAD.acceptedTypes.join(',')}
          capture="environment"
          className="sr-only"
          onChange={(event) => upload(event.target.files?.[0])}
        />
        <input type="hidden" name="photoPath" value={photoPath} />
        <input
          type="hidden"
          name="observedAt"
          value={observedAt ? new Date(observedAt).toISOString() : ''}
        />
        {(uploadError || errors.photoPath) && (
          <p role="alert" className="text-sm text-rejected">
            {uploadError ?? errors.photoPath}
          </p>
        )}
      </fieldset>

      <div className="space-y-8">
        <fieldset className="space-y-4">
          <legend className="text-2xl text-ink">Lokasi dan waktu</legend>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="font-normal">
                Lintang
              </Label>
              <Input
                id="latitude"
                name="latitude"
                inputMode="decimal"
                value={coords.latitude}
                onChange={(event) => setCoords((c) => ({ ...c, latitude: event.target.value }))}
                aria-invalid={errors.latitude ? true : undefined}
                className="h-12 rounded-xl px-4"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude" className="font-normal">
                Bujur
              </Label>
              <Input
                id="longitude"
                name="longitude"
                inputMode="decimal"
                value={coords.longitude}
                onChange={(event) => setCoords((c) => ({ ...c, longitude: event.target.value }))}
                aria-invalid={errors.longitude ? true : undefined}
                className="h-12 rounded-xl px-4"
                required
              />
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={locate}
            disabled={locating}
            className="h-10 rounded-full"
          >
            <Crosshair aria-hidden />
            {locating ? 'Mencari lokasi…' : 'Gunakan lokasi saat ini'}
          </Button>
          <div className="space-y-2">
            <Label htmlFor="observedAt" className="font-normal">
              Waktu pengamatan
            </Label>
            <div className="flex gap-2">
              <Input
                id="observedAt"
                type="datetime-local"
                value={observedAt}
                onChange={(event) => setObservedAt(event.target.value)}
                aria-invalid={errors.observedAt ? true : undefined}
                className="h-12 flex-1 rounded-xl px-4"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setObservedAt(toLocalInput(new Date()))}
                className="h-12 rounded-xl"
              >
                Sekarang
              </Button>
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-2xl text-ink">Kondisi lokasi</legend>
          <div className="flex flex-wrap gap-2">
            {SITE_CONDITIONS.map((condition) => (
              <label
                key={condition}
                className="cursor-pointer rounded-full border border-line px-4 py-2 text-sm text-ink has-checked:border-sage-900 has-checked:bg-sage-900 has-checked:text-white has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
              >
                <input
                  type="radio"
                  name="condition"
                  value={condition}
                  className="sr-only"
                  required
                />
                {SITE_CONDITION_LABELS[condition]}
              </label>
            ))}
          </div>
          {errors.condition && <p className="text-sm text-rejected">{errors.condition}</p>}
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="notes" className="font-normal">
            Catatan (opsional)
          </Label>
          <Textarea id="notes" name="notes" maxLength={1000} className="min-h-28 rounded-xl" />
        </div>

        {state.message && (
          <p role="alert" className="rounded-xl bg-rejected-bg p-3 text-sm text-rejected">
            {state.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={pending || uploading}
          className="h-12 w-full rounded-full text-base font-normal sm:w-auto sm:px-8"
        >
          {pending ? 'Mengirim…' : 'Kirim laporan'}
        </Button>
      </div>
    </form>
  )
}
