import { defineArrayMember, defineField, defineType } from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'home', title: 'Homepage', default: true },
    { name: 'about', title: 'About' },
    { name: 'site', title: 'Site' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Your name / site title', type: 'string', group: 'site' }),
    defineField({ name: 'description', title: 'SEO description', type: 'text', rows: 2, group: 'site' }),
    defineField({
      name: 'homeSlides',
      title: 'Homepage slideshow',
      type: 'array',
      group: 'home',
      description: 'The full-screen images on the homepage, in order.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'slide',
          fields: [
            defineField({ name: 'image', type: 'photo', validation: (r) => r.required() }),
            defineField({
              name: 'project',
              title: 'Link to project (optional)',
              type: 'reference',
              to: [{ type: 'project' }],
            }),
          ],
          preview: {
            select: { media: 'image', title: 'project.title', caption: 'image.caption' },
            prepare: ({ media, title, caption }) => ({ media, title: title || caption || 'Slide' }),
          },
        }),
      ],
    }),
    defineField({
      name: 'about',
      title: 'About text',
      type: 'array',
      group: 'about',
      of: [defineArrayMember({ type: 'block', styles: [{ title: 'Normal', value: 'normal' }], lists: [] })],
    }),
    defineField({ name: 'aboutImage', title: 'Portrait', type: 'photo', group: 'about' }),
    defineField({
      name: 'clients',
      title: 'Selected clients',
      type: 'array',
      group: 'about',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({ name: 'email', type: 'string', group: 'about' }),
    defineField({ name: 'instagram', title: 'Instagram handle', type: 'string', group: 'about' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})
