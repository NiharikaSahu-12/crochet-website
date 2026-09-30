import { useEffect } from 'react'
import { SITE_NAME, DEFAULT_IMAGE, absoluteUrl, truncate } from '../utils/seo'

const JSONLD_ID = 'seo-page-jsonld'

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Per-page SEO: title, meta description, canonical, robots, Open Graph,
 * Twitter card and optional JSON-LD structured data.
 *
 * - `path` defaults to the current location; pass the route path when the
 *   URL contains filters (e.g. /shop?category=...) so the canonical stays clean.
 * - `jsonLd` accepts an object or an array of objects; it is replaced on
 *   every change and removed when the page unmounts.
 * - Pass `noindex: true` for admin pages so they never get indexed.
 */
export default function useSEO({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd = null,
}) {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    const prevTitle = document.title

    const pagePath =
      path || (typeof window !== 'undefined' ? window.location.pathname : '/')
    const url = absoluteUrl(pagePath)
    const fullTitle = title
      ? title.includes(SITE_NAME)
        ? title
        : `${title} | ${SITE_NAME}`
      : prevTitle
    const desc = description ? truncate(description, 158) : ''
    const img = absoluteUrl(image || DEFAULT_IMAGE)

    document.title = fullTitle

    if (desc) upsertMeta('name', 'description', desc)
    upsertMeta(
      'name',
      'robots',
      noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
    )
    upsertCanonical(url)

    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:title', fullTitle)
    if (desc) upsertMeta('property', 'og:description', desc)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', img)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    if (desc) upsertMeta('name', 'twitter:description', desc)
    upsertMeta('name', 'twitter:image', img)

    // Structured data — one page-level script, swapped on navigation.
    const existing = document.getElementById(JSONLD_ID)
    if (existing) existing.remove()
    if (jsonLdKey) {
      const script = document.createElement('script')
      script.id = JSONLD_ID
      script.type = 'application/ld+json'
      script.text = jsonLdKey
      document.head.appendChild(script)
    }

    return () => {
      document.title = prevTitle
      const ld = document.getElementById(JSONLD_ID)
      if (ld) ld.remove()
    }
  }, [title, description, path, image, type, noindex, jsonLdKey])
}
