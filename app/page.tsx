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
  source: string
  product: { name: string; category: string; unit: string }
  district: { name: string }
}

function toNumber(value: number | string) {
  return typeof value === 'number' ? value : Number.parseFloat(value)
}

function matchesFilters(row: PriceTableRow, filters: FilterValues) {
  const matchesName = !filters.name || row.name.includes(filters.name)
  const matchesCategory = !filters.category || row.category.includes(filters.category)
  const matchesMarket = !filters.market || row.market.includes(filters.market)
  const matchesFrom = !filters.dateFrom || row.date >= filters.dateFrom
  const matchesTo = !filters.dateTo || row.date <= filters.dateTo
  return matchesName && matchesCategory && matchesMarket && matchesFrom && matchesTo
}

export default function Home() {
  const [filters, setFilters] = useState<FilterValues>({
    name: '', category: '', market: '', dateFrom: '', dateTo: '',
  })
  const [rows, setRows] = useState<PriceTableRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPrices() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch('/api/prices')
        if (!response.ok) {
          const body = await response.json().catch(() => ({}))
          throw new Error(body.error ?? '加载价格数据失败，请检查数据库连接')
        }
        const payload: ApiPriceRow[] = await response.json()
        setRows(
          payload.map((row) => ({
            id: row.id,
            name: row.product.name,
            category: row.product.category,
            price: toNumber(row.wholesalePrice),
            unit: row.product.unit,
            market: row.district.name,
            date: new Date(row.priceDate).toISOString().split('T')[0],
            source: row.source,
          }))
        )
      } catch (loadError) {
        console.error(loadError)
        setError(loadError instanceof Error ? loadError.message : '加载失败，请稍后重试')
        setRows([])
      } finally {
        setLoading(false)
      }
    }
    void loadPrices()
  }, [])

  const filteredRows = useMemo(
    () => rows.filter((row) => matchesFilters(row, filters)),
    [rows, filters]
  )

  const stats = useMemo(() => {
    const categoryCount = new Set(rows.map((row) => row.category)).size
    const marketCount = new Set(rows.map((row) => row.market)).size
    const latestUpdate = rows.reduce<string | null>((latest, row) => {
      if (!latest || row.date > latest) return row.date
      return latest
    }, null)
    return { totalRecords: rows.length, categories: categoryCount, markets: marketCount, latestUpdate }
  }, [rows])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <section>
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
          上海生鲜市场
        </span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">
          蔬菜水果及生鲜价格查询
        </h1>
        <p className="mt-2 text-base text-zinc-600">
          查询上海各区域不同品质、不同产地的生鲜批发价与零售价，支持历史趋势分析。
        </p>
      </section>

      <StatsCards {...stats} />
      <FilterPanel onChange={setFilters} />

      {error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      {loading ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center text-sm text-zinc-500">
          正在加载价格数据...
        </div>
      ) : (
        <PriceTable rows={filteredRows} />
      )}

      <p className="text-xs text-zinc-400">
        数据来源：
        <a
          href="https://cif.mofcom.gov.cn"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-zinc-600"
        >
          商务部流通产业促进中心（cif.mofcom.gov.cn）
        </a>
        ，批发价格每日更新，零售价为批发价估算（×1.35）。
      </p>
    </div>
  )
}
