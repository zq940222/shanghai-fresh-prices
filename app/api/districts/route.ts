import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'

export async function GET(_req: NextRequest) {
  try {
    const districts = await prisma.district.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(districts)
  } catch {
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  let body: { name?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '请求体格式无效' }, { status: 400 })
  }
  if (!body.name) {
    return NextResponse.json({ error: '区域名称为必填项' }, { status: 400 })
  }
  try {
    const district = await prisma.district.create({ data: { name: body.name } })
    return NextResponse.json(district, { status: 201 })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return NextResponse.json({ error: '该区域名称已存在' }, { status: 409 })
    }
    console.error(e)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
