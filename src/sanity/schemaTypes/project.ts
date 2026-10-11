import { defineArrayMember, defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'The web address of the project. Click "Generate".',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'client', type: 'string' }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: ['Commission', 'Editorial', 'Campaign', 'Personal'],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'date',
      type: 'date',
      description: 'Projects are sorted by this date (newest first).',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cover',
      title: 'Cover image',
      type: 'photo',
      description: 'Optional. If empty, the first gallery image is used.',
    }),
    defineField({
      name: 'images',
      title: 'Gallery',
      type: 'array',
      description: 'Drag & drop many images at once. Drag to reorder.',
      of: [defineArrayMember({ type: 'photo' })],
      options: { layout: 'grid' },
    }),
    defineField({ name: 'description', type: 'text', rows: 4 }),
    defineField({
      name: 'credits',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'credit',
          fields: [
            defineField({ name: 'role', type: 'string' }),
            defineField({ name: 'name', type: 'string' }),
          ],
          preview: { select: { title: 'name', subtitle: 'role' } },
        }),
      ],
    }),
  ],
  orderings: [{ title: 'Date, newest', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', client: 'client', date: 'date', cover: 'cover', first: 'images.0' },
    prepare: ({ title, client, date, cover, first }) => ({
      title,
      subtitle: [client, date?.slice(0, 4)].filter(Boolean).join(' · '),
      media: cover?.asset ? cover : first,
    }),
  },
})
