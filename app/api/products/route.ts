import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const category = new URL(req.url).searchParams.get('category')
  try {
    const products = await prisma.product.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    })
    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  let body: { name?: string; category?: string; unit?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '请求体格式无效' }, { status: 400 })
  }
  if (!body.name || !body.category) {
    return NextResponse.json({ error: '品种名称和品类为必填项' }, { status: 400 })
  }
  try {
    const product = await prisma.product.create({
      data: {
        name: body.name,
        category: body.category,
        unit: body.unit ?? '斤',
      },
    })
    return NextResponse.json(product, { status: 201 })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return NextResponse.json({ error: '该品种名称已存在' }, { status: 409 })
    }
    console.error(e)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
