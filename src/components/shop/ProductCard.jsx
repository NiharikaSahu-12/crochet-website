import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react'
import { useShop } from '../../context/ShopContext'
import { isOnSale, discountPercent } from '../../models/Product'

export default function ProductCard({ product, className = '' }) {
  const { addToCart, isInWishlist, toggleWishlist, openQuickLook, setIsCartOpen } = useShop()
  const [justAdded, setJustAdded] = useState(false)

  const onSale = isOnSale(product)
  const discount = discountPercent(product)
  const isSaved = isInWishlist(product.id)
  const primaryImage = product.images?.[0] || '/images/crochet-main.jpg'
  const colors = product.color_options || []

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, {
      quantity: 1,
      selectedColor: colors[0] || '',
    })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1600)
    setIsCartOpen(true)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
  }

  const handleQuickLook = (e) => {
    e.preventDefault()
    e.stopPropagation()
    openQuickLook(product)
  }

  return (
    <div className={`group flex flex-col bg-white rounded-2xl border border-canvas-border hover:border-terracotta-300 shadow-xs hover:shadow-card transition-all duration-300 overflow-hidden ${className}`}>
      {/* Visual Frame */}
      <div className="relative aspect-[4/5] bg-canvas-subtle overflow-hidden">
        <Link to={`/shop/${product.id}`} className="block w-full h-full">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600 ease-out"
          />
        </Link>

        {/* Quiet corner micro-indicator (No candy pill badges) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {onSale && (
            <span className="bg-ink text-white font-mono text-[10px] tracking-wider px-2 py-0.5 rounded font-semibold shadow-xs">
              -{discount}%
            </span>
          )}
          {product.is_featured && !onSale && (
            <span className="bg-white/95 backdrop-blur-xs text-ink font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-black/5 font-semibold shadow-xs">
              Featured
            </span>
          )}
          {product.stock_qty === 0 && (
            <span className="bg-stone-600 text-white font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-medium">
              Made to order
            </span>
          )}
        </div>

        {/* Floating action controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={handleWishlist}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isSaved
                ? 'bg-white text-terracotta-600 shadow-xs'
                : 'bg-white/90 hover:bg-white text-ink-muted hover:text-ink shadow-xs backdrop-blur-xs'
            }`}
            aria-label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart size={16} className={isSaved ? 'fill-terracotta-600 text-terracotta-600' : ''} />
          </button>

          <button
            onClick={handleQuickLook}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-ink-muted hover:text-ink shadow-xs backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
            aria-label="Quick preview"
            title="Quick view"
          >
            <Eye size={16} />
          </button>
        </div>

        {/* Quick Add Overlay Bar */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={handleQuickAdd}
            className="w-full py-3 px-4 bg-ink/95 hover:bg-ink text-white text-xs font-semibold rounded-xl backdrop-blur-xs flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all"
          >
            {justAdded ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-ink-muted uppercase tracking-editorial mb-1">
            <span>{product.category?.replace(/_/g, ' ')}</span>
            {product.yarn_type && (
              <span className="font-mono truncate max-w-[120px] text-ink-subtle">
                {product.yarn_type.replace(/100% /g, '')}
              </span>
            )}
          </div>

          <Link to={`/shop/${product.id}`} className="block">
            <h3 className="font-editorial text-base font-semibold text-ink group-hover:text-terracotta-700 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3.5 pt-3 border-t border-canvas-border/80 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-base font-bold text-ink">
              ₹{Number(product.price).toLocaleString()}
            </span>
            {onSale && (
              <span className="font-mono text-xs text-ink-subtle line-through">
                ₹{Number(product.compare_price).toLocaleString()}
              </span>
            )}
          </div>

          {/* Color swatch hint */}
          {colors.length > 0 && (
            <span className="text-[11px] font-mono text-ink-muted">
              {colors.length} {colors.length === 1 ? 'color' : 'colors'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
