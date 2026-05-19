import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  default: {
    price: {
      groupBy: vi.fn(),
    },
  },
}))

import prisma from '@/lib/prisma'
import { GET as getTrend } from '@/app/api/prices/trend/route'

describe('GET /api/prices/trend', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns grouped trend points for a product name', async () => {
    vi.mocked(prisma.price.groupBy).mockResolvedValue([
      {
        priceDate: new Date('2026-05-18T00:00:00.000Z'),
        _avg: { retailPrice: 5.25 },
      },
      {
        priceDate: new Date('2026-05-19T00:00:00.000Z'),
        _avg: { retailPrice: 5.75 },
      },
    ] as never)

    const response = await getTrend(
      new Request('http://localhost/api/prices/trend?name=Tomato&days=7')
    )
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual([
      { date: '2026-05-18', avgPrice: 5.25 },
      { date: '2026-05-19', avgPrice: 5.75 },
    ])
    expect(prisma.price.groupBy).toHaveBeenCalledWith(
      expect.objectContaining({
        by: ['priceDate'],
        _avg: { retailPrice: true },
        orderBy: { priceDate: 'asc' },
        where: expect.objectContaining({
          product: {
            name: {
              contains: 'Tomato',
              mode: 'insensitive',
            },
          },
        }),
      })
    )
  })

  it('returns 400 when name is missing', async () => {
    const response = await getTrend(new Request('http://localhost/api/prices/trend'))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Product name is required.',
    })
    expect(prisma.price.groupBy).not.toHaveBeenCalled()
  })
})
