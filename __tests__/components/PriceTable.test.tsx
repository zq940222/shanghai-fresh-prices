import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PriceTable from '@/components/PriceTable'

const rows = [
  {
    id: 1,
    name: 'Tomato',
    category: 'Vegetables',
    price: 6.2,
    unit: 'kg',
    market: 'Pudong',
    date: '2026-05-19',
  },
  {
    id: 2,
    name: 'Apple',
    category: 'Fruit',
    price: 8.4,
    unit: 'kg',
    market: 'Minhang',
    date: '2026-05-18',
  },
]

describe('PriceTable', () => {
  it('renders price rows and sorts by name', () => {
    render(<PriceTable rows={rows} />)

    const bodyRowsBefore = screen.getAllByRole('row').slice(1)
    expect(within(bodyRowsBefore[0]).getByText('Tomato')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /name/i }))

    const bodyRowsAfter = screen.getAllByRole('row').slice(1)
    expect(within(bodyRowsAfter[0]).getByText('Apple')).toBeInTheDocument()
    expect(within(bodyRowsAfter[1]).getByText('Tomato')).toBeInTheDocument()
  })
})
