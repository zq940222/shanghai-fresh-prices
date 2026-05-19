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

    expect(screen.getByText('价格记录总数')).toBeInTheDocument()
    expect(screen.getByText('1,200')).toBeInTheDocument()
    expect(screen.getByText('品类数')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('覆盖区域数')).toBeInTheDocument()
    expect(screen.getByText('16')).toBeInTheDocument()
    expect(screen.getByText('最新更新')).toBeInTheDocument()
  })
})
