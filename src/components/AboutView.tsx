import { PortableText } from 'next-sanity'
import type { Settings } from '@/lib/types'
import { Photo } from './Photo'
import { Reveal } from './Reveal'

export function AboutView({ settings: s }: { settings: Settings }) {
  return (
    <section className="about">
      <div className="about-text">
        <Reveal className="about-body">{s.about && <PortableText value={s.about} />}</Reveal>
        <Reveal className="about-lists" delay={120}>
          {s.clients && s.clients.length > 0 && (
            <div>
              <h2>Selected clients</h2>
              <ul>
                {s.clients.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h2>Contact</h2>
            <ul>
              {s.email && (
                <li>
                  <a href={`mailto:${s.email}`} data-cursor="Write ✉">{s.email}</a>
                </li>
              )}
              {s.instagram && (
                <li>
                  <a href={`https://instagram.com/${s.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" data-cursor="Instagram ↗">
                    Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
        </Reveal>
      </div>
      {s.aboutImage && (
        <Reveal className="about-image">
          <Photo image={s.aboutImage} sizes="(max-width: 768px) 100vw, 40vw" priority />
        </Reveal>
      )}
    </section>
  )
}
