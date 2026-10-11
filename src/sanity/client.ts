import { createClient, type QueryParams } from 'next-sanity'
import { apiVersion, dataset, isConfigured, projectId } from './env'

export const client = isConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: 'published' })
  : null

/**
 * Fetches content from Sanity. Pages are cached and refreshed every 60 seconds,
 * or instantly when the webhook in /api/revalidate is called. No redeploy needed.
 */
export async function sanityFetch<T>(query: string, params: QueryParams, fallback: T): Promise<T> {
  if (!client) return fallback
  return client.fetch<T>(query, params, { next: { revalidate: 60, tags: ['sanity'] } })
}
