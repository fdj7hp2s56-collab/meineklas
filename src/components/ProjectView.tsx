import Link from 'next/link'
import { formatDate } from '@/lib/format'
import type { Project } from '@/lib/types'
import { Gallery } from './Gallery'
import { Reveal } from './Reveal'

export function ProjectView({ project }: { project: Project }) {
  const images = project.images ?? []

  return (
    <article className="project">
      <header className="project-head">
        <h1 className="project-title">{project.title}</h1>
        <dl className="project-meta">
          {project.client && (<><dt>Client</dt><dd>{project.client}</dd></>)}
          {project.category && (<><dt>Category</dt><dd>{project.category}</dd></>)}
          {project.date && (<><dt>Date</dt><dd>{formatDate(project.date)}</dd></>)}
          <dt>Images</dt><dd>({images.length})</dd>
        </dl>
      </header>

      {images.length > 0 && <Gallery images={images} title={project.title} />}

      <footer className="project-foot">
        <Reveal className="project-text">
          {project.description && <p>{project.description}</p>}
          {!!project.credits?.length && (
            <dl className="project-credits">
              {project.credits.map((c, i) => (
                <div key={i}>
                  <dt>{c.role}</dt>
                  <dd>{c.name}</dd>
                </div>
              ))}
            </dl>
          )}
        </Reveal>
        {project.next && project.next.slug !== project.slug && (
          <Link href={`/work/${project.next.slug}`} className="project-next" data-cursor="Next project →">
            <span className="label">Next project</span>
            <span className="big">{project.next.title}</span>
          </Link>
        )}
      </footer>
    </article>
  )
}
