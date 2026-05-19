interface StatsCardsProps {
  totalRecords: number
  categories: number
  markets: number
  latestUpdate: string | Date | null
}

function formatLatestUpdate(value: string | Date | null) {
  if (!value) return 'No data'

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return 'No data'

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function StatsCards({
  totalRecords,
  categories,
  markets,
  latestUpdate,
}: StatsCardsProps) {
  const items = [
    { label: 'Total Records', value: totalRecords.toLocaleString() },
    { label: 'Categories', value: categories.toLocaleString() },
    { label: 'Markets', value: markets.toLocaleString() },
    { label: 'Latest Update', value: formatLatestUpdate(latestUpdate) },
  ]

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-zinc-500">{item.label}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">{item.value}</p>
        </article>
      ))}
    </section>
  )
}
