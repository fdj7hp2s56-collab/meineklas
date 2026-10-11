import { Slideshow } from '@/components/Slideshow'
import { getSettings } from '@/lib/data'

export const revalidate = 60

export default async function Home() {
  const settings = await getSettings()
  return <Slideshow slides={settings.slides ?? []} />
}
