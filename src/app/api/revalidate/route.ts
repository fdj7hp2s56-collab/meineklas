import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

/**
 * Called by a Sanity webhook whenever you publish something,
 * so the live site updates within seconds instead of ~60s.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) return NextResponse.json({ message: 'Missing SANITY_REVALIDATE_SECRET' }, { status: 500 })
  const { isValidSignature } = await parseBody(req, secret)
  if (!isValidSignature) return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
  revalidatePath('/', 'layout')
  return NextResponse.json({ revalidated: true, now: Date.now() })
}
