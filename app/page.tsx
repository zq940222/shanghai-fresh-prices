'use client'

import { useEffect, useMemo, useState } from 'react'
import FilterPanel, { type FilterValues } from '@/components/FilterPanel'
import PriceTable, { type PriceTableRow } from '@/components/PriceTable'
import StatsCards from '@/components/StatsCards'

interface ApiPriceRow {
  id: number
  wholesalePrice: number | string
  retailPrice: number | string
  priceDate: string
  product: {
    name: string
    category: string
    unit: string
  }
  district: {
    name: string
  }
}

function toNumber(value: number | string) {
  return typeof value === 'number' ? value : Number.parseFloat(value)
}

function matchesFilters(row: PriceTableRow, filters: FilterValues) {
  const matchesName = !filters.name || row.name.toLowerCase().includes(filters.name.toLowerCase())
  const matchesCategory =
    !filters.category || row.category.toLowerCase().includes(filters.category.toLowerCase())
  const matchesMarket =
    !filters.market || row.market.toLowerCase().includes(filters.market.toLowerCase())
  const matchesFrom = !filters.dateFrom || row.date >= filters.dateFrom
  const matchesTo = !filters.dateTo || row.date <= filters.dateTo

  return matchesName && matchesCategory && matchesMarket && matchesFrom && matchesTo
}

export default function Home() {
  const [filters, setFilters] = useState<FilterValues>({
    name: '',
    category: '',
    market: '',
    dateFrom: '',
    dateTo: '',
  })
  const [rows, setRows] = useState<PriceTableRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPrices() {
      setLoading(true)
      setError('')

      try {
        const query = new URLSearchParams(
          Object.entries(filters).filter(([, value]) => value)
        )
        const response = await fetch(`/api/prices?${query.toString()}`)

        if (!response.ok) {
          throw new Error('Failed to load prices.')
        }

        const payload: ApiPriceRow[] = await response.json()
        const nextRows = payload
          .map((row) => ({
            id: row.id,
            name: row.product.name,
            category: row.product.category,
            price: toNumber(row.retailPrice ?? row.wholesalePrice),
            unit: row.product.unit,
            market: row.district.name,
            date: new Date(row.priceDate).toISOString().split('T')[0],
          }))
          .filter((row) => matchesFilters(row, filters))

        setRows(nextRows)
      } catch (loadError) {
        console.error(loadError)
        setError('Unable to load price data.')
        setRows([])
      } finally {
        setLoading(false)
      }
    }

    void loadPrices()
  }, [filters])

  const stats = useMemo(() => {
    const categoryCount = new Set(rows.map((row) => row.category)).size
    const marketCount = new Set(rows.map((row) => row.market)).size
    const latestUpdate = rows.reduce<string | null>((latest, row) => {
      if (!latest || row.date > latest) return row.date
      return latest
    }, null)

    return {
      totalRecords: rows.length,
      categories: categoryCount,
      markets: marketCount,
      latestUpdate,
    }
  }, [rows])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div className="space-y-4">
          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
            Shanghai markets
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-950">
            Fresh produce pricing with filters, daily snapshots, and admin tooling.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-600">
            Browse current produce records, narrow by market and category, and monitor
            updates as new scraper runs arrive.
          </p>
        </div>
      </section>

      <StatsCards {...stats} />
      <FilterPanel onChange={setFilters} />

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {loading ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center text-sm text-zinc-500">
          Loading price records...
        </div>
      ) : (
        <PriceTable rows={rows} />
      )}
    </div>
  )
}
