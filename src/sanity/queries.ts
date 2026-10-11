import { groq } from 'next-sanity'

const img = `{
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
  alt,
  caption
}`

export const settingsQuery = groq`*[_type == "settings"][0]{
  title,
  description,
  email,
  instagram,
  about,
  clients,
  "aboutImage": aboutImage${img},
  "slides": homeSlides[]{
    "image": image${img},
    "project": project->{ title, "slug": slug.current }
  }[defined(image.url)]
}`

export const projectsQuery = groq`*[_type == "project" && defined(slug.current)] | order(date desc){
  title,
  "slug": slug.current,
  client,
  category,
  date,
  "count": count(images),
  "cover": select(defined(cover.asset) => cover${img}, images[0]${img})
}`

export const projectQuery = groq`*[_type == "project" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  client,
  category,
  date,
  description,
  credits,
  "images": images[]${img}[defined(url)],
  "next": coalesce(
    *[_type == "project" && defined(slug.current) && date < ^.date] | order(date desc)[0],
    *[_type == "project" && defined(slug.current)] | order(date desc)[0]
  ){ title, "slug": slug.current }
}`

export const slugsQuery = groq`*[_type == "project" && defined(slug.current)].slug.current`
