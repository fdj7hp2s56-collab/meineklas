import type { StructureResolver } from 'sanity/structure'

const single = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type).title(title))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      single(S, 'settings', 'Site settings & homepage'),
      S.divider(),
      S.documentTypeListItem('project').title('Projects'),
      S.divider(),
      single(S, 'impressum', 'Impressum'),
      single(S, 'datenschutz', 'Datenschutzerklärung'),
    ])
