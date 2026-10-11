import { Archive } from '@/components/Archive'
import { getProjects } from '@/lib/data'

export const revalidate = 60
export const metadata = { title: 'Archive' }

export default async function WorkPage() {
  const projects = await getProjects()
  return <Archive projects={projects} />
}
