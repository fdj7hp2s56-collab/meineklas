import Link from 'next/link'

/** Impressum + Datenschutz, reachable from every page (top right, away from the macOS Dock). */
export function LegalLinks() {
  return (
    <nav className="legal-links" aria-label="Rechtliches">
      <Link href="/impressum">Impressum</Link>
      <Link href="/datenschutz">Datenschutz</Link>
    </nav>
  )
}
