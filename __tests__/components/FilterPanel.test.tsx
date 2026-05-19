import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import FilterPanel from '@/components/FilterPanel'

describe('FilterPanel', () => {
  it('emits updated filter values when inputs change', () => {
    const onChange = vi.fn()

    render(<FilterPanel onChange={onChange} />)

    fireEvent.change(screen.getByLabelText('品种名称'), { target: { value: '西红柿' } })
    fireEvent.change(screen.getByLabelText('品类'), { target: { value: '蔬菜' } })
    fireEvent.change(screen.getByLabelText('区域'), { target: { value: '浦东新区' } })
    fireEvent.change(screen.getByLabelText('开始日期'), { target: { value: '2026-05-01' } })
    fireEvent.change(screen.getByLabelText('结束日期'), { target: { value: '2026-05-19' } })

    expect(onChange).toHaveBeenLastCalledWith({
      name: '西红柿',
      category: '蔬菜',
      market: '浦东新区',
      dateFrom: '2026-05-01',
      dateTo: '2026-05-19',
    })
  })
})
