import { Star } from 'lucide-react'

/**
 * Star rating display / input.
 * - `value` average (supports halves via fill percentage)
 * - `onChange` present => interactive input mode
 */
export default function StarRating({
  value = 0,
  count,
  size = 14,
  onChange,
  className = '',
  showValue = false,
}) {
  const interactive = typeof onChange === 'function'
  const stars = [1, 2, 3, 4, 5]

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="inline-flex items-center gap-0.5">
        {stars.map((star) => {
          const fillPct = Math.max(0, Math.min(1, value - (star - 1))) * 100
          if (interactive) {
            return (
              <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                className="p-0.5 rounded transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500"
              >
                <Star
                  size={size + 4}
                  className={star <= value ? 'fill-amber-warm text-amber-warm' : 'text-ink-light'}
                />
              </button>
            )
          }
          return (
            <span key={star} className="relative inline-block" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-ink-light/50" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillPct}%` }}>
                <Star size={size} className="fill-amber-warm text-amber-warm" />
              </span>
            </span>
          )
        })}
      </span>
      {showValue && value > 0 && (
        <span className="text-xs font-medium text-ink-muted ml-0.5">{value.toFixed(1)}</span>
      )}
      {typeof count === 'number' && (
        <span className="text-xs text-ink-subtle">({count})</span>
      )}
    </span>
  )
}
