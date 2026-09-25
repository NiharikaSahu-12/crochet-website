import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, SlidersHorizontal, ArrowUpDown, Wand2, Sparkles } from 'lucide-react'
import ProductCard from '../../components/shop/ProductCard'
import { useProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { useShop } from '../../context/ShopContext'

const PRICE_TIERS = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-200', label: 'Under ₹200' },
  { id: '200-400', label: '₹200 – ₹400' },
  { id: 'above-400', label: '₹400+' },
]

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured Drops' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Alphabetical' },
]

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [priceTier, setPriceTier] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [inStockOnly, setInStockOnly] = useState(false)
  const { openCustomStudio } = useShop()

  const { categories } = useCategories({ activeOnly: true })

  const { products, loading, error } = useProducts({
    status: 'active',
    category: selectedCategory || undefined,
    search: search.trim() || undefined,
  })

  const updateCategory = (catValue) => {
    setSelectedCategory(catValue)
    if (catValue) {
      setSearchParams({ category: catValue })
    } else {
      setSearchParams({})
    }
  }

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let list = [...products]

    // Price tier
    if (priceTier === 'under-200') {
      list = list.filter((p) => p.price < 200)
    } else if (priceTier === '200-400') {
      list = list.filter((p) => p.price >= 200 && p.price <= 400)
    } else if (priceTier === 'above-400') {
      list = list.filter((p) => p.price > 400)
    }

    // In stock
    if (inStockOnly) {
      list = list.filter((p) => p.stock_qty > 0)
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }

    return list
  }, [products, priceTier, inStockOnly, sortBy])

  const clearAllFilters = () => {
    setSearch('')
    updateCategory('')
    setPriceTier('all')
    setInStockOnly(false)
    setSortBy('featured')
  }

  const hasActiveFilters = Boolean(search || selectedCategory || priceTier !== 'all' || inStockOnly)

  return (
    <div className="bg-canvas min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Page Header */}
        <div className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-editorial text-terracotta-700 font-semibold">
            Our Collection
          </span>
          <h1 className="mt-2 font-editorial text-3xl sm:text-5xl font-bold text-ink">
            Handmade Crochet Creations
          </h1>
          <p className="mt-3 text-base text-ink-muted leading-relaxed font-light">
            Everlasting floral bouquets, aesthetic bookmarks, cute plushies, and keychains. Hand-stitched with love in small intentional batches.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-8 pt-6 border-t border-canvas-border space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bookmarks, keychains, flowers..."
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-canvas-border rounded-xl text-xs sm:text-sm text-ink outline-none focus:border-terracotta-600 focus:ring-1 focus:ring-terracotta-600 transition-all placeholder:text-ink-subtle"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort & Quick Toggles */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* In stock toggle */}
              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`text-xs px-3.5 py-2 rounded-xl border transition-all ${
                  inStockOnly
                    ? 'border-ink bg-ink text-white font-medium'
                    : 'border-canvas-border bg-white text-ink-muted hover:border-ink/20'
                }`}
              >
                In Stock Only
              </button>

              {/* Price Tier Select */}
              <select
                value={priceTier}
                onChange={(e) => setPriceTier(e.target.value)}
                className="text-xs px-3 py-2 bg-white border border-canvas-border rounded-xl text-ink outline-none focus:border-terracotta-600 font-medium cursor-pointer"
              >
                {PRICE_TIERS.map((tier) => (
                  <option key={tier.id} value={tier.id}>
                    {tier.label}
                  </option>
                ))}
              </select>

              {/* Sort Selector */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs pl-3 pr-8 py-2 bg-white border border-canvas-border rounded-xl text-ink outline-none focus:border-terracotta-600 font-medium appearance-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ArrowUpDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-terracotta-700 hover:text-terracotta-900 underline underline-offset-2 transition-colors px-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Interactive Category Segmented Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => updateCategory('')}
              className={`text-xs px-4 py-2 rounded-xl transition-all shrink-0 font-medium ${
                selectedCategory === ''
                  ? 'bg-ink text-white shadow-xs'
                  : 'bg-white border border-canvas-border text-ink-muted hover:text-ink hover:border-ink/20'
              }`}
            >
              All Products
            </button>

            {categories.map((cat) => {
              const active = selectedCategory === cat.value
              return (
                <button
                  key={cat.value}
                  onClick={() => updateCategory(cat.value)}
                  className={`text-xs px-4 py-2 rounded-xl transition-all shrink-0 font-medium capitalize ${
                    active
                      ? 'bg-ink text-white shadow-xs'
                      : 'bg-white border border-canvas-border text-ink-muted hover:text-ink hover:border-ink/20'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-6 flex items-center justify-between text-xs text-ink-muted font-mono">
          <span>
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
          </span>
          <Link
            to="/custom-orders"
            className="text-terracotta-700 hover:underline flex items-center gap-1 font-sans text-xs font-semibold"
          >
            <Wand2 size={13} />
            <span>Looking for custom colors? Open Custom Studio →</span>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[4/5] bg-canvas-subtle rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-canvas-border p-12 text-center max-w-lg mx-auto my-12 shadow-xs">
              <div className="text-3xl mb-3">🧶</div>
              <h3 className="font-editorial text-xl font-bold text-ink">
                No items found
              </h3>
              <p className="text-xs text-ink-muted mt-2 leading-relaxed">
                We could not find items matching your search. Try resetting your filters or make a custom order with us.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button onClick={clearAllFilters} className="btn-outline text-xs px-5 py-2.5">
                  Clear Filters
                </button>
                <Link to="/custom-orders" className="btn-primary text-xs px-5 py-2.5">
                  <Wand2 size={14} />
                  <span>Custom Order Studio</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
