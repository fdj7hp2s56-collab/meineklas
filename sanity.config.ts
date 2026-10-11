'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schemaTypes, singletonTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  title: 'Portfolio CMS',
  projectId: projectId || 'missing',
  dataset,
  schema: {
    types: schemaTypes,
    // Settings, Impressum and Datenschutz exist once each: hide them from the "Create new" menu.
    templates: (templates) => templates.filter((t) => !singletonTypes.includes(t.schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletonTypes.includes(schemaType)
        ? actions.filter((a) => a.action && ['publish', 'discardChanges', 'restore'].includes(a.action))
        : actions,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
})
