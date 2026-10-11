import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings & homepage')
        .id('settings')
        .child(S.document().schemaType('settings').documentId('settings')),
      S.divider(),
      S.documentTypeListItem('project').title('Projects'),
    ])
