import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_req: NextRequest) {
  const origins = await prisma.origin.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(origins)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  if (!body.name) {
    return NextResponse.json({ error: '产地名称为必填项' }, { status: 400 })
  }
  const origin = await prisma.origin.create({
    data: { name: body.name, province: body.province ?? '' },
  })
  return NextResponse.json(origin, { status: 201 })
}
