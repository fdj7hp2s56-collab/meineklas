import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'
import { isConfigured } from '@/sanity/env'

export const dynamic = 'force-static'
export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  if (!isConfigured) {
    return (
      <p style={{ fontFamily: 'system-ui', padding: 40 }}>
        Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local (or in your hosting settings) to open the CMS. See README.md.
      </p>
    )
  }
  return <NextStudio config={config} />
}
