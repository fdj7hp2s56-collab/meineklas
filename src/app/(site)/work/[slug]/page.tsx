import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectView } from '@/components/ProjectView'
import { getProject, getSlugs } from '@/lib/data'

export const revalidate = 60
// New projects added in the CMS get their page generated on first visit.
export const dynamicParams = true

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getSlugs()).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProject((await params).slug)
  return p ? { title: p.title, description: p.description || undefined } : {}
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProject((await params).slug)
  if (!project) notFound()
  return <ProjectView project={project} />
}
