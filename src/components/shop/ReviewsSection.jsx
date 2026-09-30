import { useState, useEffect, useCallback } from 'react'
import { Star, CheckCircle2, PenLine } from 'lucide-react'
import toast from 'react-hot-toast'
import StarRating from '../ui/StarRating'
import { getReviewsForProduct, getRatingSummary, addReview } from '../../models/Review'

const BARS = [5, 4, 3, 2, 1]

export default function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState({ average: 0, count: 0 })
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ author: '', rating: 5, title: '', body: '' })

  const refresh = useCallback(() => {
    setReviews(getReviewsForProduct(productId))
    setSummary(getRatingSummary(productId))
  }, [productId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const distribution = BARS.map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.author.trim()) {
      toast.error('Please add your name')
      return
    }
    addReview({ productId, ...form })
    toast.success('Thanks for your review!')
    setForm({ author: '', rating: 5, title: '', body: '' })
    setShowForm(false)
    refresh()
  }

  return (
    <section className="mt-12 pt-8 border-t border-canvas-border">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-editorial text-terracotta-700">
            Verified Notes
          </span>
          <h2 className="mt-1 font-editorial text-2xl sm:text-3xl font-bold text-ink">
            Reviews &amp; Ratings
          </h2>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="btn-outline text-xs px-5 py-2.5 self-start sm:self-auto"
        >
          <PenLine size={14} />
          <span>{showForm ? 'Close' : 'Write a Review'}</span>
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-surface rounded-3xl border border-canvas-border shadow-xs p-5 sm:p-7 space-y-5 animate-fade-up"
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-2.5">
              Your Rating
            </label>
            <StarRating
              value={form.rating}
              size={16}
              onChange={(rating) => setForm((f) => ({ ...f, rating }))}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-2">
                Name
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                className="input-field"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-2">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="input-field"
                placeholder="Sum it up"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-2">
              Your Review
            </label>
            <textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              rows={4}
              className="input-field resize-none"
              placeholder="What did you love about this piece?"
            />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary text-xs px-6 py-3">
              Submit Review
            </button>
          </div>
        </form>
      )}

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="bg-surface rounded-3xl border border-canvas-border shadow-xs p-6 sticky top-24">
            <div className="flex items-end gap-3">
              <span className="font-editorial text-5xl font-bold text-ink leading-none">
                {summary.count > 0 ? summary.average.toFixed(1) : '—'}
              </span>
              <div className="pb-1">
                <StarRating value={summary.average} size={16} />
                <p className="text-xs text-ink-subtle mt-1">
                  {summary.count} {summary.count === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {distribution.map(({ star, count }) => {
                const pct = summary.count ? (count / summary.count) * 100 : 0
                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 w-8 text-ink-muted font-mono">
                      {star}<Star size={11} className="fill-amber-warm text-amber-warm" />
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-canvas-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-terracotta-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-ink-subtle font-mono">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-8 space-y-5">
          {reviews.length === 0 ? (
            <div className="bg-canvas-subtle rounded-3xl border border-canvas-border p-8 text-center">
              <p className="font-editorial text-lg text-ink">No reviews yet</p>
              <p className="text-xs text-ink-muted mt-1.5">
                Be the first to share your thoughts on this piece.
              </p>
            </div>
          ) : (
            reviews.map((r) => (
              <article
                key={r.id}
                className="bg-surface rounded-3xl border border-canvas-border shadow-xs p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <StarRating value={r.rating} size={14} />
                    {r.title && (
                      <h3 className="mt-2 font-editorial text-base font-semibold text-ink">
                        {r.title}
                      </h3>
                    )}
                  </div>
                  {r.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-forest-700 dark:text-forest-500 bg-forest-50 dark:bg-forest-900/30 px-2.5 py-1 rounded-full shrink-0">
                      <CheckCircle2 size={12} />
                      Verified
                    </span>
                  )}
                </div>

                {r.body && (
                  <p className="mt-3 text-sm text-ink-muted leading-relaxed">{r.body}</p>
                )}

                <div className="mt-4 pt-4 border-t border-canvas-border/70 flex items-center justify-between text-xs text-ink-subtle">
                  <span className="font-medium text-ink">{r.author}</span>
                  <span className="font-mono">
                    {new Date(r.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
