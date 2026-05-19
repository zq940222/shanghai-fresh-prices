import { NextResponse } from 'next/server'
import { runScraperJob } from '@/lib/cron'

export async function POST() {
  try {
    const result = await runScraperJob()
    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, count: 0, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
