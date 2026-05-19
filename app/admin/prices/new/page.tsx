'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'
import PriceForm, { type AdminOption } from '@/components/admin/PriceForm'

interface ReferenceState {
  products: AdminOption[]
  districts: AdminOption[]
  origins: AdminOption[]
  qualities: AdminOption[]
}

const emptyReferenceState: ReferenceState = {
  products: [],
  districts: [],
  origins: [],
  qualities: [],
}

export default function NewPricePage() {
  const router = useRouter()
  const [references, setReferences] = useState<ReferenceState>(emptyReferenceState)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadReferences() {
      try {
        const [products, districts, origins, qualities] = await Promise.all([
          fetch('/api/products').then((response) => response.json() as Promise<AdminOption[]>),
          fetch('/api/districts').then((response) => response.json() as Promise<AdminOption[]>),
          fetch('/api/origins').then((response) => response.json() as Promise<AdminOption[]>),
          fetch('/api/quality-grades').then((response) => response.json() as Promise<AdminOption[]>),
        ])

        setReferences({ products, districts, origins, qualities })
      } catch (loadError) {
        console.error(loadError)
        setError('Unable to load reference data.')
      }
    }

    void loadReferences()
  }, [])

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[240px_1fr]">
      <AdminNav />
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Add Price</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Create a new daily market price record.
          </p>
        </div>

        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        <PriceForm
          {...references}
          submitLabel="Create Price"
          onSubmit={async (values) => {
            const response = await fetch('/api/prices', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(values),
            })

            if (!response.ok) {
              throw new Error('Failed to create price record.')
            }

            router.push('/admin/prices')
          }}
        />
      </div>
    </div>
  )
}
