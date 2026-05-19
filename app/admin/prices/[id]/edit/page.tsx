'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'
import PriceForm, {
  type AdminOption,
  type PriceFormValues,
} from '@/components/admin/PriceForm'

interface ReferenceState {
  products: AdminOption[]
  districts: AdminOption[]
  origins: AdminOption[]
  qualities: AdminOption[]
}

interface ApiPriceRow {
  id: number
  productId: number
  districtId: number
  originId: number
  qualityId: number
  wholesalePrice: number | string
  retailPrice: number | string
  priceDate: string
}

const emptyReferenceState: ReferenceState = {
  products: [],
  districts: [],
  origins: [],
  qualities: [],
}

function toStringValue(value: number | string) {
  return typeof value === 'number' ? String(value) : value
}

export default function EditPricePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [references, setReferences] = useState<ReferenceState>(emptyReferenceState)
  const [initialValues, setInitialValues] = useState<Partial<PriceFormValues>>()
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadEditPage() {
      try {
        const [products, districts, origins, qualities, prices] = await Promise.all([
          fetch('/api/products').then((response) => response.json() as Promise<AdminOption[]>),
          fetch('/api/districts').then((response) => response.json() as Promise<AdminOption[]>),
          fetch('/api/origins').then((response) => response.json() as Promise<AdminOption[]>),
          fetch('/api/quality-grades').then((response) => response.json() as Promise<AdminOption[]>),
          fetch('/api/prices').then((response) => response.json() as Promise<ApiPriceRow[]>),
        ])

        const targetId = Number(params.id)
        const record = prices.find((price) => price.id === targetId)

        if (!record) {
          throw new Error('未找到该价格记录。')
        }

        setReferences({ products, districts, origins, qualities })
        setInitialValues({
          productId: String(record.productId),
          districtId: String(record.districtId),
          originId: String(record.originId),
          qualityId: String(record.qualityId),
          wholesalePrice: toStringValue(record.wholesalePrice),
          retailPrice: toStringValue(record.retailPrice),
          priceDate: new Date(record.priceDate).toISOString().split('T')[0],
        })
      } catch (loadError) {
        console.error(loadError)
        setError('价格记录加载失败，请刷新页面重试。')
      }
    }

    void loadEditPage()
  }, [params.id])

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[240px_1fr]">
      <AdminNav />
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">编辑价格记录</h1>
          <p className="mt-2 text-sm text-zinc-500">
            修改选中的价格记录并保存。
          </p>
        </div>

        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        <PriceForm
          {...references}
          initialValues={initialValues}
          submitLabel="保存修改"
          onSubmit={async (values) => {
            const response = await fetch('/api/prices', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(values),
            })

            if (!response.ok) {
              throw new Error('价格记录更新失败。')
            }

            router.push('/admin/prices')
          }}
        />
      </div>
    </div>
  )
}
