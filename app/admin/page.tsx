'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import AdminNav from '@/components/admin/AdminNav'
import ScraperButton from '@/components/admin/ScraperButton'
import StatsCards from '@/components/StatsCards'

interface ApiPriceRow {
  id: number
  priceDate: string
  district: { name: string }
  product: { category: string }
}

export default function AdminPage() {
  const [prices, setPrices] = useState<ApiPriceRow[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch('/api/prices')
        if (!response.ok) {
          throw new Error('加载后台数据失败。')
        }

        const payload: ApiPriceRow[] = await response.json()
        setPrices(payload)
      } catch (loadError) {
        console.error(loadError)
        setError('后台数据加载失败，请检查数据库连接。')
      }
    }

    void loadDashboard()
  }, [])

  const stats = useMemo(() => {
    const categoryCount = new Set(prices.map((price) => price.product.category)).size
    const marketCount = new Set(prices.map((price) => price.district.name)).size
    const latestUpdate = prices.reduce<string | null>((latest, price) => {
      const date = new Date(price.priceDate).toISOString().split('T')[0]
      if (!latest || date > latest) return date
      return latest
    }, null)

    return {
      totalRecords: prices.length,
      categories: categoryCount,
      markets: marketCount,
      latestUpdate,
    }
  }, [prices])

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[240px_1fr]">
      <AdminNav />
      <div className="space-y-6">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">后台管理控制台</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            查看当前市场数据覆盖情况，进行价格录入与管理操作。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/admin/prices"
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              价格管理
            </Link>
            <Link
              href="/admin/prices/new"
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              新增价格
            </Link>
          </div>
        </section>

        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">数据抓取</h2>
          <p className="mt-1 mb-4 text-sm text-zinc-500">
            手动触发一次价格抓取，每次执行后需等待 5 分钟才能再次操作。
          </p>
          <ScraperButton />
        </section>

        <StatsCards {...stats} />
      </div>
    </div>
  )
}
