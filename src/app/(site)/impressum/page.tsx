import { LegalView } from '@/components/LegalView'
import { getLegal } from '@/lib/data'

export const revalidate = 60
export const metadata = { title: 'Impressum' }

export default async function ImpressumPage() {
  return <LegalView title="Impressum" body={await getLegal('impressum')} />
}
