import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const products = await prisma.product.findMany({
    where: category ? { category } : undefined,
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  })
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  if (!body.name || !body.category) {
    return NextResponse.json({ error: '品种名称和品类为必填项' }, { status: 400 })
  }
  const product = await prisma.product.create({
    data: {
      name: body.name,
      category: body.category,
      unit: body.unit ?? '斤',
    },
  })
  return NextResponse.json(product, { status: 201 })
}
