import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, Check, Copy } from 'lucide-react'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { useShop } from '../../context/ShopContext'
import { WHATSAPP_NUMBER, INSTAGRAM_HANDLE, INSTAGRAM_DM_URL } from '../../utils/instagram'
import toast from 'react-hot-toast'

const FREE_GIFT_THRESHOLD = 500

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateCartQuantity, cartTotal, clearCart } = useShop()
  const [giftNote, setGiftNote] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [showGiftOptions, setShowGiftOptions] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!isCartOpen) return null

  const progress = Math.min(100, Math.round((cartTotal / FREE_GIFT_THRESHOLD) * 100))
  const remainingForGift = Math.max(0, FREE_GIFT_THRESHOLD - cartTotal)

  const buildOrderSummary = () => {
    const lines = [
      `🧶 *THE COZZY LOOPS — ORDER REQUEST*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      ...cart.map((item, idx) => {
        const color = item.selectedColor ? ` [Color: ${item.selectedColor}]` : ''
        const custom = item.customNote ? ` (Note: ${item.customNote})` : ''
        return `${idx + 1}. ${item.product.name}${color} x ${item.quantity} — ₹${(item.product.price * item.quantity).toLocaleString()}${custom}`
      }),
      `━━━━━━━━━━━━━━━━━━━━`,
      `*Total Estimated:* ₹${cartTotal.toLocaleString()}`,
    ]

    if (cartTotal >= FREE_GIFT_THRESHOLD) {
      lines.push(`✨ *Eligible for a free handmade bookmark and gift wrap!*`)
    }

    if (recipientName || giftNote) {
      lines.push(``)
      lines.push(`🎁 *Gift Details:*`)
      if (recipientName) lines.push(`Recipient: ${recipientName}`)
      if (giftNote) lines.push(`Note: "${giftNote}"`)
    }

    lines.push(``)
    lines.push(`Please let me know if this is available and when it can be shipped!`)
    return lines.join('\n')
  }

  const handleWhatsAppCheckout = () => {
    const text = encodeURIComponent(buildOrderSummary())
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleInstagramCheckout = async () => {
    const summary = buildOrderSummary()
    try {
      await navigator.clipboard.writeText(summary)
      toast.success('Order summary copied! Opening Instagram DM...')
    } catch {
      toast.success('Opening Instagram DM...')
    }
    window.open(INSTAGRAM_DM_URL, '_blank', 'noopener,noreferrer')
  }

  const handleCopySummary = async () => {
    const summary = buildOrderSummary()
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      toast.success('Summary copied to clipboard')
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.error('Could not copy text')
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-canvas border-l border-canvas-border shadow-float flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-canvas-border bg-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={18} className="text-terracotta-600" />
              <h2 className="font-editorial text-xl font-semibold text-ink">Your Shopping Bag</h2>
              <span className="text-xs font-mono text-ink-muted bg-canvas-subtle px-2 py-0.5 rounded-full">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-ink-muted hover:text-ink rounded-full hover:bg-canvas-subtle transition-colors"
              aria-label="Close bag"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free gift progress bar */}
          <div className="px-6 py-3.5 bg-terracotta-50/70 border-b border-terracotta-100/80">
            <div className="flex items-center justify-between text-xs text-ink-charcoal mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-terracotta-600" />
                {cartTotal >= FREE_GIFT_THRESHOLD ? (
                  <span className="text-terracotta-700 font-semibold">You unlocked a free handmade bookmark!</span>
                ) : (
                  <span>Add ₹{remainingForGift} more to get a free mini bookmark</span>
                )}
              </span>
              <span className="font-mono text-terracotta-700">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-terracotta-200/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-terracotta-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-canvas-subtle flex items-center justify-center mx-auto text-2xl mb-3">
                  🧶
                </div>
                <h3 className="font-editorial text-lg text-ink font-semibold">Your bag is empty</h3>
                <p className="text-xs text-ink-muted mt-1 max-w-xs mx-auto">
                  Browse our handmade bookmarks, flowers, and keychains to pick your favorite.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 btn-primary text-xs px-5 py-2.5"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.cartItemId} 
                  className="flex gap-4 p-3 bg-white rounded-xl border border-canvas-border/80 shadow-xs"
                >
                  <div className="w-20 h-24 rounded-lg bg-canvas-subtle overflow-hidden shrink-0">
                    <img 
                      src={item.product.images?.[0] || '/images/crochet-main.jpg'} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/shop/${item.product.id}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-medium text-sm text-ink hover:text-terracotta-600 transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-ink-subtle hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {item.selectedColor && (
                        <p className="text-xs text-ink-muted mt-0.5 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-terracotta-400 inline-block" />
                          Color: {item.selectedColor}
                        </p>
                      )}

                      {item.customNote && (
                        <p className="text-[11px] text-ink-subtle italic mt-0.5 line-clamp-1">
                          "{item.customNote}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-canvas-subtle">
                      <div className="flex items-center border border-canvas-border rounded-lg bg-canvas-subtle/50">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1 hover:bg-canvas-muted rounded-l-lg text-ink-muted transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-mono font-medium text-ink">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1 hover:bg-canvas-muted rounded-r-lg text-ink-muted transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="font-mono text-sm font-semibold text-ink">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {cart.length > 0 && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowGiftOptions(!showGiftOptions)}
                  className="w-full text-left text-xs font-medium text-terracotta-700 hover:text-terracotta-800 flex items-center justify-between py-2 border-t border-canvas-border"
                >
                  <span className="flex items-center gap-1.5">
                    🎁 Add a free handwritten gift note
                  </span>
                  <span>{showGiftOptions ? '–' : '+'}</span>
                </button>

                {showGiftOptions && (
                  <div className="mt-2 p-3 bg-white rounded-xl border border-canvas-border space-y-2.5">
                    <input
                      type="text"
                      placeholder="Person's Name (e.g. Diya)"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="input-field py-2 text-xs"
                    />
                    <textarea
                      rows={2}
                      placeholder="Write your special message for the card..."
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      className="input-field py-2 text-xs resize-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer & Checkout actions */}
          {cart.length > 0 && (
            <div className="px-6 py-5 border-t border-canvas-border bg-white space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-muted">Estimated Total</span>
                <span className="font-mono text-lg font-bold text-ink">
                  ₹{cartTotal.toLocaleString()}
                </span>
              </div>

              <div className="text-[11px] text-ink-subtle">
                Handmade with care. Fast delivery across India.
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-medium text-xs py-3 px-3 rounded-xl transition-all shadow-xs active:scale-[0.98]"
                >
                  <FaWhatsapp size={15} />
                  <span>Order on WhatsApp</span>
                </button>

                <button
                  onClick={handleInstagramCheckout}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white font-medium text-xs py-3 px-3 rounded-xl transition-all shadow-xs active:scale-[0.98]"
                >
                  <FaInstagram size={15} />
                  <span>Order on Instagram</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleCopySummary}
                  className="text-xs text-ink-muted hover:text-ink flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                  <span>{copied ? 'Summary Copied' : 'Copy Order Text'}</span>
                </button>

                <button
                  onClick={clearCart}
                  className="text-xs text-ink-subtle hover:text-red-500 transition-colors"
                >
                  Clear Bag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
