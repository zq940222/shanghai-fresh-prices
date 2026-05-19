import Link from 'next/link'

const links = [
  { href: '/', label: '价格查询' },
  { href: '/trends', label: '趋势图' },
  { href: '/admin', label: '后台管理' },
]

export default function NavBar() {
  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-950">
          🥬 上海生鲜价格系统
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
