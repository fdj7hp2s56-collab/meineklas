'use client'

import { useEffect, useRef } from 'react'
import { scramble } from './Header'

/**
 * Custom cursor, built around a camera viewfinder.
 * - Default: a dot that inverts what's beneath it and stretches in the direction of travel.
 * - Over links: grows into a ring. Elements with `data-magnetic` get pulled towards the pointer.
 * - Over `data-cursor="Label"` elements (photos, slideshow halves…): a viewfinder frame with
 *   corner brackets locks on, and the label types itself in.
 * - Clicking fires a quick "shutter" flash.
 * Only active on devices with a precise pointer (mouse / trackpad).
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLDivElement>(null)
  const text = useRef<HTMLSpanElement>(null)
  const shutters = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const root = document.documentElement
    root.classList.add('has-cursor')

    let x = -100, y = -100 // pointer
    let dx = x, dy = y // dot (slightly smoothed)
    let lx = x, ly = y // label (lagging)
    let tilt = 0
    let visible = false
    let lastText = ''
    let magnet: HTMLElement | null = null
    let base: DOMRect | null = null
    let raf = 0

    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (!visible) {
        visible = true
        dx = lx = x
        dy = ly = y
        root.classList.add('cursor-visible')
      }
    }
    const leave = () => {
      visible = false
      root.classList.remove('cursor-visible')
    }
    const down = () => {
      root.classList.add('cursor-down')
      // Shutter flash
      const s = document.createElement('div')
      s.className = lastText ? 'cursor-shutter is-frame' : 'cursor-shutter'
      s.style.transform = `translate3d(${x}px, ${y}px, 0)`
      shutters.current?.appendChild(s)
      s.addEventListener('animationend', () => s.remove())
    }
    const up = () => root.classList.remove('cursor-down')

    const release = (el: HTMLElement | null) => {
      if (el) el.style.transform = ''
    }

    const loop = () => {
      // Dot: follows closely, stretches with speed
      const vx = x - dx, vy = y - dy
      dx += vx * 0.5
      dy += vy * 0.5
      const speed = Math.min(Math.hypot(vx, vy), 60)
      const angle = Math.atan2(vy, vx)
      const stretch = 1 + speed / 40

      // Label: lags behind and tilts with horizontal speed
      const lvx = x - lx
      lx += lvx * 0.16
      ly += (y - ly) * 0.16
      tilt += (Math.max(-12, Math.min(12, lvx * 0.3)) - tilt) * 0.15

      const el = visible ? (document.elementFromPoint(x, y) as HTMLElement | null) : null
      const t = el?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? ''
      const isLink = !t && !!el?.closest('a, button, [role="button"], input, label')

      if (t !== lastText) {
        lastText = t
        if (t) scramble(text.current, t, 10)
        label.current?.classList.toggle('is-active', !!t)
        dot.current?.classList.toggle('is-hidden', !!t)
      }
      dot.current?.classList.toggle('is-link', isLink)

      // Magnetic elements lean towards the pointer
      const m = el?.closest<HTMLElement>('[data-magnetic]') ?? null
      if (m !== magnet) {
        release(magnet)
        magnet = m
        base = m ? m.getBoundingClientRect() : null // measured at rest, before we move it
      }
      if (magnet && base) {
        const r = base
        const k = parseFloat(magnet.dataset.magnetic || '') || 0.35
        const mx = (x - (r.left + r.width / 2)) * k
        const my = (y - (r.top + r.height / 2)) * k
        magnet.style.transform = `translate3d(${mx}px, ${my}px, 0)`
      }

      if (dot.current) {
        dot.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${angle}rad) scale(${stretch}, ${1 / Math.sqrt(stretch)})`
      }
      if (label.current) label.current.style.transform = `translate3d(${lx}px, ${ly}px, 0) rotate(${tilt}deg)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.addEventListener('pointerleave', leave)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      release(magnet)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.removeEventListener('pointerleave', leave)
      root.classList.remove('has-cursor', 'cursor-visible', 'cursor-down')
    }
  }, [])

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden />
      <div ref={label} className="cursor-label" aria-hidden>
        <div className="cursor-frame">
          <i className="c tl" />
          <i className="c tr" />
          <i className="c bl" />
          <i className="c br" />
          <span ref={text} />
        </div>
      </div>
      <div ref={shutters} className="cursor-shutters" aria-hidden />
    </>
  )
}
