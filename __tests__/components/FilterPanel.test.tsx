import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import FilterPanel from '@/components/FilterPanel'

describe('FilterPanel', () => {
  it('emits updated filter values when inputs change', () => {
    const onChange = vi.fn()

    render(<FilterPanel onChange={onChange} />)

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Tomato' } })
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Vegetables' } })
    fireEvent.change(screen.getByLabelText('Market'), { target: { value: 'Pudong' } })
    fireEvent.change(screen.getByLabelText('Date From'), { target: { value: '2026-05-01' } })
    fireEvent.change(screen.getByLabelText('Date To'), { target: { value: '2026-05-19' } })

    expect(onChange).toHaveBeenLastCalledWith({
      name: 'Tomato',
      category: 'Vegetables',
      market: 'Pudong',
      dateFrom: '2026-05-01',
      dateTo: '2026-05-19',
    })
  })
})
