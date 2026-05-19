'use client'

import { type FormEvent, useEffect, useState } from 'react'

export interface AdminOption {
  id: number
  name: string
}

export interface PriceFormValues {
  productId: string
  districtId: string
  originId: string
  qualityId: string
  wholesalePrice: string
  retailPrice: string
  priceDate: string
}

interface PriceFormProps {
  products: AdminOption[]
  districts: AdminOption[]
  origins: AdminOption[]
  qualities: AdminOption[]
  initialValues?: Partial<PriceFormValues>
  onSubmit: (values: {
    productId: number
    districtId: number
    originId: number
    qualityId: number
    wholesalePrice: number
    retailPrice: number
    priceDate: string
  }) => Promise<void>
  submitLabel?: string
}

const defaultValues: PriceFormValues = {
  productId: '',
  districtId: '',
  originId: '',
  qualityId: '',
  wholesalePrice: '',
  retailPrice: '',
  priceDate: new Date().toISOString().split('T')[0],
}

export default function PriceForm({
  products,
  districts,
  origins,
  qualities,
  initialValues,
  onSubmit,
  submitLabel = '保存',
}: PriceFormProps) {
  const [values, setValues] = useState<PriceFormValues>({
    ...defaultValues,
    ...initialValues,
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setValues({
      ...defaultValues,
      ...initialValues,
    })
  }, [initialValues])

  function updateValue(key: keyof PriceFormValues, value: string) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (Object.values(values).some((value) => !String(value).trim())) {
      setError('所有字段均为必填项。')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await onSubmit({
        productId: Number(values.productId),
        districtId: Number(values.districtId),
        originId: Number(values.originId),
        qualityId: Number(values.qualityId),
        wholesalePrice: Number(values.wholesalePrice),
        retailPrice: Number(values.retailPrice),
        priceDate: values.priceDate,
      })
    } catch (submitError) {
      console.error(submitError)
      setError('保存失败，请稍后重试。')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClassName =
    'rounded-2xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500'

  return (
    <form className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zinc-950">价格信息</h2>
        <p className="mt-2 text-sm text-zinc-500">
          填写完整的价格记录，所有字段均为必填。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-zinc-600">
          <span>品种</span>
          <select
            className={inputClassName}
            value={values.productId}
            onChange={(event) => updateValue('productId', event.target.value)}
          >
            <option value="">请选择品种</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600">
          <span>区域</span>
          <select
            className={inputClassName}
            value={values.districtId}
            onChange={(event) => updateValue('districtId', event.target.value)}
          >
            <option value="">请选择区域</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600">
          <span>产地</span>
          <select
            className={inputClassName}
            value={values.originId}
            onChange={(event) => updateValue('originId', event.target.value)}
          >
            <option value="">请选择产地</option>
            {origins.map((origin) => (
              <option key={origin.id} value={origin.id}>
                {origin.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600">
          <span>品质等级</span>
          <select
            className={inputClassName}
            value={values.qualityId}
            onChange={(event) => updateValue('qualityId', event.target.value)}
          >
            <option value="">请选择品质</option>
            {qualities.map((quality) => (
              <option key={quality.id} value={quality.id}>
                {quality.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600">
          <span>批发价（元/单位）</span>
          <input
            className={inputClassName}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={values.wholesalePrice}
            onChange={(event) => updateValue('wholesalePrice', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600">
          <span>零售价（元/单位）</span>
          <input
            className={inputClassName}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={values.retailPrice}
            onChange={(event) => updateValue('retailPrice', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 md:col-span-2">
          <span>日期</span>
          <input
            className={inputClassName}
            type="date"
            value={values.priceDate}
            onChange={(event) => updateValue('priceDate', event.target.value)}
          />
        </label>
      </div>

      {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="mt-6 flex items-center justify-end">
        <button
          type="submit"
          className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? '保存中...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
