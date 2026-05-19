import type { AnchorHTMLAttributes } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import NavBar from '@/components/NavBar'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('NavBar', () => {
  it('renders the primary navigation links', () => {
    render(<NavBar />)

    expect(screen.getByRole('link', { name: '价格查询' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: '趋势图' })).toHaveAttribute('href', '/trends')
    expect(screen.getByRole('link', { name: '后台管理' })).toHaveAttribute('href', '/admin')
  })
})
