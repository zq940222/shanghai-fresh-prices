interface StatsCardsProps {
  totalRecords: number
  categories: number
  markets: number
  latestUpdate: string | Date | null
}

function formatLatestUpdate(value: string | Date | null) {
  if (!value) return '暂无数据'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '暂无数据'
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function StatsCards({ totalRecords, categories, markets, latestUpdate }: StatsCardsProps) {
  const items = [
    { label: '价格记录总数', value: totalRecords.toLocaleString('zh-CN') },
    { label: '品类数', value: categories.toLocaleString('zh-CN') },
    { label: '覆盖区域数', value: markets.toLocaleString('zh-CN') },
    { label: '最新更新', value: formatLatestUpdate(latestUpdate) },
  ]

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article key={item.label} className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">{item.label}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">{item.value}</p>
        </article>
      ))}
    </section>
  )
}
