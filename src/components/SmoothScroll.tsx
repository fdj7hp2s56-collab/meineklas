'use client'

import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

/**
 * Inertia scrolling (Lenis). Also publishes the scroll velocity as the CSS
 * variable --skew so elements with the class `.velocity` lean as you scroll.
 */
export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: !reduce })
    window.__lenis = lenis
    const root = document.documentElement
    let skew = 0
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      const target = reduce ? 0 : Math.max(-4, Math.min(4, lenis.velocity * 0.12))
      skew += (target - skew) * 0.12
      root.style.setProperty('--skew', `${skew.toFixed(3)}deg`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      delete window.__lenis
    }
  }, [])

  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true, force: true })
  }, [pathname])

  return null
}
