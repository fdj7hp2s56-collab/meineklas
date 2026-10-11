import { LegalView } from '@/components/LegalView'
import { getLegal } from '@/lib/data'

export const revalidate = 60
export const metadata = { title: 'Datenschutz' }

export default async function DatenschutzPage() {
  return <LegalView title="Datenschutzerklärung" body={await getLegal('datenschutz')} />
}
