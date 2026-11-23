'use client'

import { useEffect, useRef, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ParallaxProps = {
  children: ReactNode
  depth?: number
  className?: string
}

export function Parallax({ children, depth = 14, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth - 0.5
        const y = event.clientY / window.innerHeight - 0.5
        element.style.translate = `${(-x * depth).toFixed(1)}px ${(-y * depth * 0.6).toFixed(1)}px`
      })
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handleMove)
      cancelAnimationFrame(frame)
    }
  }, [depth])

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        'pointer-events-none transition-[translate] duration-700 ease-out-soft',
        className,
      )}
    >
      {children}
    </div>
  )
}
