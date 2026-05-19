import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const logs = await prisma.scraperLog.findMany({
      orderBy: { runAt: 'desc' },
      take: 20,
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
