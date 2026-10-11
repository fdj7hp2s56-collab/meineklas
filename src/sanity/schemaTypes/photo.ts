import { defineField, defineType } from 'sanity'

/** An image with alt text and an optional caption. */
export const photo = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'image',
  options: { hotspot: true, metadata: ['lqip', 'palette'] },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Short description for screen readers and search engines.',
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
  ],
})
