import type { PortableTextBlock } from 'next-sanity'

export type Img = {
  url: string
  width: number
  height: number
  lqip?: string | null
  alt?: string | null
  caption?: string | null
}

export type ProjectLink = { title: string; slug: string }

export type Slide = { image: Img; project?: ProjectLink | null }

export type Settings = {
  title?: string | null
  description?: string | null
  email?: string | null
  instagram?: string | null
  about?: PortableTextBlock[] | null
  clients?: string[] | null
  aboutImage?: Img | null
  slides?: Slide[] | null
}

export type ProjectSummary = {
  title: string
  slug: string
  client?: string | null
  category?: string | null
  date?: string | null
  count?: number | null
  cover?: Img | null
}

export type Project = ProjectSummary & {
  description?: string | null
  credits?: { role?: string; name?: string }[] | null
  images?: Img[] | null
  next?: ProjectLink | null
}
