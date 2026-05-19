import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const p = new URL(req.url).searchParams
  const where: Record<string, unknown> = {}
  if (p.get('productId')) where.productId = parseInt(p.get('productId')!)
  if (p.get('districtId')) where.districtId = parseInt(p.get('districtId')!)
  if (p.get('originId')) where.originId = parseInt(p.get('originId')!)
  if (p.get('qualityId')) where.qualityId = parseInt(p.get('qualityId')!)
  if (p.get('date')) where.priceDate = new Date(p.get('date')!)

  try {
    const prices = await prisma.price.findMany({
      where,
      include: {
        product: true,
        district: true,
        origin: true,
        quality: true,
      },
      orderBy: { priceDate: 'desc' },
      take: 200,
    })
    return NextResponse.json(prices)
  } catch (e) {
    console.error('[GET /api/prices]', e)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  let body: {
    productId?: number
    districtId?: number
    originId?: number
    qualityId?: number
    wholesalePrice?: number
    retailPrice?: number
    priceDate?: string
    source?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '请求体格式无效' }, { status: 400 })
  }

  const { productId, districtId, originId, qualityId, wholesalePrice, retailPrice, priceDate } = body

  if (!productId || !districtId || !originId || !qualityId || !wholesalePrice || !retailPrice || !priceDate) {
    return NextResponse.json({ error: '所有字段均为必填项' }, { status: 400 })
  }

  try {
    const date = new Date(priceDate)
    const price = await prisma.price.upsert({
      where: {
        productId_districtId_originId_qualityId_priceDate: {
          productId, districtId, originId, qualityId, priceDate: date,
        },
      },
      update: { wholesalePrice, retailPrice, source: body.source ?? 'manual' },
      create: { productId, districtId, originId, qualityId, wholesalePrice, retailPrice, priceDate: date, source: body.source ?? 'manual' },
    })
    return NextResponse.json(price, { status: 201 })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: `数据库错误: ${e.code}` }, { status: 422 })
    }
    console.error(e)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
