// Placeholder content shown until a Sanity project is connected.
import type { Img, Project, ProjectSummary, Settings } from './types'

const pic = (seed: string, w: number, h: number): Img => ({
  url: `https://picsum.photos/seed/${seed}/${w}/${h}`,
  width: w,
  height: h,
  alt: 'Demo photo',
})

const P = [1600, 2000] as const // portrait
const L = [2000, 1333] as const // landscape

const raw: [string, string, string, string, string, number][] = [
  ['Salt & Stone', 'Zeitmagazin', 'Editorial', '2026-04-12', 'salt', 9],
  ['Low Tide', 'Arket', 'Campaign', '2026-02-03', 'tide', 7],
  ['Evening Hours', 'Personal', 'Personal', '2025-11-20', 'evening', 11],
  ['Concrete Gardens', 'Monocle', 'Editorial', '2025-08-14', 'garden', 6],
  ['The Quiet Room', 'Aesop', 'Campaign', '2025-05-02', 'quiet', 8],
  ['North Light', 'Personal', 'Personal', '2024-12-09', 'north', 10],
  ['Changemakers', 'Armedangels', 'Campaign', '2024-08-21', 'change', 5],
  ['A Manual for Conversation', 'Ongoing', 'Personal', '2024-03-15', 'manual', 12],
]

const gallery = (seed: string, n: number) =>
  Array.from({ length: n }, (_, i) => {
    const [w, h] = (i + seed.length) % 3 === 0 ? L : P
    return pic(`${seed}-${i}`, w, h)
  })

export const demoProjects: Project[] = raw.map(([title, client, category, date, seed, n], i) => ({
  title,
  slug: seed,
  client,
  category,
  date,
  count: n,
  cover: pic(`${seed}-cover`, L[0], L[1]),
  description:
    'Placeholder text. Connect Sanity and write a few lines about the project, the people involved and how it came about.',
  credits: [
    { role: 'Photography', name: 'Your Name' },
    { role: 'Styling', name: 'Someone Great' },
  ],
  images: gallery(seed, n),
  next: { title: raw[(i + 1) % raw.length][0], slug: raw[(i + 1) % raw.length][4] },
}))

export const demoSummaries: ProjectSummary[] = demoProjects.map(
  ({ title, slug, client, category, date, count, cover }) => ({ title, slug, client, category, date, count, cover }),
)

export const demoSettings: Settings = {
  title: 'Your Name',
  description: 'Photographer based in Berlin, working on editorial, commissioned and personal projects.',
  email: 'hello@example.com',
  instagram: 'yourname',
  clients: ['Zeitmagazin', 'Arket', 'Aesop', 'Monocle', 'Armedangels', 'Kinfolk', 'Cos'],
  aboutImage: pic('portrait', 1600, 2000),
  about: [
    {
      _type: 'block',
      _key: 'a',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: 'a1',
          marks: [],
          text: 'This is demo text. Once Sanity is connected, edit it in the Studio under “Site settings → About”. Write about how you work, where you are based and what you are looking for.',
        },
      ],
    },
  ],
  slides: demoProjects.slice(0, 7).map((p, i) => ({
    image: p.images![i % 2 === 0 ? 0 : 1],
    project: { title: p.title, slug: p.slug },
  })),
}
