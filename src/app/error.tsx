'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="container-page flex min-h-svh flex-1 flex-col justify-center py-16">
      <h1 className="max-w-xl type-title text-ink">Halaman ini gagal dimuat</h1>
      <p className="mt-5 max-w-md text-lg text-slate">Periksa koneksi internetmu lalu coba lagi.</p>
      <Button
        onClick={() => retry()}
        className="mt-10 h-12 self-start rounded-full px-6 text-base font-normal"
      >
        Coba lagi
      </Button>
    </main>
  )
}
