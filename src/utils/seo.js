// Central SEO constants + JSON-LD builders.
//
// When the site moves to a custom domain, set VITE_SITE_URL in the hosting
// environment (e.g. VITE_SITE_URL=https://thecozzyloops.com) so canonical,
// Open Graph and structured-data URLs point at the production domain.
// Until then everything resolves against the current origin at runtime.

import { INSTAGRAM_HANDLE, EMAIL } from './instagram'

export const SITE_NAME = 'TheCozzyLoops'

export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '')
).replace(/\/+$/, '')

export const DEFAULT_TITLE = 'TheCozzyLoops – Cute Handmade Crochet Flowers & Gifts'

export const DEFAULT_DESCRIPTION =
  'Handmade crochet flowers, everlasting bouquets, bookmarks & keychains — custom gifts crocheted with soft milk cotton yarn in Mumbai, shipped across India.'

export const DEFAULT_IMAGE = '/images/crochet-main.jpg'

export const absoluteUrl = (path = '/') => {
  if (/^https?:\/\//i.test(path)) return path
  const clean = path.startsWith('/') ? path : `/${path}`
  return clean === '/' ? `${SITE_URL}/` : `${SITE_URL}${clean}`
}

export const truncate = (text = '', max = 158) => {
  const clean = String(text).replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 3).trimEnd()}...`
}

export const buildOrganizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: absoluteUrl('/'),
  logo: absoluteUrl('/logo.jpeg'),
  image: absoluteUrl(DEFAULT_IMAGE),
  email: EMAIL,
  sameAs: [`https://instagram.com/${INSTAGRAM_HANDLE}`],
})

export const buildWebsiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: absoluteUrl('/'),
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${absoluteUrl('/shop')}?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
})

export const buildProductJsonLd = (product, path) => {
  if (!product) return null
  const url = absoluteUrl(path || `/shop/${product.id}`)
  const images = (product.images?.length ? product.images : [DEFAULT_IMAGE]).map(absoluteUrl)
  const inStock = Number(product.stock_qty ?? 1) > 0

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: truncate(product.description || '', 300),
    image: images,
    sku: String(product.id),
    category: product.category ? product.category.replace(/_/g, ' ') : undefined,
    brand: { '@type': 'Brand', name: SITE_NAME },
    url,
    offers: {
      '@type': 'Offer',
      price: Number(product.price || 0),
      priceCurrency: 'INR',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      url,
    },
  }
}

export const buildBreadcrumbJsonLd = (items = []) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
})
