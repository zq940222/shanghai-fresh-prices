import { describe, expect, it } from 'vitest'
import { scrapePrices } from '@/lib/scraper'

describe('scrapePrices', () => {
  it('returns normalized scraper rows', async () => {
    const rows = await scrapePrices()

    expect(Array.isArray(rows)).toBe(true)
    expect(rows.length).toBeGreaterThan(0)
    expect(rows[0]).toMatchObject({
      name: expect.any(String),
      category: expect.any(String),
      unit: expect.any(String),
      price: expect.any(Number),
      market: expect.any(String),
      date: expect.any(String),
    })
  })
})
