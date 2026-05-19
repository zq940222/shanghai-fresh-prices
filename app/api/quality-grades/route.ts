import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_req: NextRequest) {
  const grades = await prisma.qualityGrade.findMany({ orderBy: { id: 'asc' } })
  return NextResponse.json(grades)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  if (!body.name) {
    return NextResponse.json({ error: '品质等级名称为必填项' }, { status: 400 })
  }
  const grade = await prisma.qualityGrade.create({
    data: { name: body.name, description: body.description ?? '' },
  })
  return NextResponse.json(grade, { status: 201 })
}
