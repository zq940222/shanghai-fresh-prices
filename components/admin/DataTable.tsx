'use client'

import Link from 'next/link'

export interface AdminPriceRow {
  id: number
  name: string
  category: string
  market: string
  price: number
  unit: string
  date: string
}

interface DataTableProps {
  rows: AdminPriceRow[]
  onDelete?: (id: number) => void
}

export default function DataTable({ rows, onDelete }: DataTableProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-zinc-950">Price Records</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Market</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Unit</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-zinc-50/60'}
                >
                  <td className="px-4 py-3 font-medium text-zinc-950">{row.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{row.category}</td>
                  <td className="px-4 py-3 text-zinc-600">{row.market}</td>
                  <td className="px-4 py-3 text-zinc-950">{row.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-zinc-600">{row.unit}</td>
                  <td className="px-4 py-3 text-zinc-600">{row.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/prices/${row.id}/edit`}
                        className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => onDelete?.(row.id)}
                        disabled={!onDelete}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                  No admin price records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
