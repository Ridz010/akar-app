'use client'

import imageCompression from 'browser-image-compression'
import { ImageUp, RotateCcw } from 'lucide-react'
import Image from 'next/image'
import { useActionState, useEffect, useRef, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { IMAGE_UPLOAD } from '@/config/constants'
import { cn } from '@/lib/utils'

import { identifyLeaf } from '../actions'
import type { ScanState } from '../types'
import { PredictionResult } from './prediction-result'

const initialState: ScanState = { status: 'idle' }

export function ScannerPanel() {
  const [state, action, pending] = useActionState(identifyLeaf, initialState)
  const [compressing, startCompressing] = useTransition()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [resultHidden, setResultHidden] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const previewRef = useRef<string | null>(null)

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    },
    [],
  )

  const showPreview = (next: File | null) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    previewRef.current = next ? URL.createObjectURL(next) : null
    setPreview(previewRef.current)
  }

  const choose = (selected: File | undefined) => {
    if (!selected) return
    startCompressing(async () => {
      const compressed = await imageCompression(selected, {
        maxSizeMB: IMAGE_UPLOAD.maxSizeMB,
        maxWidthOrHeight: IMAGE_UPLOAD.maxWidthOrHeight,
        useWebWorker: true,
        fileType: 'image/jpeg',
      }).catch(() => selected)
      const prepared = new File([compressed], 'daun.jpg', { type: compressed.type || 'image/jpeg' })
      setFile(prepared)
      showPreview(prepared)
    })
  }

  const reset = () => {
    setFile(null)
    showPreview(null)
    setResultHidden(true)
    if (inputRef.current) inputRef.current.value = ''
  }

  const retake = () => {
    reset()
    inputRef.current?.click()
  }

  const submit = (formData: FormData) => {
    if (file) formData.set('image', file)
    setResultHidden(false)
    action(formData)
  }

  const busy = pending || compressing

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
      <form action={submit} className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <label
          htmlFor="leaf-image"
          className={cn(
            'relative flex aspect-4/5 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.25rem] border border-dashed border-sage-300 bg-paper text-center transition-colors hover:bg-sage-50',
            preview && 'border-solid border-line',
          )}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Pratinjau foto daun"
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <span className="flex max-w-xs flex-col items-center gap-3 px-6">
              <ImageUp aria-hidden className="size-8 text-sage-600" strokeWidth={1.5} />
              <span className="text-xl font-light text-ink">Ambil atau pilih foto daun</span>
              <span className="text-sm text-slate">
                Satu daun, latar polos, cahaya alami. Foto dikompres di perangkatmu.
              </span>
            </span>
          )}
        </label>
        <input
          ref={inputRef}
          id="leaf-image"
          name="image"
          type="file"
          accept={IMAGE_UPLOAD.acceptedTypes.join(',')}
          capture="environment"
          className="sr-only"
          onChange={(event) => choose(event.target.files?.[0])}
        />
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={!file || busy}
            className="h-12 flex-1 rounded-full text-base font-normal"
          >
            {compressing ? 'Menyiapkan foto…' : pending ? 'Mengenali daun…' : 'Kenali spesies'}
          </Button>
          {file && (
            <Button
              type="button"
              variant="outline"
              onClick={reset}
              disabled={busy}
              aria-label="Ganti foto"
              className="size-12 rounded-full"
            >
              <RotateCcw aria-hidden />
            </Button>
          )}
        </div>
        {state.status === 'error' && (
          <p role="alert" className="rounded-xl bg-rejected-bg p-3 text-sm text-rejected">
            {state.message}
          </p>
        )}
      </form>

      <div className="lg:pt-4">
        {pending ? (
          <div role="status" className="space-y-4">
            <div className="h-40 animate-pulse rounded-[1.5rem] bg-surface" />
            <div className="h-28 animate-pulse rounded-[1.25rem] bg-surface" />
            <p className="text-sm text-slate">
              Menganalisis ciri daun dari beberapa sudut pandang. Biasanya selesai dalam 5–10 detik.
            </p>
          </div>
        ) : state.status === 'success' && !resultHidden ? (
          <PredictionResult prediction={state.prediction} photoUrl={preview} onRetake={retake} />
        ) : (
          <ol className="divide-y divide-line border-y border-line">
            {[
              'Potret satu daun yang utuh dengan latar polos.',
              'AKAR mencocokkan ciri daunnya dan menjelaskan hasilnya.',
              'Lanjutkan ke laporan untuk mencatat lokasi dan kondisi.',
              'Pengelola memeriksa laporan sebelum tampil di peta.',
            ].map((step) => (
              <li key={step} className="flex gap-5 py-5 text-ink">
                <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-sage-500" />
                {step}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
