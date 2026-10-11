import { datenschutz, impressum } from './legal'
import { photo } from './photo'
import { project } from './project'
import { settings } from './settings'

export const schemaTypes = [photo, project, settings, impressum, datenschutz]

/** Document types that exist exactly once (opened directly, never "created"). */
export const singletonTypes = ['settings', 'impressum', 'datenschutz']
