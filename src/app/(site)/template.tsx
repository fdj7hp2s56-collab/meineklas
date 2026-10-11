import type { ReactNode } from 'react'

/** Re-mounts on every navigation, giving each page a soft entrance. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>
}
