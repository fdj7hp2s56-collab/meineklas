import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Images are served straight from Sanity's CDN (which resizes on the fly),
  // so no next/image remote patterns are needed.
}

export default nextConfig
