import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import NavBar from '@/components/NavBar'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '上海生鲜价格',
  description: 'Track fresh produce pricing across Shanghai markets.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[linear-gradient(180deg,#f5f7f2_0%,#ffffff_40%)] text-zinc-950">
        <div className="flex min-h-full flex-col">
          <NavBar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}
