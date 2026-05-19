'use client'

import { useMemo, useState } from 'react'

export interface PriceTableRow {
  id: number | string
  name: string
  category: string
  price: number
  unit: string
  market: string
  date: string
}

type SortKey = keyof Omit<PriceTableRow, 'id'>

interface PriceTableProps {
  rows: PriceTableRow[]
}

function compareValues(a: string | number, b: string | number) {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), 'zh-CN', { sensitivity: 'base' })
}

const COLUMN_LABELS: Record<SortKey, string> = {
  name: '品种',
  category: '品类',
  price: '价格',
  unit: '单位',
  market: '区域',
  date: '日期',
}

export default function PriceTable({ rows }: PriceTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const columns: Array<{ key: SortKey }> = [
    { key: 'name' },
    { key: 'category' },
    { key: 'price' },
    { key: 'unit' },
    { key: 'market' },
    { key: 'date' },
  ]

  function toggleSort(nextKey: SortKey) {
    if (sortKey === nextKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
      return
    }
    setSortKey(nextKey)
    setSortDirection(nextKey === 'date' ? 'desc' : 'asc')
  }

  const sortedRows = useMemo(() => {
    return [...rows].sort((left, right) => {
      const result = compareValues(left[sortKey], right[sortKey])
      return sortDirection === 'asc' ? result : -result
    })
  }, [rows, sortDirection, sortKey])

  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-zinc-950">最新价格记录</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 transition hover:text-zinc-950"
                    onClick={() => toggleSort(column.key)}
                  >
                    <span>{COLUMN_LABELS[column.key]}</span>
                    {sortKey === column.key ? (
                      <span aria-hidden="true">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    ) : null}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length > 0 ? (
              sortedRows.map((row, index) => (
                <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-zinc-50/60'}>
                  <td className="px-4 py-3 font-medium text-zinc-950">{row.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{row.category}</td>
                  <td className="px-4 py-3 text-zinc-950">{row.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-zinc-600">{row.unit}</td>
                  <td className="px-4 py-3 text-zinc-600">{row.market}</td>
                  <td className="px-4 py-3 text-zinc-600">{row.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-zinc-500">
                  暂无价格数据，请先录入或等待抓取任务运行。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
