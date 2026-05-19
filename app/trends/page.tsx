'use client'

import { FormEvent, useState, useTransition } from 'react'
import TrendChart, { type TrendPoint } from '@/components/TrendChart'

export default function TrendsPage() {
  const [query, setQuery] = useState('Tomato')
  const [points, setPoints] = useState<TrendPoint[]>([])
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const productName = query.trim()

    if (!productName) {
      setError('Enter a product name to search.')
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
            throw new Error('Failed to load trend data.')
          }

          const payload: TrendPoint[] = await response.json()
          setPoints(payload)
        } catch (loadError) {
          console.error(loadError)
          setError('Unable to load trend data.')
          setPoints([])
        }
      })()
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">Trend Explorer</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            Query any produce item and inspect its 30-day average pricing trend.
          </p>
        </div>

        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
          <input
            className="min-w-64 rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
            placeholder="Search product name"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            type="submit"
            className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            disabled={isPending}
          >
            {isPending ? 'Loading...' : 'Load Trend'}
          </button>
        </form>
      </section>

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <TrendChart data={points} />
    </div>
  )
}
