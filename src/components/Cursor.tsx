'use client'

import { useEffect, useRef } from 'react'

/**
 * Custom cursor.
 * - A small dot that inverts whatever is beneath it.
 * - Any element with `data-cursor="Label"` turns it into a lagging label pill
 *   that tilts with the mouse speed.
 * - Links grow the dot into a ring.
 * Only active on devices with a precise pointer (mouse / trackpad).
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLDivElement>(null)
  const text = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')

    let x = -100, y = -100 // pointer
    let lx = x, ly = y // label (lerped)
    let tilt = 0
    let visible = false
    let lastText = ''
    let raf = 0

    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (!visible) {
        visible = true
        lx = x
        ly = y
        document.documentElement.classList.add('cursor-visible')
      }
    }
    const leave = () => {
      visible = false
      document.documentElement.classList.remove('cursor-visible')
    }
    const down = () => document.documentElement.classList.add('cursor-down')
    const up = () => document.documentElement.classList.remove('cursor-down')

    const loop = () => {
      const vx = x - lx
      lx += vx * 0.18
      ly += (y - ly) * 0.18
      tilt += (Math.max(-14, Math.min(14, vx * 0.35)) - tilt) * 0.15

      // What's under the pointer? (re-checked every frame so labels update after clicks too)
      const el = visible ? (document.elementFromPoint(x, y) as HTMLElement | null) : null
      const target = el?.closest<HTMLElement>('[data-cursor]')
      const t = target?.dataset.cursor ?? ''
      const isLink = !t && !!el?.closest('a, button, [role="button"], input, label')

      if (t !== lastText) {
        lastText = t
        if (text.current && t) text.current.textContent = t
        label.current?.classList.toggle('is-active', !!t)
        dot.current?.classList.toggle('is-hidden', !!t)
      }
      dot.current?.classList.toggle('is-link', isLink)

      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
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
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.removeEventListener('pointerleave', leave)
      document.documentElement.classList.remove('has-cursor', 'cursor-visible')
    }
  }, [])

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden />
      <div ref={label} className="cursor-label" aria-hidden>
        <span ref={text} />
      </div>
    </>
  )
}
