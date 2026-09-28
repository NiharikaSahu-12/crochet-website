import { Link } from 'react-router-dom'
import { History } from 'lucide-react'
import { useShop } from '../../context/ShopContext'
import ProductCard from './ProductCard'

export default function RecentlyViewedRail({ excludeId }) {
  const { recentlyViewed } = useShop()
  const items = recentlyViewed.filter((p) => p.id !== excludeId).slice(0, 6)

  if (items.length === 0) return null

  return (
    <section className="mt-20 pt-12 border-t border-canvas-border">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-full bg-canvas-subtle border border-canvas-border flex items-center justify-center text-terracotta-700">
            <History size={17} />
          </span>
          <div>
            <span className="font-mono text-xs uppercase tracking-editorial text-terracotta-700">
              Pick up where you left off
            </span>
            <h2 className="mt-0.5 font-editorial text-2xl font-bold text-ink">Recently Viewed</h2>
          </div>
        </div>
        <Link
          to="/shop"
          className="text-xs font-semibold uppercase tracking-wider text-ink hover:text-terracotta-700 transition-colors"
        >
          Browse All
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  )
}
