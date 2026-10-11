import { defineArrayMember, defineField, defineType } from 'sanity'
import { datenschutzTemplate, impressumTemplate } from '../../lib/legalTemplates'

const body = (template: unknown[]) =>
  defineField({
    name: 'body',
    title: 'Text',
    type: 'array',
    description: 'Replace everything in [square brackets], then click Publish.',
    initialValue: template,
    of: [
      defineArrayMember({
        type: 'block',
        styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'Heading', value: 'h2' },
        ],
        lists: [{ title: 'Bullet', value: 'bullet' }],
        marks: {
          decorators: [{ title: 'Bold', value: 'strong' }],
          annotations: [
            {
              name: 'link',
              type: 'object',
              title: 'Link',
              fields: [{ name: 'href', type: 'url', title: 'URL', validation: (r) => r.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }) }],
            },
          ],
        },
      }),
    ],
  })

export const impressum = defineType({
  name: 'impressum',
  title: 'Impressum',
  type: 'document',
  fields: [body(impressumTemplate)],
  preview: { prepare: () => ({ title: 'Impressum' }) },
})

export const datenschutz = defineType({
  name: 'datenschutz',
  title: 'Datenschutzerklärung',
  type: 'document',
  fields: [body(datenschutzTemplate)],
  preview: { prepare: () => ({ title: 'Datenschutzerklärung' }) },
})
