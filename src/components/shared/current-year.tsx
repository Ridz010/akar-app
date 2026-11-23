'use client'

import { useSyncExternalStore } from 'react'

const noopSubscribe = () => () => {}

export function CurrentYear() {
  const year = useSyncExternalStore(
    noopSubscribe,
    () => new Date().getFullYear(),
    () => null,
  )
  return year === null ? null : <>{year} </>
}
