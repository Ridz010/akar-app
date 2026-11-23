import type { ReactNode } from 'react'

import AnimatedContent from './AnimatedContent'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: number
  from?: 'bottom' | 'left' | 'right'
  distance?: number
  blur?: number
  scale?: number
  onMount?: boolean
}

export function Reveal({
  children,
  className,
  delay = 0,
  stagger = 0,
  from = 'bottom',
  distance = 28,
  blur = 6,
  scale = 1,
  onMount = false,
}: RevealProps) {
  return (
    <AnimatedContent
      distance={distance}
      direction={from === 'bottom' ? 'vertical' : 'horizontal'}
      reverse={from === 'left'}
      duration={0.6}
      ease="power3.out"
      blur={blur}
      scale={scale}
      threshold={0.12}
      delay={delay}
      stagger={stagger}
      trigger={onMount ? 'mount' : 'scroll'}
      once
      className={className}
    >
      {children}
    </AnimatedContent>
  )
}
