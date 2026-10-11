/** "2026-04-12" → "2026.04" */
export const formatDate = (d?: string | null) => (d ? d.slice(0, 7).replace('-', '.') : '')
