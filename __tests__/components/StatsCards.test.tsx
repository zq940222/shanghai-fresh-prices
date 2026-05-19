import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StatsCards from '@/components/StatsCards'

describe('StatsCards', () => {
  it('renders summary metrics', () => {
    render(
      <StatsCards
        totalRecords={1200}
        categories={8}
        markets={16}
        latestUpdate="2026-05-19T08:30:00.000Z"
      />
    )

    expect(screen.getByText('Total Records')).toBeInTheDocument()
    expect(screen.getByText('1,200')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('Markets')).toBeInTheDocument()
    expect(screen.getByText('16')).toBeInTheDocument()
    expect(screen.getByText('Latest Update')).toBeInTheDocument()
  })
})
