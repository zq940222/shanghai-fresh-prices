import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  default: {
    price: {
      findMany: vi.fn(),
      upsert: vi.fn(),
      count: vi.fn(),
    },
    product: { count: vi.fn() },
    district: { count: vi.fn() },
  },
}))

import prisma from '@/lib/prisma'
import { GET as getPrices, POST as postPrice } from '@/app/api/prices/route'
import { GET as getStats } from '@/app/api/prices/stats/route'

const mockPrice = {
  id: 1,
  productId: 1,
  districtId: 1,
  originId: 1,
  qualityId: 1,
  wholesalePrice: '1.80',
  retailPrice: '3.50',
  priceDate: new Date('2026-05-19'),
  source: 'manual',
  createdAt: new Date(),
  product: { id: 1, name: '西红柿', category: '蔬菜', unit: '斤' },
  district: { id: 1, name: '浦东新区' },
  origin: { id: 1, name: '云南', province: '云南' },
  quality: { id: 1, name: '一级', description: '' },
}

describe('GET /api/prices', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns prices with relations', async () => {
    vi.mocked(prisma.price.findMany).mockResolvedValue([mockPrice] as any)
    const res = await getPrices(new Request('http://localhost/api/prices'))
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data[0].product.name).toBe('西红柿')
  })

  it('filters by productId', async () => {
    vi.mocked(prisma.price.findMany).mockResolvedValue([])
    const req = new Request('http://localhost/api/prices?productId=1')
    await getPrices(req)
    expect(prisma.price.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ productId: 1 }) })
    )
  })
})

describe('POST /api/prices', () => {
  it('upserts a price record', async () => {
    vi.mocked(prisma.price.upsert).mockResolvedValue(mockPrice as any)
    const req = new Request('http://localhost/api/prices', {
      method: 'POST',
      body: JSON.stringify({
        productId: 1,
        districtId: 1,
        originId: 1,
        qualityId: 1,
        wholesalePrice: 1.8,
        retailPrice: 3.5,
        priceDate: '2026-05-19',
      }),
    })
    const res = await postPrice(req)
    expect(res.status).toBe(201)
  })

  it('returns 400 if required fields missing', async () => {
    const req = new Request('http://localhost/api/prices', {
      method: 'POST',
      body: JSON.stringify({ productId: 1 }),
    })
    const res = await postPrice(req)
    expect(res.status).toBe(400)
  })
})

describe('GET /api/prices/stats', () => {
  it('returns count stats', async () => {
    vi.mocked(prisma.product.count).mockResolvedValue(25)
    vi.mocked(prisma.district.count).mockResolvedValue(16)
    vi.mocked(prisma.price.count).mockResolvedValue(1024)
    const res = await getStats(new Request('http://localhost/api/prices/stats'))
    const data = await res.json()
    expect(data.productCount).toBe(25)
    expect(data.districtCount).toBe(16)
    expect(data.todayCount).toBe(1024)
  })
})
