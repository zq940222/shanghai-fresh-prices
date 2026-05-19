import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

vi.mock('axios')

import axios from 'axios'
import { scrapePrices } from '@/lib/scraper'

const SHANGHAI_HTML = `<table id="goaler">
  <tr><td>上海市</td><td>上海农产品中心批发市场有限公司</td><td>5.0</td><td>4.8</td><td>4</td><td></td></tr>
</table>`

describe('scrapePrices', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.mocked(axios.get).mockResolvedValue({ data: SHANGHAI_HTML } as never)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('returns rows with correct ScrapedPrice shape', async () => {
    const promise = scrapePrices()
    await vi.runAllTimersAsync()
    const rows = await promise

    expect(rows.length).toBeGreaterThan(0)
    expect(rows[0]).toMatchObject({
      name: expect.any(String),
      category: expect.any(String),
      unit: '斤',
      wholesalePrice: 2.5,   // 5.0 yuan/kg ÷ 2
      retailPrice: expect.any(Number),
      district: '闵行区',    // 农产品中心 → 闵行区
      date: expect.any(String),
    })
  })

  it('skips non-Shanghai rows', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: '<table id="goaler"><tr><td>北京市</td><td>某市场</td><td>4.0</td><td></td><td></td><td></td></tr></table>',
    } as never)

    const promise = scrapePrices()
    await vi.runAllTimersAsync()
    const rows = await promise

    expect(rows).toHaveLength(0)
  })

  it('continues when a commodity request fails', async () => {
    vi.mocked(axios.get)
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValue({ data: SHANGHAI_HTML } as never)

    const promise = scrapePrices()
    await vi.runAllTimersAsync()
    const rows = await promise

    // At least the successful requests should produce rows
    expect(rows.length).toBeGreaterThan(0)
  })
})
