import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Heart, ShoppingBag, Plus, Minus, Check, ArrowRight, ShieldCheck } from 'lucide-react'
import { useShop } from '../../context/ShopContext'
import { isOnSale, discountPercent } from '../../models/Product'
import { FaWhatsapp } from 'react-icons/fa'
import { WHATSAPP_NUMBER } from '../../utils/instagram'

export default function QuickLookModal() {
  const { quickLookProduct, closeQuickLook, addToCart, isInWishlist, toggleWishlist, setIsCartOpen } = useShop()
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  if (!quickLookProduct) return null

  const product = quickLookProduct
  const images = product.images?.length > 0 ? product.images : ['/images/crochet-main.jpg']
  const currentImg = images[selectedImageIdx] || images[0]
  const onSale = isOnSale(product)
  const discount = discountPercent(product)
  const isSaved = isInWishlist(product.id)
  const colors = product.color_options || []

  const handleAddToCart = () => {
    addToCart(product, {
      quantity,
      selectedColor: selectedColor || colors[0] || '',
    })
    closeQuickLook()
    setIsCartOpen(true)
  }

  const handleWhatsAppAsk = () => {
    const text = encodeURIComponent(
      `Hi! I have a question about the "${product.name}" (₹${product.price}). Could you tell me more about colors and shipping time?`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-ink/50 backdrop-blur-sm transition-opacity" 
        onClick={closeQuickLook}
      />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-canvas-border shadow-float overflow-hidden z-10 animate-fade-up">
        {/* Close Button */}
        <button
          onClick={closeQuickLook}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white text-ink rounded-full border border-canvas-border shadow-xs transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Visual Column */}
          <div className="bg-canvas-subtle p-6 flex flex-col justify-between">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-canvas-border">
              <img
                src={currentImg}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {onSale && (
                <div className="absolute top-3 left-3 bg-terracotta-600 text-white text-[11px] font-mono tracking-wider px-2.5 py-1 rounded-md uppercase font-semibold">
                  SAVE {discount}%
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIdx === idx ? 'border-terracotta-600 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-canvas-border/80 flex items-center gap-2 text-xs text-ink-muted">
              <ShieldCheck size={15} className="text-sage-600 shrink-0" />
              <span>100% handmade with soft milk cotton yarn.</span>
            </div>
          </div>

          {/* Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-ink-muted uppercase tracking-editorial mb-1">
                <span>{product.category?.replace(/_/g, ' ')}</span>
                <span className="font-mono">{product.stock_qty > 0 ? `${product.stock_qty} in stock` : 'Made to order'}</span>
              </div>

              <h2 className="font-editorial text-2xl font-bold text-ink leading-snug">
                {product.name}
              </h2>

              <div className="mt-3 flex items-baseline gap-2.5">
                <span className="font-mono text-2xl font-bold text-terracotta-700">
                  ₹{Number(product.price).toLocaleString()}
                </span>
                {onSale && (
                  <span className="font-mono text-sm text-ink-subtle line-through">
                    ₹{Number(product.compare_price).toLocaleString()}
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm text-ink-muted leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Color options */}
              {colors.length > 0 && (
                <div className="mt-5">
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">
                    Color: <span className="font-normal text-terracotta-700">{selectedColor || colors[0]}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => {
                      const active = (selectedColor || colors[0]) === c
                      return (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                            active
                              ? 'border-terracotta-600 bg-terracotta-50 text-terracotta-900 font-semibold'
                              : 'border-canvas-border bg-white text-ink-muted hover:border-ink/30'
                          }`}
                        >
                          {c}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-5 flex items-center gap-4">
                <span className="text-xs font-semibold text-ink uppercase tracking-wider">Quantity</span>
                <div className="flex items-center border border-canvas-border rounded-xl bg-canvas-subtle">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-canvas-muted rounded-l-xl text-ink-muted transition-colors"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="px-3 text-sm font-mono font-medium text-ink">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-canvas-muted rounded-r-xl text-ink-muted transition-colors"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-5 border-t border-canvas-border space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary py-3.5 text-sm"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-full border transition-all ${
                    isSaved
                      ? 'border-terracotta-600 bg-terracotta-50 text-terracotta-600'
                      : 'border-canvas-border hover:border-ink/30 text-ink-muted hover:text-ink'
                  }`}
                  aria-label="Save to favorites"
                >
                  <Heart size={18} className={isSaved ? 'fill-terracotta-600' : ''} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  onClick={handleWhatsAppAsk}
                  className="text-ink-muted hover:text-[#25D366] flex items-center gap-1.5 transition-colors"
                >
                  <FaWhatsapp size={14} className="text-[#25D366]" />
                  <span>Ask on WhatsApp</span>
                </button>

                <Link
                  to={`/shop/${product.id}`}
                  onClick={closeQuickLook}
                  className="text-terracotta-700 hover:text-terracotta-800 font-medium flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
