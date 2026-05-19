'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Status = 'idle' | 'running' | 'success' | 'error' | 'cooldown'

interface RunResult {
  count?: number
  error?: string
  retryAfter?: number
}

export default function ScraperButton() {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function startCooldown(seconds: number) {
    setCooldown(seconds)
    setStatus('cooldown')
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          timerRef.current = null
          setStatus('idle')
          setMessage('')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const handleClick = useCallback(async () => {
    if (status === 'running' || status === 'cooldown') return
    setStatus('running')
    setMessage('')

    try {
      const response = await fetch('/api/scraper/run', { method: 'POST' })
      const body: RunResult = await response.json().catch(() => ({}))

      if (response.status === 429) {
        setMessage(body.error ?? '请稍后再试')
        startCooldown(body.retryAfter ?? 300)
        return
      }

      if (!response.ok) {
        setMessage(body.error ?? '抓取失败，请查看日志')
        setStatus('error')
        return
      }

      setMessage(`抓取成功，共导入 ${body.count ?? 0} 条记录`)
      setStatus('success')
      startCooldown(300)
    } catch {
      setMessage('网络错误，请稍后重试')
      setStatus('error')
    }
  }, [status])

  const isBusy = status === 'running' || status === 'cooldown'

  function formatCooldown(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : `${sec}s`
  }

  function buttonLabel() {
    if (status === 'running') return '抓取中...'
    if (status === 'cooldown') return `冷却中 (${formatCooldown(cooldown)})`
    return '立即抓取'
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isBusy}
        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'running' && (
          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}
        {buttonLabel()}
      </button>

      {message && (
        <p className={`text-xs ${status === 'error' ? 'text-red-600' : 'text-zinc-500'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
