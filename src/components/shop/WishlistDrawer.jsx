import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useShop } from '../../context/ShopContext'
import { productService } from '../../services/productService'

export default function WishlistDrawer() {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, addToCart, setIsCartOpen } = useShop()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isWishlistOpen || wishlist.length === 0) {
      setProducts([])
      return
    }

    let isMounted = true
    setLoading(true)

    productService
      .getAll()
      .then((all) => {
        if (!isMounted) return
        const matched = all.filter((p) => wishlist.includes(p.id))
        setProducts(matched)
      })
      .catch((err) => {
        console.warn('Could not load wishlist items', err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [isWishlistOpen, wishlist])

  if (!isWishlistOpen) return null

  const handleMoveToBag = (product) => {
    addToCart(product, { quantity: 1 })
    toggleWishlist(product.id)
    setIsCartOpen(true)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-canvas border-l border-canvas-border shadow-float flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-canvas-border bg-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Heart size={18} className="text-terracotta-600 fill-terracotta-600" />
              <h2 className="font-editorial text-xl font-semibold text-ink">Saved Items</h2>
              <span className="text-xs font-mono text-ink-muted bg-canvas-subtle px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 text-ink-muted hover:text-ink rounded-full hover:bg-canvas-subtle transition-colors"
              aria-label="Close wishlist"
            >
              <X size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {wishlist.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-14 h-14 rounded-full bg-canvas-subtle flex items-center justify-center mx-auto text-xl mb-3">
                  🤍
                </div>
                <h3 className="font-editorial text-lg text-ink font-semibold">No saved items yet</h3>
                <p className="text-xs text-ink-muted mt-1 max-w-xs mx-auto">
                  Click the heart icon on any product to save it here for later.
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="mt-5 btn-primary text-xs px-5 py-2.5"
                >
                  Shop Products
                </button>
              </div>
            ) : loading ? (
              <div className="space-y-3 py-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-white rounded-xl border border-canvas-border animate-pulse" />
                ))}
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-canvas-border/80 shadow-xs"
                >
                  <div className="w-20 h-24 rounded-lg bg-canvas-subtle overflow-hidden shrink-0">
                    <img
                      src={product.images?.[0] || '/images/crochet-main.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/shop/${product.id}`}
                          onClick={() => setIsWishlistOpen(false)}
                          className="font-medium text-sm text-ink hover:text-terracotta-600 transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-ink-subtle hover:text-red-500 transition-colors p-1"
                          title="Remove from saved"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <p className="font-mono text-sm font-semibold text-terracotta-700 mt-1">
                        ₹{Number(product.price).toLocaleString()}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-canvas-subtle">
                      <button
                        onClick={() => handleMoveToBag(product)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-terracotta-600 transition-colors"
                      >
                        <ShoppingBag size={13} />
                        <span>Move to Bag</span>
                      </button>

                      <Link
                        to={`/shop/${product.id}`}
                        onClick={() => setIsWishlistOpen(false)}
                        className="text-xs text-ink-muted hover:text-ink flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
