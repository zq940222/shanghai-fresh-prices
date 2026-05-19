import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'

export async function GET(_req: NextRequest) {
  try {
    const origins = await prisma.origin.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(origins)
  } catch {
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  let body: { name?: string; province?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '请求体格式无效' }, { status: 400 })
  }
  if (!body.name) {
    return NextResponse.json({ error: '产地名称为必填项' }, { status: 400 })
  }
  try {
    const origin = await prisma.origin.create({
      data: {
        name: body.name,
        ...(body.province ? { province: body.province } : {}),
      },
    })
    return NextResponse.json(origin, { status: 201 })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return NextResponse.json({ error: '该产地名称已存在' }, { status: 409 })
    }
    console.error(e)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
