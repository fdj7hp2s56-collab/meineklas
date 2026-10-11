import { cache } from 'react'
import { sanityFetch } from '@/sanity/client'
import { projectQuery, projectsQuery, settingsQuery, slugsQuery } from '@/sanity/queries'
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

export { formatDate } from './format'
