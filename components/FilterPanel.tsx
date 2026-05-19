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
    const nextValues = { ...values, [key]: value }
    setValues(nextValues)
    onChange(nextValues)
  }

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-950">筛选条件</h2>
        <p className="text-sm text-zinc-500">按品种、品类、区域和日期范围筛选。</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="flex flex-col gap-1 text-sm text-zinc-600">
          <span>品种名称</span>
          <input
            aria-label="品种名称"
            className="rounded-2xl border border-zinc-200 px-3 py-2 outline-none transition focus:border-emerald-500"
            placeholder="如：西红柿"
            value={values.name}
            onChange={(event) => updateValue('name', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600">
          <span>品类</span>
          <input
            aria-label="品类"
            className="rounded-2xl border border-zinc-200 px-3 py-2 outline-none transition focus:border-emerald-500"
            placeholder="如：蔬菜、水果"
            value={values.category}
            onChange={(event) => updateValue('category', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600">
          <span>区域</span>
          <input
            aria-label="区域"
            className="rounded-2xl border border-zinc-200 px-3 py-2 outline-none transition focus:border-emerald-500"
            placeholder="如：浦东新区"
            value={values.market}
            onChange={(event) => updateValue('market', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600">
          <span>开始日期</span>
          <input
            aria-label="开始日期"
            type="date"
            className="rounded-2xl border border-zinc-200 px-3 py-2 outline-none transition focus:border-emerald-500"
            value={values.dateFrom}
            onChange={(event) => updateValue('dateFrom', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600">
          <span>结束日期</span>
          <input
            aria-label="结束日期"
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
