import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { MdTune, MdClose } from 'react-icons/md'
import ProductCard from '../../components/shop/ProductCard'
import { useProducts } from '../../hooks/useProducts'
import { PRODUCT_CATEGORIES } from '../../models/Product'

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [showFilters, setShowFilters] = useState(false)

  const { products, loading, error } = useProducts({
    status: 'active',
    category: selectedCategory || undefined,
    search: search || undefined,
  })

  const updateCategory = (cat) => {
    setSelectedCategory(cat)
    if (cat) setSearchParams({ category: cat })
    else setSearchParams({})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="font-script text-yarn-blush text-2xl mb-1">Our collection</p>
        <h1 className="font-display text-5xl text-yarn-dark mb-4">Shop</h1>
        <p className="text-gray-500 max-w-md mx-auto">Every piece made with care, love, and the finest yarn.</p>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <div className="relative flex-1 min-w-0">
          <FaSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <MdClose size={16} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-medium text-sm transition-all ${
            showFilters || selectedCategory ? 'bg-yarn-blush border-yarn-blush text-white' : 'bg-white border-blush-200 text-yarn-dark hover:border-yarn-blush'
          }`}
        >
          <MdTune size={16} />
          Filters {selectedCategory && '(1)'}
        </button>
      </div>

      {/* Category pills */}
      {(showFilters || selectedCategory) && (
        <div className="flex flex-wrap gap-2 mb-8 p-4 bg-white rounded-2xl border border-blush-100">
          <button
            onClick={() => updateCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !selectedCategory ? 'bg-yarn-blush text-white' : 'bg-blush-50 text-yarn-dark hover:bg-blush-100'
            }`}
          >
            All
          </button>
          {PRODUCT_CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => updateCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.value ? 'bg-yarn-blush text-white' : 'bg-blush-50 text-yarn-dark hover:bg-blush-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[3/4] bg-blush-100" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-blush-100 rounded w-1/2" />
                <div className="h-5 bg-blush-100 rounded w-3/4" />
                <div className="h-4 bg-blush-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🧶</div>
          <h3 className="font-display text-2xl text-yarn-dark mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">Try a different search or browse all categories.</p>
          <button onClick={() => { setSearch(''); updateCategory('') }} className="btn-primary">
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-6">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
