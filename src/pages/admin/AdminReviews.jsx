import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Star,
  EyeOff,
  Search,
  X,
  ShieldCheck,
  MessageSquare,
  RotateCcw,
  ExternalLink,
} from 'lucide-react'
import toast from 'react-hot-toast'
import StarRating from '../../components/ui/StarRating'
import productService from '../../services/productService'
import {
  getAllReviewsForAdmin,
  deleteReview,
  restoreReview,
  setReviewVerified,
} from '../../models/Review'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'visible', label: 'Visible' },
  { id: 'hidden', label: 'Hidden' },
]

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const refresh = () => setReviews(getAllReviewsForAdmin())

  useEffect(() => {
    refresh()
    productService
      .getAll()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const productName = useMemo(() => {
    const map = {}
    products.forEach((p) => {
      map[p.id] = p.name
    })
    return map
  }, [products])

  const stats = useMemo(() => {
    const visible = reviews.filter((r) => !r.hidden)
    const hidden = reviews.filter((r) => r.hidden)
    const rated = visible.reduce((sum, r) => sum + Number(r.rating || 0), 0)
    const average = visible.length ? Math.round((rated / visible.length) * 10) / 10 : 0
    return { total: reviews.length, visible: visible.length, hidden: hidden.length, average }
  }, [reviews])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return reviews.filter((r) => {
      if (filter === 'visible' && r.hidden) return false
      if (filter === 'hidden' && !r.hidden) return false
      if (!term) return true
      return [r.author, r.title, r.body, productName[r.product_id] || '']
        .join(' ')
        .toLowerCase()
        .includes(term)
    })
  }, [reviews, filter, search, productName])

  const handleToggleHidden = (review) => {
    if (review.hidden) {
      restoreReview(review.id)
      toast.success('Review restored to storefront')
    } else {
      deleteReview(review.id)
      toast.success('Review hidden from storefront')
    }
    refresh()
  }

  const handleToggleVerified = (review) => {
    setReviewVerified(review.id, !review.verified)
    toast.success(review.verified ? 'Verified badge removed' : 'Marked as verified purchase')
    refresh()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface rounded-2xl border border-canvas-border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-editorial text-2xl lg:text-3xl font-semibold text-ink">Reviews & Ratings</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-canvas-subtle border border-canvas-border text-xs font-mono font-medium text-ink-muted">
              {stats.total} total
            </span>
          </div>
          <p className="text-xs text-ink-subtle mt-1">
            Moderate customer feedback, verify purchases, and control what appears on the storefront.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <Star size={14} fill="currentColor" />
            <span className="font-semibold">{stats.average || '—'}</span>
            <span className="text-amber-700/70">avg</span>
          </div>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface rounded-2xl border border-canvas-border p-4 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">Visible</span>
          <p className="font-editorial text-2xl font-bold text-emerald-700 mt-1">{loading ? '-' : stats.visible}</p>
        </div>
        <div className="bg-surface rounded-2xl border border-canvas-border p-4 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">Hidden</span>
          <p className="font-editorial text-2xl font-bold text-ink mt-1">{loading ? '-' : stats.hidden}</p>
        </div>
        <div className="bg-surface rounded-2xl border border-canvas-border p-4 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">Average</span>
          <p className="font-editorial text-2xl font-bold text-amber-700 mt-1">{loading ? '-' : stats.average || '—'}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-surface p-4 rounded-2xl border border-canvas-border shadow-xs flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
          <input
            type="text"
            placeholder="Search by customer, product, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 py-2.5 text-xs w-full bg-canvas-subtle/50"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 bg-canvas-subtle/60 rounded-xl p-1 border border-canvas-border">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f.id ? 'bg-surface text-ink shadow-xs' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-surface rounded-2xl border border-canvas-border shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-canvas-subtle rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare size={24} className="mx-auto text-ink-subtle mb-2" />
            <p className="font-editorial text-lg text-ink font-semibold">No reviews found</p>
            <p className="text-xs text-ink-subtle mt-1">
              {search || filter !== 'all' ? 'Try adjusting your search or filter.' : 'Customer reviews will appear here.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-canvas-border">
            {filtered.map((review) => (
              <div
                key={review.id}
                className={`p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors ${
                  review.hidden ? 'bg-canvas-subtle/40 opacity-70' : 'hover:bg-canvas-subtle/30'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-sm text-ink">{review.author}</span>
                    <StarRating value={review.rating} size={13} />
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                        <ShieldCheck size={10} /> Verified
                      </span>
                    )}
                    {review.hidden && (
                      <span className="text-[10px] font-medium text-ink-muted bg-canvas-muted border border-zinc-200 px-1.5 py-0.5 rounded-md">
                        Hidden
                      </span>
                    )}
                  </div>

                  {review.title && (
                    <p className="font-editorial text-base font-semibold text-ink mt-1.5">{review.title}</p>
                  )}
                  {review.body && <p className="text-xs text-ink-muted mt-1 leading-relaxed">{review.body}</p>}

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-ink-subtle">
                    <span>
                      on{' '}
                      <Link
                        to={`/shop/${review.product_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-terracotta-700 hover:underline font-medium"
                      >
                        {productName[review.product_id] || review.product_id}
                      </Link>
                    </span>
                    <span>•</span>
                    <span className="font-mono">{review.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleToggleVerified(review)}
                    title={review.verified ? 'Remove verified badge' : 'Mark as verified purchase'}
                    className={`p-2 rounded-xl transition-colors ${
                      review.verified
                        ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                        : 'text-ink-subtle hover:text-ink hover:bg-canvas-subtle'
                    }`}
                  >
                    <ShieldCheck size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleHidden(review)}
                    title={review.hidden ? 'Restore review' : 'Hide review from storefront'}
                    className="p-2 rounded-xl text-ink-subtle hover:text-ink hover:bg-canvas-subtle transition-colors"
                  >
                    {review.hidden ? <RotateCcw size={15} /> : <EyeOff size={15} />}
                  </button>

                  <Link
                    to={`/shop/${review.product_id}`}
                    target="_blank"
                    rel="noreferrer"
                    title="View product on storefront"
                    className="p-2 rounded-xl text-ink-subtle hover:text-ink hover:bg-canvas-subtle transition-colors"
                  >
                    <ExternalLink size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
