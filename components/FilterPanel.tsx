'use client'

import { useState } from 'react'

export interface FilterValues {
  name: string
  category: string
  market: string
  dateFrom: string
  dateTo: string
}

interface FilterPanelProps {
  initialValues?: Partial<FilterValues>
  onChange: (values: FilterValues) => void
}

const defaultValues: FilterValues = {
  name: '',
  category: '',
  market: '',
  dateFrom: '',
  dateTo: '',
}

export default function FilterPanel({ initialValues, onChange }: FilterPanelProps) {
  const [values, setValues] = useState<FilterValues>({
    ...defaultValues,
    ...initialValues,
  })

  function updateValue(key: keyof FilterValues, value: string) {
    const nextValues = {
      ...values,
      [key]: value,
    }

    setValues(nextValues)
    onChange(nextValues)
  }

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-950">Filters</h2>
        <p className="text-sm text-zinc-500">Search by product, category, market, and date range.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="flex flex-col gap-1 text-sm text-zinc-600">
          <span>Name</span>
          <input
            aria-label="Name"
            className="rounded-2xl border border-zinc-200 px-3 py-2 outline-none transition focus:border-emerald-500"
            value={values.name}
            onChange={(event) => updateValue('name', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600">
          <span>Category</span>
          <input
            aria-label="Category"
            className="rounded-2xl border border-zinc-200 px-3 py-2 outline-none transition focus:border-emerald-500"
            value={values.category}
            onChange={(event) => updateValue('category', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600">
          <span>Market</span>
          <input
            aria-label="Market"
            className="rounded-2xl border border-zinc-200 px-3 py-2 outline-none transition focus:border-emerald-500"
            value={values.market}
            onChange={(event) => updateValue('market', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600">
          <span>Date From</span>
          <input
            aria-label="Date From"
            type="date"
            className="rounded-2xl border border-zinc-200 px-3 py-2 outline-none transition focus:border-emerald-500"
            value={values.dateFrom}
            onChange={(event) => updateValue('dateFrom', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600">
          <span>Date To</span>
          <input
            aria-label="Date To"
            type="date"
            className="rounded-2xl border border-zinc-200 px-3 py-2 outline-none transition focus:border-emerald-500"
            value={values.dateTo}
            onChange={(event) => updateValue('dateTo', event.target.value)}
          />
        </label>
      </div>
    </section>
  )
}
