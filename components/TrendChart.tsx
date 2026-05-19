'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export interface TrendPoint {
  date: string
  avgPrice: number
}

interface TrendChartProps {
  data: TrendPoint[]
}

export default function TrendChart({ data }: TrendChartProps) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-950">Price Trend</h2>
        <p className="text-sm text-zinc-500">Daily average price for the selected product.</p>
      </div>

      {data.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#e4e4e7" strokeDasharray="4 4" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#71717a' }} />
              <YAxis tick={{ fontSize: 12, fill: '#71717a' }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="avgPrice"
                stroke="#059669"
                strokeWidth={3}
                dot={{ fill: '#059669', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 px-4 py-16 text-center text-sm text-zinc-500">
          Search for a product to load its trend data.
        </div>
      )}
    </section>
  )
}
