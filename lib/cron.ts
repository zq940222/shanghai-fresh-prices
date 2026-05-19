import cron from 'node-cron'
import prisma from '@/lib/prisma'
import { scrapePrices } from '@/lib/scraper'

function startOfDay(value: string) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

export async function runScraperJob() {
  try {
    const rows = await scrapePrices()
    let count = 0

    for (const row of rows) {
      const product = await prisma.product.upsert({
        where: { name: row.name },
        update: {
          category: row.category,
          unit: row.unit,
        },
        create: {
          name: row.name,
          category: row.category,
          unit: row.unit,
        },
      })

      const district = await prisma.district.upsert({
        where: { name: row.market },
        update: {},
        create: { name: row.market },
      })

      const origin = await prisma.origin.upsert({
        where: { name: 'Local' },
        update: { province: 'Shanghai' },
        create: {
          name: 'Local',
          province: 'Shanghai',
        },
      })

      const quality = await prisma.qualityGrade.upsert({
        where: { name: 'Standard' },
        update: { description: 'Imported from automated scraper.' },
        create: {
          name: 'Standard',
          description: 'Imported from automated scraper.',
        },
      })

      await prisma.price.upsert({
        where: {
          productId_districtId_originId_qualityId_priceDate: {
            productId: product.id,
            districtId: district.id,
            originId: origin.id,
            qualityId: quality.id,
            priceDate: startOfDay(row.date),
          },
        },
        update: {
          wholesalePrice: row.price,
          retailPrice: row.price,
          source: 'scraper',
        },
        create: {
          productId: product.id,
          districtId: district.id,
          originId: origin.id,
          qualityId: quality.id,
          wholesalePrice: row.price,
          retailPrice: row.price,
          priceDate: startOfDay(row.date),
          source: 'scraper',
        },
      })

      count += 1
    }

    await prisma.scraperLog.create({
      data: {
        status: 'success',
        totalCount: count,
      },
    })

    return { success: true, count }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown scraper error.'

    await prisma.scraperLog.create({
      data: {
        status: 'failed',
        totalCount: 0,
        errorMsg: message,
      },
    })

    throw error
  }
}

let scheduledJob: ReturnType<typeof cron.schedule> | null = null

export function scheduleScraperJob() {
  if (scheduledJob) {
    return scheduledJob
  }

  const expression = process.env.CRON_SCHEDULE?.trim() || '0 6 * * *'
  scheduledJob = cron.schedule(expression, () => {
    void runScraperJob()
  })

  return scheduledJob
}
