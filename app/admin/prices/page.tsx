'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import AdminNav from '@/components/admin/AdminNav'
import DataTable, { type AdminPriceRow } from '@/components/admin/DataTable'

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

export default function AdminPricesPage() {
  const [rows, setRows] = useState<AdminPriceRow[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPrices() {
      try {
        const response = await fetch('/api/prices')
        if (!response.ok) {
          throw new Error('Failed to load prices.')
        }

        const payload: ApiPriceRow[] = await response.json()
        setRows(
          payload.map((row) => ({
            id: row.id,
            name: row.product.name,
            category: row.product.category,
            market: row.district.name,
            price: toNumber(row.retailPrice ?? row.wholesalePrice),
            unit: row.product.unit,
            date: new Date(row.priceDate).toISOString().split('T')[0],
          }))
        )
      } catch (loadError) {
        console.error(loadError)
        setError('Unable to load price records.')
      }
    }

    void loadPrices()
  }, [])

  function handleDelete(id: number) {
    setRows((current) => current.filter((row) => row.id !== id))
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[240px_1fr]">
      <AdminNav />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Manage Prices</h1>
            <p className="mt-2 text-sm text-zinc-500">
              Edit existing records or remove them from the current admin view.
            </p>
          </div>
          <Link
            href="/admin/prices/new"
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Add Price
          </Link>
        </div>

        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        <DataTable rows={rows} onDelete={handleDelete} />
      </div>
    </div>
  )
}
