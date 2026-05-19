'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/prices', label: 'Prices' },
  { href: '/admin/prices/new', label: 'Add Price' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
        Admin
      </p>
      <nav className="mt-3 flex flex-col gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
