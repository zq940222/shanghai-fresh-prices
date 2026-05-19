import axios from 'axios'
import * as cheerio from 'cheerio'

export interface ScrapedPrice {
  name: string
  category: string
  unit: string
  price: number
  market: string
  date: string
}

const fallbackRows: ScrapedPrice[] = [
  {
    name: 'Tomato',
    category: 'Vegetables',
    unit: 'kg',
    price: 6.2,
    market: 'Pudong',
    date: '2026-05-19',
  },
  {
    name: 'Cucumber',
    category: 'Vegetables',
    unit: 'kg',
    price: 5.4,
    market: 'Minhang',
    date: '2026-05-19',
  },
  {
    name: 'Spinach',
    category: 'Leafy Greens',
    unit: 'kg',
    price: 7.1,
    market: 'Xuhui',
    date: '2026-05-19',
  },
]

function normalizeDate(value?: string) {
  if (!value) {
    return new Date().toISOString().split('T')[0]
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().split('T')[0]
  }

  return parsed.toISOString().split('T')[0]
}

function normalizePrice(value?: string) {
  const matched = value?.match(/\d+(?:\.\d+)?/)
  return matched ? Number.parseFloat(matched[0]) : Number.NaN
}

function parseHtml(html: string) {
  const $ = cheerio.load(html)
  const rows: ScrapedPrice[] = []

  $('[data-price-row], table tbody tr').each((_, row) => {
    const cells = $(row).find('td')
    const name = $(row).attr('data-name') ?? cells.eq(0).text().trim()
    const category = $(row).attr('data-category') ?? cells.eq(1).text().trim()
    const unit = $(row).attr('data-unit') ?? cells.eq(2).text().trim()
    const rawPrice = $(row).attr('data-price') ?? cells.eq(3).text().trim()
    const market = $(row).attr('data-market') ?? cells.eq(4).text().trim()
    const date = $(row).attr('data-date') ?? cells.eq(5).text().trim()
    const price = normalizePrice(rawPrice)

    if (!name || !category || !unit || !market || Number.isNaN(price)) {
      return
    }

    rows.push({
      name,
      category,
      unit,
      price,
      market,
      date: normalizeDate(date),
    })
  })

  return rows
}

export async function scrapePrices() {
  const targetUrl = process.env.SCRAPER_TARGET_URL?.trim()

  if (!targetUrl) {
    return fallbackRows
  }

  try {
    const response = await axios.get<string>(targetUrl, {
      timeout: 5000,
      headers: {
        'User-Agent': 'shanghai-fresh-prices-bot/1.0',
      },
    })

    const rows = parseHtml(response.data)
    return rows.length > 0 ? rows : fallbackRows
  } catch (error) {
    console.error(error)
    return fallbackRows
  }
}
