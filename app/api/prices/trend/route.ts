import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

type AvgValue = number | string | { toNumber?: () => number } | null | undefined

function toNumber(value: AvgValue) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value)
  if (value && typeof value === 'object' && typeof value.toNumber === 'function') {
    return value.toNumber()
  }
  return 0
}

function toDateString(value: Date | string) {
  if (value instanceof Date) {
    return value.toISOString().split('T')[0]
  }

  return new Date(value).toISOString().split('T')[0]
}

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams
  const name = searchParams.get('name')?.trim()
  const rawDays = searchParams.get('days') ?? '30'
  const days = Number.parseInt(rawDays, 10)

  if (!name) {
    return NextResponse.json({ error: 'Product name is required.' }, { status: 400 })
  }

  if (Number.isNaN(days) || days < 1) {
    return NextResponse.json({ error: 'Days must be a positive integer.' }, { status: 400 })
  }

  const startDate = new Date()
  startDate.setHours(0, 0, 0, 0)
  startDate.setDate(startDate.getDate() - (days - 1))

  try {
    const rows = await prisma.price.groupBy({
      by: ['priceDate'],
      where: {
        priceDate: { gte: startDate },
        product: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      },
      _avg: {
        retailPrice: true,
      },
      orderBy: {
        priceDate: 'asc',
      },
    })

    return NextResponse.json(
      rows.map((row) => ({
        date: toDateString(row.priceDate),
        avgPrice: toNumber(row._avg.retailPrice),
      }))
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
