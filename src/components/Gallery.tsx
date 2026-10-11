'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Img } from '@/lib/types'
import { Photo } from './Photo'

const pad = (n: number) => String(n).padStart(2, '0')
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Project gallery. On desktop, scrolling down moves the photos sideways
 * (a pinned horizontal track). On phones it's a simple vertical stack.
 * Click any photo to open it full-screen.
 */
export function Gallery({ images, title }: { images: Img[]; title: string }) {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | null>(null)
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState<number | null>(null)

  // Section height = horizontal distance to travel + one screen
  useIsoLayoutEffect(() => {
    const t = track.current
    if (!t) return
    const mq = window.matchMedia('(min-width: 768px)')
    const measure = () => setHeight(mq.matches ? t.scrollWidth - window.innerWidth + window.innerHeight : null)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(t)
    mq.addEventListener('change', measure)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      mq.removeEventListener('change', measure)
      window.removeEventListener('resize', measure)
    }
  }, [])

  useEffect(() => {
    if (height === null) {
      if (track.current) track.current.style.transform = ''
      return
    }
    let raf = 0
    const loop = () => {
      const s = section.current, t = track.current
      if (s && t) {
        const max = t.scrollWidth - window.innerWidth
        const top = s.getBoundingClientRect().top
        const p = Math.max(0, Math.min(1, -top / Math.max(1, max)))
        t.style.transform = `translate3d(${-p * max}px, 0, 0)`
        if (bar.current) bar.current.style.transform = `scaleX(${p})`
        // Which photo is closest to the centre of the screen?
        const mid = window.innerWidth / 2
        let best = 0, bestD = Infinity
        Array.from(t.children).forEach((c, i) => {
          const r = c.getBoundingClientRect()
          const d = Math.abs(r.left + r.width / 2 - mid)
          if (d < bestD) {
            bestD = d
            best = i
          }
        })
        setActive((a) => (a === best ? a : best))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [height])

  return (
    <>
      <section ref={section} className="gallery" style={height ? { height } : undefined}>
        <div className="gallery-sticky">
          <div ref={track} className="gallery-track">
            {images.map((img, i) => (
              <figure
                key={i}
                className="gallery-item"
                style={{ aspectRatio: `${img.width} / ${img.height}` }}
                data-cursor="Enlarge +"
                onClick={() => setOpen(i)}
              >
                <Photo image={img} sizes="(max-width: 768px) 100vw, 60vw" priority={i < 2} />
                {img.caption && <figcaption>{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
          <div className="gallery-progress" aria-hidden>
            <span>{pad(active + 1)}</span>
            <div className="gallery-progress-line">
              <div ref={bar} />
            </div>
            <span>{pad(images.length)}</span>
          </div>
        </div>
      </section>
      {open !== null && <Lightbox images={images} start={open} title={title} onClose={() => setOpen(null)} />}
    </>
  )
}

function Lightbox({ images, start, title, onClose }: { images: Img[]; start: number; title: string; onClose: () => void }) {
  const [i, setI] = useState(start)
  const n = images.length
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n])

  useEffect(() => {
    window.__lenis?.stop()
    document.documentElement.classList.add('no-scroll')
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', key)
    return () => {
      window.__lenis?.start()
      document.documentElement.classList.remove('no-scroll')
      window.removeEventListener('keydown', key)
    }
  }, [go, onClose])

  const counter = `${pad(i + 1)} / ${pad(n)}`
  // Rendered at the top of the site wrapper so no transformed ancestor can trap it.
  const host = document.querySelector('.site') ?? document.body
  return createPortal(
    <div className="lightbox" role="dialog" aria-modal aria-label={title}>
      <figure key={i} className="lightbox-figure">
        <Photo image={images[i]} sizes="100vw" priority />
      </figure>
      <button className="slideshow-hit left" aria-label="Previous" data-cursor={`← Prev  ${counter}`} onClick={() => go(-1)} />
      <button className="slideshow-hit right" aria-label="Next" data-cursor={`Next →  ${counter}`} onClick={() => go(1)} />
      <div className="lightbox-bar">
        <span>{title}</span>
        <span>{counter}</span>
        <button onClick={onClose} data-cursor="Close ×">Close</button>
      </div>
    </div>,
    host,
  )
}
