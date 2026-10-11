import { PortableText, type PortableTextBlock, type PortableTextComponents } from 'next-sanity'

const components: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? '#'
      const external = href.startsWith('http')
      return (
        <a href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
          {children}
        </a>
      )
    },
  },
}

export function LegalView({ title, body }: { title: string; body: PortableTextBlock[] }) {
  return (
    <article className="legal">
      <h1 className="legal-title">{title}</h1>
      <div className="legal-body">
        <PortableText value={body} components={components} />
      </div>
    </article>
  )
}
