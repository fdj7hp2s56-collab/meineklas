import { cache } from 'react'
import { sanityFetch } from '@/sanity/client'
import { legalQuery, projectQuery, projectsQuery, settingsQuery, slugsQuery } from '@/sanity/queries'
import type { PortableTextBlock } from 'next-sanity'
import { datenschutzTemplate, impressumTemplate } from './legalTemplates'
import { demoProjects, demoSettings, demoSummaries } from './demo'
import type { Project, ProjectSummary, Settings } from './types'

export const getSettings = cache(
  async (): Promise<Settings> => (await sanityFetch<Settings | null>(settingsQuery, {}, demoSettings)) ?? {},
)

export const getProjects = cache(
  async (): Promise<ProjectSummary[]> => (await sanityFetch<ProjectSummary[]>(projectsQuery, {}, demoSummaries)) ?? [],
)

export const getProject = cache(
  async (slug: string): Promise<Project | null> =>
    sanityFetch<Project | null>(projectQuery, { slug }, demoProjects.find((p) => p.slug === slug) ?? null),
)

export const getSlugs = async (): Promise<string[]> =>
  (await sanityFetch<string[]>(slugsQuery, {}, demoProjects.map((p) => p.slug))) ?? []

export type LegalType = 'impressum' | 'datenschutz'

/** Published legal text, or the template until you've published your own. */
export const getLegal = cache(async (type: LegalType): Promise<PortableTextBlock[]> => {
  const template = type === 'impressum' ? impressumTemplate : datenschutzTemplate
  const doc = await sanityFetch<{ body?: PortableTextBlock[] } | null>(legalQuery, { type }, null)
  return doc?.body?.length ? doc.body : template
})

export { formatDate } from './format'
