'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Slide } from '@/lib/types'
import { Photo, srcFor } from './Photo'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Full-screen homepage slideshow.
 * Click the left/right half, scroll, swipe or use the arrow keys to move.
 * Each new photo is revealed with a wipe in the direction of travel.
 */
export function Slideshow({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [dir, setDir] = useState<1 | -1>(1)
  const lock = useRef(0)
  const indexRef = useRef(0)
  const wheel = useRef(0)
  const n = slides.length

  const go = useCallback(
    (step: 1 | -1) => {
      const now = Date.now()
      if (now < lock.current || n < 2) return
      lock.current = now + 750
      const from = indexRef.current
      const to = (from + step + n) % n
      indexRef.current = to
      setDir(step)
      setPrev(from)
      setIndex(to)
    },
    [n],
  )

  // Preload neighbours so transitions never wait on the network.
  useEffect(() => {
    for (const k of [1, -1, 2]) {
      const s = slides[(index + k + n) % n]
      if (s) new Image().src = srcFor(s.image, 1600)
    }
  }, [index, n, slides])

  // Keyboard + wheel/trackpad
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    const onWheel = (e: WheelEvent) => {
      wheel.current += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      if (Math.abs(wheel.current) > 60) {
        go(wheel.current > 0 ? 1 : -1)
        wheel.current = 0
      }
    }
    window.addEventListener('keydown', key)
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => {
      window.removeEventListener('keydown', key)
      window.removeEventListener('wheel', onWheel)
    }
  }, [go])

  // Touch swipe
  const touch = useRef<number | null>(null)

  // Keep the info panel glued to the right edge of the photo on screen.
  // Uses layout sizes (not the animated transforms), so it lands where the photo ends up.
  const root = useRef<HTMLDivElement>(null)
  const [infoX, setInfoX] = useState<number | null>(null)
  useEffect(() => {
    const el = root.current
    if (!el) return
    const measure = () => {
      const img = el.querySelector<HTMLImageElement>('.slide.is-current img')
      const stage = img?.closest<HTMLElement>('.slideshow-stage')
      if (!img || !stage) return
      setInfoX(stage.offsetLeft + img.offsetLeft + img.offsetWidth)
    }
    measure()
    const img = el.querySelector<HTMLImageElement>('.slide.is-current img')
    img?.addEventListener('load', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => {
      img?.removeEventListener('load', measure)
      ro.disconnect()
    }
  }, [index])

  if (!n) return <p className="empty">Add slides in the Studio → Site settings → Homepage slideshow.</p>

  const current = slides[index]
  const counter = `${pad(index + 1)} / ${pad(n)}`

  return (
    <div
      ref={root}
      className="slideshow"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return
        const dx = e.changedTouches[0].clientX - touch.current
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
        touch.current = null
      }}
    >
      <div className="slideshow-stage">
        {prev !== null && prev !== index && (
          <figure key={`out-${prev}`} className="slide slide-out">
            <Photo image={slides[prev].image} sizes="90vw" />
          </figure>
        )}
        <figure
          key={`in-${index}`}
          className={`slide is-current ${prev === null ? 'slide-first' : dir === 1 ? 'slide-in-next' : 'slide-in-prev'}`}
        >
          <Photo image={current.image} sizes="90vw" priority />
        </figure>
      </div>

      <button className="slideshow-hit left" aria-label="Previous photo" data-cursor={`← Prev  ${counter}`} onClick={() => go(-1)} />
      <button className="slideshow-hit right" aria-label="Next photo" data-cursor={`Next →  ${counter}`} onClick={() => go(1)} />

      <aside
        className="slideshow-info"
        style={infoX !== null ? ({ '--info-x': `${infoX}px` } as CSSProperties) : undefined}
      >
        <div className="slideshow-count" aria-live="polite">
          <span className="big">{pad(index + 1)}</span>
          <span className="of">/ {pad(n)}</span>
        </div>
        <div className="slideshow-ticks" aria-hidden>
          {slides.map((_, i) => (
            <span key={i} className={i === index ? 'is-active' : ''} />
          ))}
        </div>
        <div key={index} className="slideshow-caption">
          {current.project ? (
            <Link href={`/work/${current.project.slug}`} data-cursor="View project">
              {current.project.title}&nbsp;<span className="arrow">↗</span>
            </Link>
          ) : (
            current.image.caption && <span>{current.image.caption}</span>
          )}
        </div>
        <div className="slideshow-nav">
          <button onClick={() => go(-1)} aria-label="Previous photo">← Prev</button>
          <button onClick={() => go(1)} aria-label="Next photo">Next →</button>
        </div>
      </aside>
    </div>
  )
}
