import { Link } from 'react-router-dom'
import { FaHeart, FaShoppingBag, FaStar } from 'react-icons/fa'
import { openInstagramDM, WHATSAPP_NUMBER, getWhatsAppOrderUrl } from '../../utils/instagram'
import { isOnSale, discountPercent } from '../../models/Product'

export default function ProductCard({ product, className = '' }) {
  const onSale = isOnSale(product)
  const discount = discountPercent(product)

  const handleOrder = (e) => {
    e.preventDefault()
    e.stopPropagation()
    openInstagramDM(product)
  }

  const primaryImage = product.images?.[0]

  return (
    <Link
      to={`/shop/${product.id}`}
      className={`card group cursor-pointer ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-blush-50 overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blush-100 to-blush-200">
            <div className="text-center text-blush-400">
              <div className="text-5xl mb-2">🧶</div>
              <p className="text-sm font-medium">No image</p>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {onSale && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
          {product.is_featured && (
            <span className="bg-yarn-gold text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <FaStar size={9} fill="white" /> Featured
            </span>
          )}
          {product.stock_qty === 0 && (
            <span className="bg-gray-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick order button */}
        <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleOrder}
            className="w-full bg-yarn-blush hover:bg-blush-700 text-white py-3 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <FaShoppingBag size={15} />
            Order via Instagram
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5">
        <p className="text-xs text-yarn-blush font-medium tracking-wide mb-0.5 capitalize">
          {product.category?.replace(/_/g, ' ')}
        </p>
        <h3 className="font-display font-semibold text-yarn-dark text-sm leading-tight mb-1.5 line-clamp-2 group-hover:text-yarn-blush transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5">
          <span className="text-yarn-blush font-bold text-base">₹{product.price.toLocaleString()}</span>
          {onSale && (
            <span className="text-gray-400 line-through text-xs">₹{product.compare_price?.toLocaleString()}</span>
          )}
        </div>

        {product.yarn_type && (
          <p className="text-xs text-gray-400 mt-1">🧵 {product.yarn_type}</p>
        )}
      </div>
    </Link>
  )
}
