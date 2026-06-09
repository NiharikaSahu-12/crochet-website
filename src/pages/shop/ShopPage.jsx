import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Flower2, Gift, Heart, KeyRound, Search, Scissors, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import ProductCard from '../../components/shop/ProductCard'
import { useProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'

const categoryStyles = [
  'from-blush-100 to-rose-mist',
  'from-[#fff4d8] to-blush-50',
  'from-rose-mist to-white',
  'from-blush-50 to-[#fff4d8]',
  'from-white to-blush-100',
  'from-[#fff6df] to-rose-mist',
]

const categoryIcons = {
  flowers: Flower2,
  bouquets: Heart,
  keychains: KeyRound,
  scrunchies: Scissors,
  gifts: Gift,
  custom: Sparkles,
}

function CategoryTile({ category, active, index, onClick }) {
  const Icon = categoryIcons[category.value] || Gift

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        active
          ? 'border-yarn-blush bg-yarn-blush text-white'
          : `border-white bg-gradient-to-br ${categoryStyles[index % categoryStyles.length]} text-yarn-dark`
      }`}
    >
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${active ? 'bg-white/20' : 'bg-white/80 text-yarn-blush'}`}>
        <Icon size={14} aria-hidden="true" />
      </span>
      {category.label}
    </button>
  )
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm animate-pulse">
      <div className="aspect-[3/4] bg-blush-100" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/2 rounded bg-blush-100" />
        <div className="h-5 w-3/4 rounded bg-blush-100" />
        <div className="h-4 w-1/3 rounded bg-blush-100" />
      </div>
    </div>
  )
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const searchTerm = search.trim()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [showFilters, setShowFilters] = useState(!!searchParams.get('category'))
  const { categories } = useCategories({ activeOnly: true })

  const activeCategory = useMemo(
    () => categories.find((category) => category.value === selectedCategory),
    [categories, selectedCategory]
  )

  const { products, loading, error } = useProducts({
    status: 'active',
    category: selectedCategory || undefined,
    search: searchTerm || undefined,
  })

  const updateCategory = (category) => {
    setSelectedCategory(category)
    if (category) setSearchParams({ category })
    else setSearchParams({})
  }

  const clearFilters = () => {
    setSearch('')
    updateCategory('')
  }

  return (
    <div className="bg-gradient-to-b from-[#fffaf6] via-white to-blush-50">
      <section className="border-b border-blush-100 bg-gradient-to-br from-white via-blush-50 to-[#fff4d8]">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-blush-200 bg-white px-4 py-2 text-sm font-semibold text-yarn-blush shadow-sm">
              <Sparkles size={16} aria-hidden="true" />
              Shop handmade crochet
            </p>
            <h1 className="mt-5 font-display text-3xl leading-tight text-yarn-dark sm:text-4xl">
              Browse by product type
            </h1>
            <p className="mt-3 mx-auto max-w-2xl text-sm leading-7 text-[#6b5551] sm:text-base">
              Search the collection or open filters to shop flowers, bouquets, keychains, scrunchies, gifts, and custom pieces.
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-4xl rounded-[24px] border border-white bg-white/90 p-3 shadow-lg shadow-blush-100/60">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-blush-50 text-yarn-blush">
                  <Search size={16} aria-hidden="true" />
                </div>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  style={{ paddingLeft: '4rem' }}
                  className="block w-full rounded-2xl border border-blush-100 bg-white py-3.5 pr-11 text-sm text-yarn-dark outline-none transition placeholder:text-gray-400 focus:border-yarn-blush focus:ring-2 focus:ring-blush-100"
                  placeholder="Search product name..."
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yarn-blush"
                    aria-label="Clear search"
                  >
                    <X size={17} aria-hidden="true" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((current) => !current)}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-semibold transition ${
                  showFilters || selectedCategory
                    ? 'border-yarn-blush bg-yarn-blush text-white'
                    : 'border-blush-100 bg-blush-50 text-yarn-dark hover:border-yarn-blush hover:text-yarn-blush'
                }`}
              >
                <SlidersHorizontal size={17} aria-hidden="true" />
                Filters {selectedCategory ? '(1)' : ''}
              </button>
              {(selectedCategory || search) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blush-100 bg-white px-4 py-3.5 text-sm font-semibold text-yarn-blush transition hover:bg-blush-50"
                >
                  <X size={16} aria-hidden="true" />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {showFilters && (
      <section className="max-w-7xl mx-auto px-2 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl justify-start gap-2 overflow-x-auto pb-2 md:justify-center">
          <button
            type="button"
            onClick={() => updateCategory('')}
            className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              !selectedCategory
                ? 'border-yarn-dark bg-yarn-dark text-white'
                : 'border-white bg-gradient-to-br from-white to-blush-100 text-yarn-dark hover:text-yarn-blush'
            }`}
          >
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${!selectedCategory ? 'bg-white/20' : 'bg-white/80 text-yarn-blush'}`}>
              <Sparkles size={14} aria-hidden="true" />
            </span>
            All products
          </button>
          {categories.map((category, index) => (
            <CategoryTile
              key={category.value}
              category={category}
              index={index}
              active={selectedCategory === category.value}
              onClick={() => updateCategory(category.value)}
            />
          ))}
        </div>
      </section>
      )}

      <section className="max-w-7xl mx-auto px-4 pt-2 pb-6 sm:px-6 lg:px-8 lg:pt-12">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl text-yarn-dark sm:text-2xl">{activeCategory?.label || 'All handmade pieces'}</h2>
          <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#6b5551] shadow-sm">
            {loading ? 'Loading...' : `${products.length} product${products.length === 1 ? '' : 's'} found`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6">
            {[...Array(10)].map((_, index) => <ProductSkeleton key={index} />)}
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-100 bg-red-50 p-10 text-center">
            <p className="font-semibold text-red-500">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-blush-200 bg-white p-10 text-center shadow-sm">
            <p className="font-display text-3xl text-yarn-dark">No products found</p>
            <p className="mt-2 text-gray-500">Try another category or clear your search.</p>
            <button type="button" onClick={clearFilters} className="btn-primary mt-6">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
