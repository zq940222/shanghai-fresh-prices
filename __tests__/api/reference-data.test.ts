import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    product: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    district: { findMany: vi.fn() },
    origin: { findMany: vi.fn() },
    qualityGrade: { findMany: vi.fn() },
  },
}))

import prisma from '@/lib/prisma'
import { GET as getProducts, POST as postProduct } from '@/app/api/products/route'
import { GET as getDistricts } from '@/app/api/districts/route'

describe('GET /api/products', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns products list', async () => {
    const mockProducts = [
      { id: 1, name: '西红柿', category: '蔬菜', unit: '斤', createdAt: '2026-01-01T00:00:00.000Z' },
    ]
    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any)

    const res = await getProducts(new Request('http://localhost/api/products'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual(mockProducts)
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    })
  })

  it('filters by category when query param provided', async () => {
    vi.mocked(prisma.product.findMany).mockResolvedValue([])
    const req = new Request('http://localhost/api/products?category=蔬菜')
    await getProducts(req)

    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: { category: '蔬菜' },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    })
  })
})

describe('POST /api/products', () => {
  it('creates a new product', async () => {
    const newProduct = { id: 2, name: '黄瓜', category: '蔬菜', unit: '斤', createdAt: '2026-01-01T00:00:00.000Z' }
    vi.mocked(prisma.product.create).mockResolvedValue(newProduct as any)

    const req = new Request('http://localhost/api/products', {
      method: 'POST',
      body: JSON.stringify({ name: '黄瓜', category: '蔬菜', unit: '斤' }),
    })
    const res = await postProduct(req)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.name).toBe('黄瓜')
  })

  it('returns 400 if name is missing', async () => {
    const req = new Request('http://localhost/api/products', {
      method: 'POST',
      body: JSON.stringify({ category: '蔬菜' }),
    })
    const res = await postProduct(req)
    expect(res.status).toBe(400)
  })
})

describe('GET /api/districts', () => {
  it('returns all districts', async () => {
    vi.mocked(prisma.district.findMany).mockResolvedValue([
      { id: 1, name: '浦东新区' },
    ] as any)
    const res = await getDistricts(new Request('http://localhost/api/districts'))
    expect(res.status).toBe(200)
  })
})
