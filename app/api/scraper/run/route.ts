import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { runScraperJob } from '@/lib/cron'

const COOLDOWN_SECONDS = 300

export async function POST() {
  try {
    const latest = await prisma.scraperLog.findFirst({
      orderBy: { runAt: 'desc' },
    })

    if (latest) {
      const elapsed = Math.floor((Date.now() - new Date(latest.runAt).getTime()) / 1000)
      const remaining = COOLDOWN_SECONDS - elapsed
      if (remaining > 0) {
        return NextResponse.json(
          { error: '操作过于频繁，请稍后再试。', retryAfter: remaining },
          { status: 429 }
        )
      }
    }

    const result = await runScraperJob()
    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: '抓取任务执行失败，请检查日志。' },
      { status: 500 }
    )
  }
}
