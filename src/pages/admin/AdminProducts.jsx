import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Star, 
  Eye, 
  EyeOff, 
  Search, 
  Package, 
  Sparkles, 
  Filter,
  X,
  ExternalLink
} from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import productController from '../../controllers/productController'
import { useCategories } from '../../hooks/useCategories'
import { PRODUCT_STATUS } from '../../models/Product'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const { products, loading, refetch } = useProducts({ 
    search: search || undefined, 
    category: category || undefined 
  })
  const { categories } = useCategories({ activeOnly: true })
  const [deleting, setDeleting] = useState(null)

  // Filter by status on client side if selected
  const filteredProducts = useMemo(() => {
    if (!statusFilter) return products
    return products.filter((p) => {
      if (statusFilter === 'out_of_stock') {
        return p.status === PRODUCT_STATUS.OUT_OF_STOCK || p.stock_qty === 0
      }
      return p.status === statusFilter
    })
  }, [products, statusFilter])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the atelier catalog? This action cannot be undone.`)) {
      return
    }
    setDeleting(id)
    try {
      await productController.deleteProduct(id)
      toast.success('Creation deleted from catalog')
      refetch()
    } catch {
      toast.error('Failed to delete product')
    } finally {
      setDeleting(null)
    }
  }

  const handleToggleFeatured = async (product) => {
    try {
      await productController.toggleFeatured(product.id, product.is_featured)
      toast.success(product.is_featured ? 'Removed from featured' : 'Added to featured curation')
      refetch()
    } catch {
      toast.error('Failed to update featured state')
    }
  }

  const handleToggleStatus = async (product) => {
    try {
      await productController.toggleStatus(product.id, product.status)
      toast.success(product.status === 'active' ? 'Set to draft (hidden)' : 'Published to storefront')
      refetch()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const hasActiveFilters = Boolean(search || category || statusFilter)

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setStatusFilter('')
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-editorial text-2xl lg:text-3xl font-semibold text-ink">Products & Inventory</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-canvas-subtle border border-canvas-border text-xs font-mono font-medium text-ink-muted">
              {filteredProducts.length} items
            </span>
          </div>
          <p className="text-xs text-ink-subtle mt-1">
            Curate your handcrafted creations, update pricing, manage stock counts, and showcase featured items.
          </p>
        </div>

        <Link 
          to="/admin/products/new" 
          className="btn-primary inline-flex items-center justify-center gap-2 text-xs font-semibold py-3 px-5 shadow-subtle self-start sm:self-auto"
        >
          <Plus size={16} /> 
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-canvas-border shadow-xs flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
          <input
            type="text"
            placeholder="Search by name, tag, or material..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 py-2.5 text-xs w-full bg-canvas-subtle/50"
          />
          {search && (
            <button 
              type="button" 
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-auto min-w-[160px]">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field py-2.5 text-xs w-full bg-canvas-subtle/50"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-auto min-w-[140px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field py-2.5 text-xs w-full bg-canvas-subtle/50"
          >
            <option value="">All Statuses</option>
            <option value="active">Active (Visible)</option>
            <option value="draft">Draft (Hidden)</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-ink-muted hover:text-terracotta-600 transition-colors"
          >
            <X size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl border border-canvas-border shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-canvas-subtle rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-14 h-14 rounded-2xl bg-canvas-subtle flex items-center justify-center mx-auto text-ink-muted mb-3 border border-canvas-border">
              <Package size={26} />
            </div>
            <h3 className="font-editorial text-xl text-ink font-semibold">No creations found</h3>
            <p className="text-xs text-ink-subtle mt-1 mb-5 max-w-sm mx-auto">
              {hasActiveFilters 
                ? 'Try adjusting your search query or category filters to see more results.' 
                : 'Your atelier catalog is empty. Add your first handcrafted crochet piece.'}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="btn-outline text-xs px-4 py-2"
              >
                Clear all filters
              </button>
            ) : (
              <Link 
                to="/admin/products/new" 
                className="btn-primary inline-flex items-center gap-2 text-xs py-2.5 px-4"
              >
                <Plus size={14} /> Add Product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-canvas-border bg-canvas-subtle/60 text-[11px] font-mono uppercase tracking-wider text-ink-muted">
                  <th className="px-6 py-3.5">Creation</th>
                  <th className="px-4 py-3.5 hidden md:table-cell">Category</th>
                  <th className="px-4 py-3.5">Price</th>
                  <th className="px-4 py-3.5 hidden sm:table-cell">Inventory</th>
                  <th className="px-4 py-3.5 hidden lg:table-cell">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-border text-sm">
                {filteredProducts.map((product) => {
                  const isOut = product.status === PRODUCT_STATUS.OUT_OF_STOCK || product.stock_qty === 0
                  const isLow = product.stock_qty > 0 && product.stock_qty <= 3

                  return (
                    <tr 
                      key={product.id} 
                      className="hover:bg-canvas-subtle/40 transition-colors group"
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-canvas-subtle border border-canvas-border shrink-0 shadow-xs">
                            {product.images?.[0] ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">
                                🧶
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <Link 
                              to={`/admin/products/${product.id}/edit`}
                              className="font-medium text-ink hover:text-terracotta-600 transition-colors truncate block"
                            >
                              {product.name}
                            </Link>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              {product.is_featured && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                                  <Star size={10} fill="currentColor" /> Featured
                                </span>
                              )}
                              {product.is_custom && (
                                <span className="text-[10px] font-medium text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded-md">
                                  Customizable
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-xs text-ink-muted capitalize bg-canvas-subtle px-2.5 py-1 rounded-lg border border-canvas-border font-medium">
                          {product.category?.replace(/_/g, ' ') || 'Unassigned'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4">
                        <div className="font-editorial text-base font-semibold text-ink">
                          ₹{Number(product.price || 0).toLocaleString()}
                        </div>
                        {product.compare_price && product.compare_price > product.price && (
                          <div className="text-[11px] text-ink-subtle line-through">
                            ₹{Number(product.compare_price).toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Stock Level */}
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            isOut ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          <span className={`text-xs font-medium ${
                            isOut ? 'text-rose-600 font-semibold' : isLow ? 'text-amber-700 font-semibold' : 'text-ink-muted'
                          }`}>
                            {isOut ? '0 units' : `${product.stock_qty || 0} units`}
                          </span>
                        </div>
                        {isLow && !isOut && (
                          <span className="text-[10px] text-amber-700 uppercase font-mono block mt-0.5">
                            Low stock
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize inline-block ${
                          product.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : product.status === 'draft' 
                            ? 'bg-zinc-100 text-zinc-600 border border-zinc-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {product.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Star Featured */}
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(product)}
                            title={product.is_featured ? 'Remove from featured homepage' : 'Promote to featured homepage'}
                            className={`p-2 rounded-xl transition-all ${
                              product.is_featured 
                                ? 'text-amber-500 bg-amber-50 hover:bg-amber-100 border border-amber-200' 
                                : 'text-ink-subtle hover:text-ink hover:bg-canvas-subtle'
                            }`}
                          >
                            <Star size={15} fill={product.is_featured ? 'currentColor' : 'none'} />
                          </button>

                          {/* Toggle Active / Draft */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(product)}
                            title={product.status === 'active' ? 'Set to draft (hide)' : 'Publish to shop'}
                            className="p-2 rounded-xl text-ink-subtle hover:text-ink hover:bg-canvas-subtle transition-colors"
                          >
                            {product.status === 'active' ? <Eye size={15} /> : <EyeOff size={15} />}
                          </button>

                          {/* Edit */}
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            title="Edit creation"
                            className="p-2 rounded-xl text-ink-subtle hover:text-ink hover:bg-canvas-subtle transition-colors"
                          >
                            <Edit2 size={15} />
                          </Link>

                          {/* Preview in Storefront */}
                          <Link
                            to={`/shop/${product.id}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Preview on storefront"
                            className="p-2 rounded-xl text-ink-subtle hover:text-ink hover:bg-canvas-subtle transition-colors hidden xl:inline-flex"
                          >
                            <ExternalLink size={15} />
                          </Link>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id, product.name)}
                            disabled={deleting === product.id}
                            title="Delete creation"
                            className="p-2 rounded-xl text-ink-subtle hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                          >
                            {deleting === product.id ? (
                              <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
