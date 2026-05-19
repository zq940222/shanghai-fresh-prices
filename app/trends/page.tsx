'use client'

import { FormEvent, useState, useTransition } from 'react'
import TrendChart, { type TrendPoint } from '@/components/TrendChart'

export default function TrendsPage() {
  const [query, setQuery] = useState('')
  const [points, setPoints] = useState<TrendPoint[]>([])
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const productName = query.trim()

    if (!productName) {
      setError('请输入品种名称进行查询。')
      setPoints([])
      return
    }

    startTransition(() => {
      void (async () => {
        setError('')
        try {
          const response = await fetch(
            `/api/prices/trend?name=${encodeURIComponent(productName)}&days=30`
          )
          if (!response.ok) {
            const body = await response.json().catch(() => ({}))
            throw new Error(body.error ?? '加载趋势数据失败')
          }
          const payload: TrendPoint[] = await response.json()
          setPoints(payload)
        } catch (loadError) {
          console.error(loadError)
          setError(loadError instanceof Error ? loadError.message : '加载失败，请稍后重试')
          setPoints([])
        }
      })()
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">价格趋势分析</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            输入品种名称，查看近 30 天的批发价与零售价走势。
          </p>
        </div>

        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
          <input
            className="min-w-64 rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
            placeholder="输入品种名称，如：西红柿"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            type="submit"
            className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            disabled={isPending}
          >
            {isPending ? '加载中...' : '查询趋势'}
          </button>
        </form>
      </section>

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <TrendChart data={points} />
    </div>
  )
}
