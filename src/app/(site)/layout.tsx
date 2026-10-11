import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Cursor } from '@/components/Cursor'
import { Header } from '@/components/Header'
import { LegalLinks } from '@/components/LegalLinks'
import { SmoothScroll } from '@/components/SmoothScroll'
import { getProjects, getSettings } from '@/lib/data'
import { isConfigured } from '@/sanity/env'
import '../globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  const title = s.title || 'Portfolio'
  return {
    title: { default: title, template: `%s — ${title}` },
    description: s.description || undefined,
  }
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, projects] = await Promise.all([getSettings(), getProjects()])
  return (
    <div className="site">
      <SmoothScroll />
      <Cursor />
      <Header title={settings.title || 'Your Name'} count={projects.length} />
      <LegalLinks />
      {!isConfigured && (
        <div className="demo-banner">Demo content — connect Sanity to show your own photos (see README)</div>
      )}
      <main>{children}</main>
    </div>
  )
}
