import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StatusBadge } from './status-badge'

describe('StatusBadge', () => {
  it('renders the Indonesian label and an icon, not colour alone', () => {
    const { container } = render(<StatusBadge status="revision_required" />)
    expect(screen.getByText('Perlu revisi')).toBeTruthy()
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('keeps model predictions neutral so they are never mistaken for verification', () => {
    const { container } = render(<StatusBadge status="prediction" />)
    const className = container.firstElementChild?.className ?? ''
    expect(className).toContain('text-prediction')
    expect(className).not.toContain('text-verified')
  })
})
