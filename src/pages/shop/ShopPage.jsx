import { useMemo, useState, useRef, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, X, ArrowUpDown, Wand2 } from 'lucide-react'
import ProductCard from '../../components/shop/ProductCard'
import Reveal from '../../components/ui/Reveal'
import { useProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import useSEO from '../../hooks/useSEO'

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
  const [searchFocused, setSearchFocused] = useState(false)
  const searchBoxRef = useRef(null)

  // Canonical stays /shop even with filters/search in the URL.
  useSEO({
    title: 'Shop Handmade Crochet Gifts & Everlasting Flowers',
    description:
      'Browse hand-crocheted bouquets, potted blooms, floral bookmarks, keychains and amigurumi gifts. Small batches, custom colors, gift-boxed with a handwritten note.',
    path: '/shop',
  })

  // Every filter lives in the URL, so results are shareable, refresh-safe,
  // and footer links like /shop?category=flowers keep working even when
  // we are already on this page.
  const search = searchParams.get('q') || ''
  const selectedCategory = searchParams.get('category') || ''
  const priceTier = searchParams.get('price') || 'all'
  const sortBy = searchParams.get('sort') || 'featured'
  const inStockOnly = searchParams.get('stock') === '1'

  const updateParams = (patch) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || value === false) {
        next.delete(key)
      } else {
        next.set(key, String(value))
      }
    })
    setSearchParams(next, { replace: true })
  }

  const { categories } = useCategories({ activeOnly: true })

  const { products, loading, error } = useProducts({
    status: 'active',
    category: selectedCategory || undefined,
    search: search.trim() || undefined,
  })

  // Full active catalog powers the search autocomplete suggestions.
  const { products: catalog } = useProducts({ status: 'active' })

  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (q.length < 1) return []
    return catalog
      .filter((p) => {
        const haystack = [p.name, p.category, p.yarn_type, ...(p.tags || [])]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(q)
      })
      .slice(0, 6)
  }, [catalog, search])

  // Close the suggestion dropdown on outside click.
  useEffect(() => {
    const onClick = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const updateCategory = (catValue) => {
    updateParams({ category: catValue || null })
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
    setSearchFocused(false)
    setSearchParams({}, { replace: true })
  }

  const hasActiveFilters = Boolean(search || selectedCategory || priceTier !== 'all' || inStockOnly)

  return (
    <div className="bg-canvas min-h-screen py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="mt-6 pt-5 border-t border-canvas-border space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md" ref={searchBoxRef}>
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none z-10" />
              <input
                type="text"
                value={search}
                onChange={(e) => updateParams({ q: e.target.value })}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search bookmarks, keychains, flowers..."
                className="w-full pl-10 pr-9 py-2.5 bg-surface border border-canvas-border rounded-xl text-xs sm:text-sm text-ink outline-none focus:border-terracotta-600 focus:ring-1 focus:ring-terracotta-600 transition-all placeholder:text-ink-subtle"
              />
              {search && (
                <button
                  onClick={() => updateParams({ q: null })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink z-10"
                >
                  <X size={14} />
                </button>
              )}

              {/* Smart Search Autocomplete */}
              {searchFocused && search.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-canvas-border rounded-2xl shadow-lifted overflow-hidden z-30 animate-fade-up">
                  {suggestions.length > 0 ? (
                    <ul className="divide-y divide-canvas-border/70">
                      {suggestions.map((p) => (
                        <li key={p.id}>
                          <Link
                            to={`/shop/${p.id}`}
                            onClick={() => setSearchFocused(false)}
                            className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-canvas-subtle transition-colors"
                          >
                            <img
                              src={p.images?.[0] || '/images/crochet-main.jpg'}
                              alt=""
                              className="w-10 h-12 rounded-lg object-cover border border-canvas-border shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-ink truncate">{p.name}</p>
                              <p className="text-[11px] text-ink-subtle capitalize truncate">
                                {p.category?.replace(/_/g, ' ')}
                              </p>
                            </div>
                            <span className="font-mono text-xs text-terracotta-700 shrink-0">
                              ₹{Number(p.price).toLocaleString()}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-5 text-center">
                      <p className="text-sm text-ink">No matches for “{search.trim()}”</p>
                      <Link
                        to="/custom-orders"
                        onClick={() => setSearchFocused(false)}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-700 hover:text-terracotta-900"
                      >
                        <Wand2 size={13} />
                        Request a custom piece
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sort & Quick Toggles */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* In stock toggle */}
              <button
                type="button"
                onClick={() => updateParams({ stock: inStockOnly ? null : '1' })}
                className={`text-xs px-3.5 py-2 rounded-xl border transition-all ${
                  inStockOnly
                    ? 'border-ink bg-elevated text-white font-medium'
                    : 'border-canvas-border bg-surface text-ink-muted hover:border-ink/20'
                }`}
              >
                In Stock Only
              </button>

              {/* Price Tier Select */}
              <select
                value={priceTier}
                onChange={(e) => updateParams({ price: e.target.value === 'all' ? null : e.target.value })}
                className="text-xs px-3 py-2 bg-surface border border-canvas-border rounded-xl text-ink outline-none focus:border-terracotta-600 font-medium cursor-pointer"
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
                  onChange={(e) => updateParams({ sort: e.target.value === 'featured' ? null : e.target.value })}
                  className="text-xs pl-3 pr-8 py-2 bg-surface border border-canvas-border rounded-xl text-ink outline-none focus:border-terracotta-600 font-medium appearance-none cursor-pointer"
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
                  ? 'bg-elevated text-white shadow-xs'
                  : 'bg-surface border border-canvas-border text-ink-muted hover:text-ink hover:border-ink/20'
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
                      ? 'bg-elevated text-white shadow-xs'
                      : 'bg-surface border border-canvas-border text-ink-muted hover:text-ink hover:border-ink/20'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-6 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between text-xs text-ink-muted font-mono">
          <span>
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
          </span>
          <Link
            to="/custom-orders"
            className="text-terracotta-700 hover:underline flex items-center gap-1 font-sans text-xs font-semibold"
          >
            <Wand2 size={13} />
            <span>
              <span className="hidden sm:inline">Looking for custom colors? </span>Open Custom Studio →
            </span>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[4/5] bg-canvas-subtle rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-surface rounded-3xl border border-canvas-border p-8 text-center max-w-lg mx-auto my-8 shadow-xs">
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
              {filteredProducts.map((product, i) => (
                <Reveal key={product.id} delay={(i % 4) * 0.06} duration={0.5}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
