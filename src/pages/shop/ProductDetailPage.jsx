import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, ShoppingBag, Wand2, ShieldCheck, Sparkles, Plus, Minus, Check, Copy, Share2, Flower2 } from 'lucide-react'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import productController from '../../controllers/productController'
import ProductCard from '../../components/shop/ProductCard'
import { useShop } from '../../context/ShopContext'
import { isOnSale, discountPercent } from '../../models/Product'
import { WHATSAPP_NUMBER, INSTAGRAM_DM_URL } from '../../utils/instagram'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, isInWishlist, toggleWishlist, setIsCartOpen, openCustomStudio } = useShop()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('materials')

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    productController
      .getProductById(id)
      .then((data) => {
        if (!isMounted) return
        setProduct(data)
        if (data?.color_options?.length) {
          setSelectedColor(data.color_options[0])
        }
        // Load related items
        return productController.getAllProducts({ category: data.category })
      })
      .then((all) => {
        if (!isMounted) return
        if (Array.isArray(all)) {
          setRelated(all.filter((p) => p.id !== id).slice(0, 4))
        }
      })
      .catch((err) => {
        console.error('Error loading product:', err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-terracotta-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-canvas py-20 text-center px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-canvas-border">
          <p className="font-editorial text-2xl font-bold text-ink">Item Not Found</p>
          <p className="text-xs text-ink-muted mt-2">
            This item may be sold out or currently unavailable.
          </p>
          <Link to="/shop" className="btn-primary mt-6 text-xs px-6 py-3">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

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
    setIsCartOpen(true)
  }

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Hi! I would like to order the "${product.name}" (₹${product.price})\nQuantity: ${quantity}\nColor: ${selectedColor || 'Standard'}\nCould you confirm dispatch availability?`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  const handleInstagramOrder = async () => {
    const text = `Hi! I would like to order the "${product.name}" (₹${product.price})\nQuantity: ${quantity}\nColor: ${selectedColor || 'Standard'}`
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Details copied! Opening Instagram DM...')
    } catch {
      toast.success('Opening Instagram DM...')
    }
    window.open(INSTAGRAM_DM_URL, '_blank', 'noopener,noreferrer')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this handmade crochet piece from TheCozzyLoops: ${product.name}`,
          url: window.location.href,
        })
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Product link copied to clipboard!')
      } catch {
        toast.error('Could not copy link')
      }
    }
  }

  return (
    <div className="bg-canvas min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between text-xs text-ink-muted mb-8 font-mono">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-ink">Shop</Link>
            <span>/</span>
            <span className="text-ink truncate max-w-[200px]">{product.name}</span>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 hover:text-ink transition-colors font-sans text-xs"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
        </div>

        {/* Primary Product Layout */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Visual Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/5] bg-white rounded-3xl overflow-hidden border border-canvas-border shadow-lifted">
              <img
                src={currentImg}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {onSale && (
                <div className="absolute top-4 left-4 bg-ink text-white font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-md font-semibold">
                  SAVE {discount}%
                </div>
              )}
              {product.stock_qty === 0 && (
                <div className="absolute top-4 left-4 bg-stone-600 text-white font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-md font-semibold">
                  Made to Order
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-20 h-24 rounded-xl overflow-hidden border-2 bg-white transition-all shrink-0 ${
                      selectedImageIdx === idx
                        ? 'border-terracotta-600 shadow-subtle'
                        : 'border-canvas-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quality Stamp */}
            <div className="p-5 rounded-2xl bg-white border border-canvas-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-terracotta-50 flex items-center justify-center text-terracotta-700 shrink-0">
                <Flower2 size={20} />
              </div>
              <div className="text-xs space-y-1">
                <div className="font-semibold text-ink">Handmade in Small Batches</div>
                <p className="text-ink-muted leading-relaxed">
                  Every stitch is carefully crocheted by hand to keep its shape. 
                  Packed nicely in eco-friendly gift paper with a handwritten note card.
                </p>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-editorial text-terracotta-700">
                <span>{product.category?.replace(/_/g, ' ')}</span>
                <span className="text-ink-subtle">
                  {product.stock_qty > 0 ? `${product.stock_qty} in stock` : 'Made to order: 3-5 days'}
                </span>
              </div>

              {/* Title */}
              <h1 className="mt-2 font-editorial text-3xl sm:text-4xl font-bold text-ink leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-mono text-3xl font-bold text-ink">
                  ₹{Number(product.price).toLocaleString()}
                </span>
                {onSale && (
                  <span className="font-mono text-base text-ink-subtle line-through">
                    ₹{Number(product.compare_price).toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-ink-muted">· Taxes Included</span>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-ink-muted leading-relaxed font-light">
                {product.description}
              </p>

              {/* Color Swatch Options */}
              {colors.length > 0 && (
                <div className="mt-6 pt-6 border-t border-canvas-border">
                  <div className="flex items-center justify-between text-xs font-semibold text-ink uppercase tracking-wider mb-2.5">
                    <span>Choose Color:</span>
                    <span className="font-mono text-terracotta-700 font-normal">
                      {selectedColor || colors[0]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => {
                      const active = (selectedColor || colors[0]) === c
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          className={`text-xs px-3.5 py-2 rounded-xl border transition-all ${
                            active
                              ? 'border-terracotta-600 bg-terracotta-50 text-terracotta-900 font-semibold shadow-xs'
                              : 'border-canvas-border bg-white text-ink-muted hover:border-ink/20'
                          }`}
                        >
                          {c}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Counter */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-canvas-border rounded-xl bg-white shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-canvas-subtle rounded-l-xl text-ink-muted transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3.5 text-sm font-mono font-medium text-ink">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-canvas-subtle rounded-r-xl text-ink-muted transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <div className="flex gap-2.5">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 btn-primary py-3.5 text-sm shadow-subtle"
                  >
                    <ShoppingBag size={17} />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3.5 rounded-full border transition-all ${
                      isSaved
                        ? 'border-terracotta-600 bg-terracotta-50 text-terracotta-600'
                        : 'border-canvas-border bg-white text-ink-muted hover:text-ink hover:border-ink/30'
                    }`}
                    aria-label="Save to favorites"
                    title="Wishlist"
                  >
                    <Heart size={18} className={isSaved ? 'fill-terracotta-600' : ''} />
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-3.5 rounded-full border border-canvas-border bg-white text-ink-muted hover:text-ink hover:border-ink/30 transition-all"
                    aria-label="Share product"
                    title="Share"
                  >
                    <Share2 size={18} />
                  </button>
                </div>

                {/* Instant Order Channels */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-medium text-xs py-3 px-3 rounded-xl transition-all shadow-xs"
                  >
                    <FaWhatsapp size={15} />
                    <span>Order on WhatsApp</span>
                  </button>

                  <button
                    onClick={handleInstagramOrder}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white font-medium text-xs py-3 px-3 rounded-xl transition-all shadow-xs"
                  >
                    <FaInstagram size={15} />
                    <span>Order on Instagram</span>
                  </button>
                </div>
              </div>

              {/* Custom order trigger */}
              <div className="mt-5 p-3.5 rounded-2xl bg-canvas-subtle border border-canvas-border flex items-center justify-between text-xs">
                <span className="text-ink-muted">Want different colors or ribbon styles?</span>
                <button
                  onClick={() => openCustomStudio({ name: product.name, category: product.category })}
                  className="font-semibold text-terracotta-700 hover:text-terracotta-800 flex items-center gap-1"
                >
                  <Wand2 size={13} />
                  <span>Customize</span>
                </button>
              </div>
            </div>

            {/* Tabbed Specs */}
            <div className="pt-6 border-t border-canvas-border">
              <div className="flex gap-4 border-b border-canvas-border text-xs uppercase tracking-wider font-semibold">
                <button
                  onClick={() => setActiveTab('materials')}
                  className={`pb-2 transition-all relative ${
                    activeTab === 'materials'
                      ? 'text-ink border-b-2 border-ink'
                      : 'text-ink-subtle hover:text-ink'
                  }`}
                >
                  Yarn & Care
                </button>
                <button
                  onClick={() => setActiveTab('gifting')}
                  className={`pb-2 transition-all relative ${
                    activeTab === 'gifting'
                      ? 'text-ink border-b-2 border-ink'
                      : 'text-ink-subtle hover:text-ink'
                  }`}
                >
                  Gift Packaging
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2 transition-all relative ${
                    activeTab === 'shipping'
                      ? 'text-ink border-b-2 border-ink'
                      : 'text-ink-subtle hover:text-ink'
                  }`}
                >
                  Shipping
                </button>
              </div>

              <div className="py-4 text-xs text-ink-muted leading-relaxed">
                {activeTab === 'materials' && (
                  <div className="space-y-2">
                    <p><strong className="text-ink">Yarn:</strong> {product.yarn_type || '100% Soft Milk Cotton Yarn'}</p>
                    <p><strong className="text-ink">Care:</strong> {product.care_instructions || 'Spot clean with cold water and mild soap. Gently reshape with your hands and let it air dry flat.'}</p>
                    <p><strong className="text-ink">Gentle:</strong> Very soft and safe for sensitive skin.</p>
                  </div>
                )}
                {activeTab === 'gifting' && (
                  <div className="space-y-2">
                    <p>Every item arrives nicely wrapped in recyclable paper packaging with cotton string.</p>
                    <p>Includes a free handwritten gift note card. You can write your message when viewing your bag!</p>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <p>Ready items are shipped within 24 to 48 hours across India with a tracking link.</p>
                    <p>Custom colors and personalized orders take 3 to 5 days to make before shipping.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Items */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-canvas-border">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-editorial text-terracotta-700">
                  More Cute Items
                </span>
                <h2 className="mt-1 font-editorial text-2xl sm:text-3xl font-bold text-ink">
                  You Might Also Like
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-xs font-semibold uppercase tracking-wider text-ink hover:text-terracotta-700"
              >
                See All
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
