'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Img } from '@/lib/types'

const WIDTHS = [480, 800, 1200, 1600, 2200, 3000]

/** Builds responsive URLs for Sanity's image CDN (resizes + converts to WebP/AVIF). */
export function srcFor(img: Img, w: number) {
  if (!img.url.includes('cdn.sanity.io')) return img.url
  return `${img.url}?w=${w}&auto=format&q=82&fit=max`
}

function srcSet(img: Img) {
  if (!img.url.includes('cdn.sanity.io')) return undefined
  const ws = WIDTHS.filter((w) => w < img.width).concat(Math.min(img.width, 3000))
  return ws.map((w) => `${srcFor(img, w)} ${w}w`).join(', ')
}

type Props = {
  image: Img
  sizes?: string
  className?: string
  style?: CSSProperties
  priority?: boolean
  draggable?: boolean
}

/** Image with a blurred placeholder that sharpens once loaded. */
export function Photo({ image, sizes = '100vw', className, style, priority, draggable = false }: Props) {
  const ref = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth) setLoaded(true)
  }, [image.url])

  return (
    <img
      ref={ref}
      src={srcFor(image, 1600)}
      srcSet={srcSet(image)}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt || ''}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      draggable={draggable}
      onLoad={() => setLoaded(true)}
      className={`photo ${loaded ? 'is-loaded' : ''} ${className ?? ''}`}
      style={{
        ...style,
        backgroundImage: image.lqip && !loaded ? `url(${image.lqip})` : undefined,
      }}
    />
  )
}
