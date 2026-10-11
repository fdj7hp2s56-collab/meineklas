'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/work', label: 'Archive' },
  { href: '/about', label: 'About' },
]

export function Header({ title }: { title: string }) {
  const pathname = usePathname()
  return (
    <header className="header">
      <Link href="/" className="header-name" data-cursor="Overview">
        <ScrambleText text={title} />
      </Link>
      <nav className="header-nav">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={pathname.startsWith(n.href) ? 'is-active' : ''}>
            <ScrambleText text={n.label} />
          </Link>
        ))}
      </nav>
    </header>
  )
}

/** Letters briefly shuffle on hover, then settle. */
function ScrambleText({ text }: { text: string }) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const run = (el: HTMLSpanElement) => {
    if (el.dataset.running) return
    el.dataset.running = '1'
    let frame = 0
    const total = 14
    const tick = () => {
      el.textContent = text
        .split('')
        .map((c, i) => (c === ' ' || i < (frame / total) * text.length ? c : chars[(Math.random() * chars.length) | 0]))
        .join('')
      if (++frame <= total) requestAnimationFrame(tick)
      else {
        el.textContent = text
        delete el.dataset.running
      }
    }
    tick()
  }
  return (
    <span className="scramble" onPointerEnter={(e) => run(e.currentTarget)} aria-label={text}>
      {text}
    </span>
  )
}
