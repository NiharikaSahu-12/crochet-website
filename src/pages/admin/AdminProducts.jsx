import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Star, Eye, EyeOff, Search } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import productController from '../../controllers/productController'
import { PRODUCT_CATEGORIES } from '../../models/Product'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const { products, loading, refetch } = useProducts({ search: search || undefined, category: category || undefined })
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await productController.deleteProduct(id)
      toast.success('Product deleted')
      refetch()
    } catch (err) {
      toast.error('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  const handleToggleFeatured = async (product) => {
    try {
      await productController.toggleFeatured(product.id, product.is_featured)
      toast.success(product.is_featured ? 'Removed from featured' : 'Added to featured')
      refetch()
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleToggleStatus = async (product) => {
    try {
      await productController.toggleStatus(product.id, product.status)
      toast.success('Status updated')
      refetch()
    } catch {
      toast.error('Failed to update')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-yarn-dark">Products</h2>
        <Link to="/admin/products/new" className="btn-primary inline-flex items-center gap-2 text-sm py-2.5">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap bg-white p-4 rounded-2xl border border-gray-100">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 py-2.5 text-sm"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field py-2.5 text-sm w-auto"
        >
          <option value="">All Categories</option>
          {PRODUCT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🧶</div>
            <h3 className="font-display text-xl text-yarn-dark mb-2">No products found</h3>
            <p className="text-gray-400 mb-4">Add your first product to get started.</p>
            <Link to="/admin/products/new" className="btn-primary inline-flex items-center gap-2 text-sm">
              <Plus size={14} /> Add Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Price</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">Stock</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-blush-100 flex-shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : <div className="w-full h-full flex items-center justify-center text-xl">🧶</div>}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-yarn-dark text-sm truncate max-w-40">{product.name}</p>
                          {product.is_featured && (
                            <span className="text-xs text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">⭐ Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2.5 py-1 rounded-full">
                        {product.category?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-yarn-blush text-sm">₹{product.price.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className={`text-sm font-medium ${product.stock_qty === 0 ? 'text-red-500' : product.stock_qty <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {product.stock_qty}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        product.status === 'active' ? 'bg-green-100 text-green-700' :
                        product.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                        'bg-red-100 text-red-600'
                      }`}>{product.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          title={product.is_featured ? 'Remove from featured' : 'Add to featured'}
                          className={`p-2 rounded-lg transition-colors ${product.is_featured ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                          <Star size={15} fill={product.is_featured ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(product)}
                          title={product.status === 'active' ? 'Set to draft' : 'Set to active'}
                          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                        >
                          {product.status === 'active' ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-2 rounded-lg text-blue-400 hover:bg-blue-50 transition-colors"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleting === product.id}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {deleting === product.id
                            ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                            : <Trash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
