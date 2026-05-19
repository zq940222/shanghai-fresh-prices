import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'

// ordered by id to preserve rank order (精品 > 一级 > 二级 > 统货)
export async function GET(_req: NextRequest) {
  try {
    const grades = await prisma.qualityGrade.findMany({ orderBy: { id: 'asc' } })
    return NextResponse.json(grades)
  } catch {
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  let body: { name?: string; description?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '请求体格式无效' }, { status: 400 })
  }
  if (!body.name) {
    return NextResponse.json({ error: '品质等级名称为必填项' }, { status: 400 })
  }
  try {
    const grade = await prisma.qualityGrade.create({
      data: { name: body.name, description: body.description ?? '' },
    })
    return NextResponse.json(grade, { status: 201 })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return NextResponse.json({ error: '该品质等级名称已存在' }, { status: 409 })
    }
    console.error(e)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
