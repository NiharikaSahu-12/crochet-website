// Seeded, local-first product reviews & ratings.
// Reviews are stored in localStorage so visitors can leave feedback without a backend.

const STORAGE_KEY = 'thecozzyloops_reviews_v1'
// Admin moderation overrides (hide / verified) keyed by review id.
// Kept separate so seeded defaults stay intact and moderation is non-destructive.
const MOD_KEY = 'thecozzyloops_review_mod_v1'

export const DEFAULT_REVIEWS = [
  { id: 'rev-1', product_id: 'prod-1', author: 'Aadya M.', rating: 5, title: 'Absolutely gorgeous', body: 'The colors are even softer in person. Arrived beautifully boxed with a wax seal and handwritten note.', date: '2026-08-14', verified: true },
  { id: 'rev-2', product_id: 'prod-1', author: 'Ritika S.', rating: 4, title: 'Lovely gift', body: 'Bought this for my roommate and she adored it. Stitching is tight and neat. Took a few days to arrive.', date: '2026-07-30', verified: true },
  { id: 'rev-3', product_id: 'prod-2', author: 'Sneha R.', rating: 5, title: 'Perfect desk bloom', body: 'The potted sunflower brightens up my work desk. Sturdy pot and vibrant yarn that hasn’t faded.', date: '2026-08-22', verified: true },
  { id: 'rev-4', product_id: 'prod-2', author: 'Kavya T.', rating: 5, title: 'Even better in real life', body: 'TheCozzyLoops matched my color preferences exactly. The detail on the petals is incredible.', date: '2026-08-02', verified: true },
  { id: 'rev-5', product_id: 'prod-3', author: 'Meera J.', rating: 4, title: 'Book lover approved', body: 'The stem is thin enough not to damage pages. Wish it came in more colors!', date: '2026-07-18', verified: true },
  { id: 'rev-6', product_id: 'prod-4', author: 'Ananya P.', rating: 5, title: 'So cute', body: 'Tiny, well-made, and the clip is strong. Gets compliments everywhere I go.', date: '2026-08-09', verified: true },
  { id: 'rev-7', product_id: 'prod-5', author: 'Ishita K.', rating: 5, title: 'Heirloom quality', body: 'This bouquet looks like it will last forever. Packaging was worth it alone.', date: '2026-08-27', verified: true },
  { id: 'rev-8', product_id: 'prod-6', author: 'Diya N.', rating: 4, title: 'Sweet scrunchie', body: 'Soft on the hair and the flower detail is adorable. Holds well through the day.', date: '2026-07-25', verified: false },
  { id: 'rev-9', product_id: 'prod-7', author: 'Riya B.', rating: 5, title: 'Gift box was perfect', body: 'Ordered for a birthday and it arrived gift-ready. The recipient loved it.', date: '2026-08-19', verified: true },
]

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeLocal(reviews) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
  } catch {
    /* storage unavailable */
  }
}

function readMod() {
  try {
    const raw = localStorage.getItem(MOD_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeMod(mod) {
  try {
    localStorage.setItem(MOD_KEY, JSON.stringify(mod))
  } catch {
    /* storage unavailable */
  }
}

export function getAllReviews() {
  const mod = readMod()
  return [...DEFAULT_REVIEWS, ...readLocal()]
    .filter((r) => !mod[r.id]?.hidden)
    .map((r) => (mod[r.id] ? { ...r, verified: mod[r.id].verified ?? r.verified } : r))
}

/** Raw list including hidden reviews — for the admin moderation console. */
export function getAllReviewsForAdmin() {
  const mod = readMod()
  return [...DEFAULT_REVIEWS, ...readLocal()]
    .map((r) => ({
      ...r,
      verified: mod[r.id]?.verified ?? r.verified,
      hidden: Boolean(mod[r.id]?.hidden),
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function deleteReview(id) {
  const mod = readMod()
  mod[id] = { ...(mod[id] || {}), hidden: true }
  writeMod(mod)
}

export function restoreReview(id) {
  const mod = readMod()
  if (mod[id]) {
    delete mod[id].hidden
    if (Object.keys(mod[id]).length === 0) delete mod[id]
  }
  writeMod(mod)
}

export function setReviewVerified(id, verified) {
  const mod = readMod()
  mod[id] = { ...(mod[id] || {}), verified }
  writeMod(mod)
}

export function getReviewsForProduct(productId) {
  return getAllReviews()
    .filter((r) => r.product_id === productId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getRatingSummary(productId) {
  const reviews = getReviewsForProduct(productId)
  if (reviews.length === 0) return { average: 0, count: 0 }
  const total = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0)
  return { average: Math.round((total / reviews.length) * 10) / 10, count: reviews.length }
}

/** Map of productId -> { average, count } for cheap card rendering. */
export function getRatingMap() {
  const all = getAllReviews()
  const map = {}
  for (const r of all) {
    if (!map[r.product_id]) map[r.product_id] = { total: 0, count: 0 }
    map[r.product_id].total += Number(r.rating || 0)
    map[r.product_id].count += 1
  }
  for (const key of Object.keys(map)) {
    const { total, count } = map[key]
    map[key] = { average: Math.round((total / count) * 10) / 10, count }
  }
  return map
}

export function addReview({ productId, author, rating, title, body }) {
  const review = {
    id: `rev-local-${Date.now()}`,
    product_id: productId,
    author: author || 'Anonymous',
    rating: Number(rating) || 5,
    title: title || '',
    body: body || '',
    date: new Date().toISOString().slice(0, 10),
    verified: false,
  }
  writeLocal([...readLocal(), review])
  return review
}
