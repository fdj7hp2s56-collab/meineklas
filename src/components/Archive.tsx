'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { formatDate } from '@/lib/format'
import type { ProjectSummary } from '@/lib/types'
import { Photo } from './Photo'
import { Reveal } from './Reveal'

type View = 'grid' | 'index'
const KEY = 'archive-view'

/**
 * Archive with two views:
 * - Grid: cover images that lean with scroll speed.
 * - Index: a text list; hovering a row shows a floating preview that trails the cursor.
 */
export function Archive({ projects }: { projects: ProjectSummary[] }) {
  const [view, setView] = useState<View>('grid')
  const [filter, setFilter] = useState<string>('All')

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY)
      if (v === 'grid' || v === 'index') setView(v)
    } catch {}
  }, [])
  const choose = (v: View) => {
    setView(v)
    try {
      localStorage.setItem(KEY, v)
    } catch {}
  }

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean) as string[]))]
  const list = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <section className="archive">
      <div className="archive-toolbar">
        <div className="archive-filters">
          {categories.map((c) => (
            <button key={c} className={c === filter ? 'is-active' : ''} onClick={() => setFilter(c)}>
              {c}
              {c !== 'All' && <sup>{projects.filter((p) => p.category === c).length}</sup>}
            </button>
          ))}
        </div>
        <div className="archive-views">
          <button className={view === 'grid' ? 'is-active' : ''} onClick={() => choose('grid')}>Grid</button>
          <button className={view === 'index' ? 'is-active' : ''} onClick={() => choose('index')}>Index</button>
        </div>
      </div>
      {view === 'grid' ? <Grid projects={list} /> : <IndexList projects={list} />}
    </section>
  )
}

function Grid({ projects }: { projects: ProjectSummary[] }) {
  return (
    <div className="grid velocity">
      {projects.map((p, i) => (
        <Reveal key={p.slug} delay={(i % 3) * 80}>
          <Link href={`/work/${p.slug}`} className="card" data-cursor={`View (${p.count ?? 0})`}>
            <div className="card-media">{p.cover && <Photo image={p.cover} sizes="(max-width: 768px) 50vw, 33vw" />}</div>
            <div className="card-meta">
              <span className="card-title">
                {p.client && p.client !== p.title ? `${p.client} – ` : ''}
                {p.title}
              </span>
              <span className="card-count">({p.count ?? 0})</span>
              <span className="card-date">{formatDate(p.date)}</span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  )
}

function IndexList({ projects }: { projects: ProjectSummary[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const preview = useRef<HTMLDivElement>(null)

  // Floating preview that follows the pointer with lag and tilts with its speed
  useEffect(() => {
    let x = 0, y = 0, px = 0, py = 0, r = 0, raf = 0
    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
    }
    const loop = () => {
      const vx = x - px
      px += vx * 0.12
      py += (y - py) * 0.12
      r += (Math.max(-10, Math.min(10, vx * 0.15)) - r) * 0.1
      if (preview.current) preview.current.style.transform = `translate3d(${px}px, ${py}px, 0) rotate(${r}deg)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
    }
  }, [])

  return (
    <>
      <ol className="index-list" onPointerLeave={() => setHover(null)}>
        <li className="index-row index-head" aria-hidden>
          <span>No.</span>
          <span>Project</span>
          <span className="hide-sm">Client</span>
          <span className="hide-sm">Category</span>
          <span>Date</span>
        </li>
        {projects.map((p, i) => (
          <li key={p.slug}>
            <Link
              href={`/work/${p.slug}`}
              className="index-row"
              data-cursor={`Open (${p.count ?? 0})`}
              onPointerEnter={() => setHover(i)}
            >
              <span>{String(i + 1).padStart(3, '0')}</span>
              <span>{p.title}</span>
              <span className="hide-sm">{p.client}</span>
              <span className="hide-sm">{p.category}</span>
              <span>{formatDate(p.date)}</span>
            </Link>
          </li>
        ))}
      </ol>
      <div ref={preview} className={`index-preview ${hover !== null ? 'is-visible' : ''}`} aria-hidden>
        {projects.map((p, i) =>
          p.cover ? (
            <div key={p.slug} className={`index-preview-item ${i === hover ? 'is-active' : ''}`}>
              <Photo image={p.cover} sizes="360px" />
            </div>
          ) : null,
        )}
      </div>
    </>
  )
}
