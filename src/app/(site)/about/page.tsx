import { AboutView } from '@/components/AboutView'
import { getSettings } from '@/lib/data'

export const revalidate = 60
export const metadata = { title: 'About' }

export default async function AboutPage() {
  return <AboutView settings={await getSettings()} />
}
