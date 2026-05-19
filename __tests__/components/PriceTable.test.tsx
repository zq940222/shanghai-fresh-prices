import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PriceTable from '@/components/PriceTable'

const rows = [
  {
    id: 1,
    name: '西红柿',
    category: '蔬菜',
    price: 3.1,
    unit: '斤',
    market: '浦东新区',
    date: '2026-05-19',
  },
  {
    id: 2,
    name: '苹果',
    category: '水果',
    price: 4.2,
    unit: '斤',
    market: '闵行区',
    date: '2026-05-18',
  },
]

describe('PriceTable', () => {
  it('renders price rows and sorts by name', () => {
    render(<PriceTable rows={rows} />)

    const bodyRowsBefore = screen.getAllByRole('row').slice(1)
    expect(within(bodyRowsBefore[0]).getByText('西红柿')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /品种/i }))

    const bodyRowsAfter = screen.getAllByRole('row').slice(1)
    expect(within(bodyRowsAfter[0]).getByText('苹果')).toBeInTheDocument()
    expect(within(bodyRowsAfter[1]).getByText('西红柿')).toBeInTheDocument()
  })
})
