'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schemaTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  title: 'Portfolio CMS',
  projectId: projectId || 'missing',
  dataset,
  schema: {
    types: schemaTypes,
    // "Site settings" is a single document: hide it from the "Create new" menu.
    templates: (templates) => templates.filter((t) => t.schemaType !== 'settings'),
  },
  document: {
    actions: (actions, { schemaType }) =>
      schemaType === 'settings'
        ? actions.filter((a) => a.action && ['publish', 'discardChanges', 'restore'].includes(a.action))
        : actions,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
})
