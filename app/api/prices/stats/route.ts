import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [productCount, districtCount, todayCount] = await Promise.all([
      prisma.product.count(),
      prisma.district.count(),
      prisma.price.count({ where: { priceDate: { gte: today } } }),
    ])

    return NextResponse.json({ productCount, districtCount, todayCount })
  } catch {
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
