import axios from 'axios'
import * as cheerio from 'cheerio'

export interface ScrapedPrice {
  name: string
  category: string
  unit: string
  wholesalePrice: number
  retailPrice: number
  district: string
  date: string
}

// cif.mofcom.gov.cn commodity ID → product info
// Prices on the site are in yuan/公斤; we convert to yuan/斤 (÷ 2)
const COMMODITIES = [
  // 蔬菜
  { id: '170120', name: '西红柿', category: '蔬菜' },
  { id: '170130', name: '黄瓜',   category: '蔬菜' },
  { id: '170140', name: '茄子',   category: '蔬菜' },
  { id: '170080', name: '土豆',   category: '蔬菜' },
  { id: '170060', name: '白菜',   category: '蔬菜' },
  { id: '170160', name: '青椒',   category: '蔬菜' },
  { id: '170250', name: '大葱',   category: '蔬菜' },
  // 猪肉
  { id: '130014', name: '猪里脊', category: '猪肉' },
  // 牛羊肉
  { id: '130025', name: '牛腩',   category: '牛羊肉' },
  { id: '130035', name: '羊腿',   category: '牛羊肉' },
  // 禽类
  { id: '280020', name: '整鸡',   category: '禽类' },
  // 蛋类（鲜鸡蛋，元/公斤 → 元/斤）
  { id: '150010', name: '鸡蛋',   category: '蛋类' },
]

// Keywords in Shanghai market name → district
const MARKET_DISTRICT: [string, string][] = [
  ['西郊',       '青浦区'],
  ['江桥',       '嘉定区'],
  ['江杨',       '宝山区'],
  ['浦东',       '浦东新区'],
  ['农产品中心', '闵行区'],
  ['曹安',       '普陀区'],
  ['沪北',       '宝山区'],
  ['嘉定',       '嘉定区'],
  ['松江',       '松江区'],
]

function resolveDistrict(marketName: string): string {
  for (const [keyword, district] of MARKET_DISTRICT) {
    if (marketName.includes(keyword)) return district
  }
  return '浦东新区'
}

// 35% retail markup over wholesale (approximation — source only provides wholesale data)
const RETAIL_MARKUP = 1.35

function round2(n: number) {
  return Math.round(n * 100) / 100
}

async function scrapeCommodity(
  id: string,
  name: string,
  category: string,
  date: string,
): Promise<ScrapedPrice[]> {
  const url = `https://cif.mofcom.gov.cn/cif/seach.fhtml?commdityid=${id}`
  const response = await axios.get<string>(url, {
    timeout: 12000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      Referer: 'https://cif.mofcom.gov.cn/',
    },
  })

  const $ = cheerio.load(response.data)
  const results: ScrapedPrice[] = []

  $('table#goaler tr').each((_, row) => {
    const cells = $(row).find('td')
    if (cells.length < 3) return

    const region = cells.eq(0).text().trim()
    if (!region.includes('上海')) return

    const market = cells.eq(1).text().trim()
    const pricePerKg = parseFloat(cells.eq(2).text().trim())
    if (!isFinite(pricePerKg) || pricePerKg <= 0) return

    const wholesalePrice = round2(pricePerKg / 2)
    const retailPrice = round2(wholesalePrice * RETAIL_MARKUP)

    results.push({
      name,
      category,
      unit: '斤',
      wholesalePrice,
      retailPrice,
      district: resolveDistrict(market),
      date,
    })
  })

  return results
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export async function scrapePrices(): Promise<ScrapedPrice[]> {
  const today = new Date().toISOString().split('T')[0]
  const all: ScrapedPrice[] = []

  for (const c of COMMODITIES) {
    try {
      const rows = await scrapeCommodity(c.id, c.name, c.category, today)
      all.push(...rows)
      console.log(`[scraper] ${c.name}: 获取到 ${rows.length} 条上海数据`)
    } catch (err) {
      console.error(`[scraper] ${c.name} (${c.id}) 失败:`, err instanceof Error ? err.message : err)
    }
    await delay(600)
  }

  return all
}
