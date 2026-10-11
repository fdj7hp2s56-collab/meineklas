import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="empty">
      <p>Nothing here.</p>
      <Link href="/work">Back to the archive →</Link>
    </section>
  )
}
