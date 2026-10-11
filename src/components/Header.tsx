'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Compact menu: name and links sit together in one cluster.
 * - A block slides between the items you hover (and rests on the current page).
 * - The whole bar inverts against whatever is behind it, so it stays readable over photos.
 * - It slides away when you scroll down and comes back when you scroll up.
 */
export function Header({ title, count }: { title: string; count?: number }) {
  const pathname = usePathname()
  const nav = useRef<HTMLElement>(null)
  const items = useRef<(HTMLAnchorElement | null)[]>([])
  const [hover, setHover] = useState<number | null>(null)
  const [box, setBox] = useState<{ x: number; w: number } | null>(null)
  const [hidden, setHidden] = useState(false)

  const links = [
    { href: '/', label: title },
    { href: '/work', label: 'Archive', sup: count },
    { href: '/about', label: 'About' },
  ]
  const active = links.findIndex((l) => (l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)))
  const target = hover ?? (active >= 0 ? active : null)

  // Move the sliding block to the hovered / active item
  useIsoLayoutEffect(() => {
    const el = target !== null ? items.current[target] : null
    setBox(el ? { x: el.offsetLeft, w: el.offsetWidth } : null)
  }, [target, title, count])

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - last) < 6) return
      setHidden(y > last && y > 120)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => setHidden(false), [pathname])

  return (
    <header className={`header ${hidden ? 'is-hidden' : ''}`}>
      <nav ref={nav} className="menu" onPointerLeave={() => setHover(null)}>
        {links.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            ref={(el) => {
              items.current[i] = el
            }}
            className={`menu-item ${i === 0 ? 'menu-name' : ''} ${i === target ? 'is-on' : ''}`}
            data-magnetic="0.18"
            onPointerEnter={(e) => {
              setHover(i)
              scramble(e.currentTarget.querySelector('.menu-label') as HTMLElement, l.label)
            }}
          >
            <span className="menu-label">{l.label}</span>
            {l.sup ? <sup>{String(l.sup).padStart(2, '0')}</sup> : null}
          </Link>
        ))}
        <span
          className="menu-indicator"
          aria-hidden
          style={box ? { transform: `translateX(${box.x}px)`, width: box.w, opacity: 1 } : { opacity: 0 }}
        />
      </nav>
    </header>
  )
}

/** Letters briefly shuffle, then settle left to right. A newer call replaces a running one. */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*/+'
const runs = new WeakMap<HTMLElement, number>()
export function scramble(el: HTMLElement | null, text: string, frames = 14) {
  if (!el) return
  const id = (runs.get(el) ?? 0) + 1
  runs.set(el, id)
  let f = 0
  const tick = () => {
    if (runs.get(el) !== id) return // superseded by a newer label
    el.textContent = text
      .split('')
      .map((c, i) => (c === ' ' || i < (f / frames) * text.length ? c : CHARS[(Math.random() * CHARS.length) | 0]))
      .join('')
    if (++f <= frames) requestAnimationFrame(tick)
    else el.textContent = text
  }
  tick()
}
