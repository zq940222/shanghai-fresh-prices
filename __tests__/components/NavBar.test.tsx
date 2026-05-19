import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import NavBar from '@/components/NavBar'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('NavBar', () => {
  it('renders the primary navigation links', () => {
    render(<NavBar />)

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Trends' })).toHaveAttribute('href', '/trends')
    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin')
  })
})
