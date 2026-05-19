import Link from 'next/link'

const links = [
  { href: '/', label: 'Home' },
  { href: '/trends', label: 'Trends' },
  { href: '/admin', label: 'Admin' },
]

export default function NavBar() {
  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-950">
          Shanghai Fresh Prices
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
