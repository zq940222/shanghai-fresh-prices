import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_req: NextRequest) {
  const districts = await prisma.district.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(districts)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  if (!body.name) {
    return NextResponse.json({ error: '区域名称为必填项' }, { status: 400 })
  }
  const district = await prisma.district.create({ data: { name: body.name } })
  return NextResponse.json(district, { status: 201 })
}
