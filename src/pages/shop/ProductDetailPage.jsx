import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MdArrowBack, MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { FaInstagram, FaHeart, FaShare, FaStar, FaWhatsapp } from 'react-icons/fa'
import productController from '../../controllers/productController'
import { openInstagramDM, WHATSAPP_NUMBER, getWhatsAppOrderUrl } from '../../utils/instagram'
import { isOnSale, discountPercent, PRODUCT_CATEGORIES } from '../../models/Product'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    productController.getProduct(id)
      .then(setProduct)
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-yarn-blush border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!product) return null

  const onSale = isOnSale(product)
  const discount = discountPercent(product)
  const images = product.images?.length ? product.images : [null]
  const catLabel = PRODUCT_CATEGORIES.find(c => c.value === product.category)?.label || product.category

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link to="/" className="hover:text-yarn-blush transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-yarn-blush transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-yarn-dark font-medium line-clamp-1">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-blush-50 rounded-3xl overflow-hidden shadow-lg">
            {images[imgIdx] ? (
              <img src={images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blush-100 to-blush-200">
                <div className="text-center">
                  <div className="text-8xl mb-3">🧶</div>
                  <p className="text-blush-400 font-medium">No image available</p>
                </div>
              </div>
            )}

            {images.length > 1 && (
              <>
                <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                  <MdChevronLeft size={20} />
                </button>
                <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                  <MdChevronRight size={20} />
                </button>
              </>
            )}

            {onSale && (
              <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1.5 rounded-full">
                -{discount}% OFF
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    i === imgIdx ? 'border-yarn-blush shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : 
                    <div className="w-full h-full bg-blush-100 flex items-center justify-center text-2xl">🧶</div>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <span className="text-xs text-yarn-blush font-medium uppercase tracking-widest">{catLabel}</span>
              <h1 className="font-display text-3xl md:text-4xl text-yarn-dark mt-1 leading-tight">{product.name}</h1>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setWishlisted(w => !w)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  wishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-blush-200 text-gray-400 hover:border-red-200 hover:text-red-400'
                }`}>
                <FaHeart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
              <button onClick={share}
                className="w-10 h-10 rounded-full border border-blush-200 text-gray-400 hover:border-yarn-blush hover:text-yarn-blush flex items-center justify-center transition-all">
                <FaShare size={18} />
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-4xl font-bold text-yarn-blush">₹{product.price.toLocaleString()}</span>
            {onSale && <span className="text-gray-400 line-through text-xl">₹{product.compare_price?.toLocaleString()}</span>}
          </div>

          {/* Status */}
          <div className="mb-6">
            {product.stock_qty > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full" /> In Stock ({product.stock_qty} available)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-red-500 bg-red-50 px-3 py-1.5 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-red-400 rounded-full" /> Sold Out
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h3 className="font-display font-semibold text-yarn-dark mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {product.yarn_type && (
              <div className="bg-blush-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Yarn Type</p>
                <p className="font-medium text-yarn-dark text-sm">🧵 {product.yarn_type}</p>
              </div>
            )}
            {product.color_options?.length > 0 && (
              <div className="bg-blush-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Colors</p>
                <p className="font-medium text-yarn-dark text-sm">🎨 {product.color_options.join(', ')}</p>
              </div>
            )}
            {product.care_instructions && (
              <div className="bg-blush-50 rounded-xl p-3 col-span-2">
                <p className="text-xs text-gray-400 mb-0.5">Care Instructions</p>
                <p className="font-medium text-yarn-dark text-sm">💧 {product.care_instructions}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map(tag => (
                <span key={tag} className="bg-blush-100 text-yarn-blush text-xs px-3 py-1.5 rounded-full">#{tag}</span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="space-y-3 mt-auto">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => openInstagramDM(product)}
                disabled={product.stock_qty === 0}
                className="btn-primary flex items-center justify-center gap-2 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaInstagram size={18} />
                {product.stock_qty > 0 ? 'Instagram' : 'Out of Stock'}
              </button>

              <a
                href={getWhatsAppOrderUrl(product, WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaWhatsapp size={18} />
                WhatsApp
              </a>
            </div>

            {product.is_custom && (
              <div className="flex items-center gap-2 bg-yarn-gold/10 border border-yarn-gold/30 rounded-xl p-3">
                <FaStar size={16} className="text-yarn-gold flex-shrink-0" />
                <p className="text-sm text-yarn-dark">This item can be customized! Mention your preferences in your message.</p>
              </div>
            )}

            <Link to="/shop" className="w-full btn-outline flex items-center justify-center gap-2 py-3">
              <MdArrowBack size={16} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
