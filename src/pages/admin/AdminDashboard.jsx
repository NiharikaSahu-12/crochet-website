import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaBox, FaStar } from 'react-icons/fa'
import { MdTrendingUp, MdAdd, MdArrowForward } from 'react-icons/md'
import productService from '../../services/productService'
import { PRODUCT_STATUS } from '../../models/Product'

function StatCard({ icon: Icon, title, value, color, sub }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
        <Icon size={22} className="text-white" />
      </div>
      <p className="text-3xl font-display font-bold text-yarn-dark">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{title}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, featured: 0, outOfStock: 0 })
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      productService.getAll(),
      productService.getAll({ status: PRODUCT_STATUS.ACTIVE }),
      productService.getAll({ featured: true }),
    ]).then(([all, active, featured]) => {
      setStats({
        total: all.length,
        active: active.length,
        featured: featured.length,
        outOfStock: all.filter(p => p.stock_qty === 0).length,
      })
      setRecentProducts(all.slice(0, 5))
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-yarn-dark">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back to TheCozzyLoops admin!</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary inline-flex items-center gap-2 text-sm py-2.5">
          <MdAdd size={16} /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FaBox} title="Total Products" value={loading ? '—' : stats.total} color="bg-blue-500" />
        <StatCard icon={MdTrendingUp} title="Active Products" value={loading ? '—' : stats.active} color="bg-green-500" />
        <StatCard icon={FaStar} title="Featured" value={loading ? '—' : stats.featured} color="bg-yellow-500" />
        <StatCard icon={FaBox} title="Out of Stock" value={loading ? '—' : stats.outOfStock} color="bg-red-400" sub="Need restocking" />
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/admin/products/new" className="bg-gradient-to-br from-yarn-blush to-blush-700 text-white rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
          <MdAdd size={24} className="mb-3" />
          <h3 className="font-display text-lg font-semibold">Add New Product</h3>
          <p className="text-blush-100 text-sm mt-1">Upload images, set price & details</p>
        </Link>
        <Link to="/admin/products" className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
          <FaBox size={24} className="mb-3 text-yarn-blush" />
          <h3 className="font-display text-lg font-semibold text-yarn-dark">Manage Products</h3>
          <p className="text-gray-400 text-sm mt-1">Edit, delete, toggle visibility</p>
        </Link>
      </div>

      {/* Recent products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-display text-lg text-yarn-dark">Recent Products</h3>
          <Link to="/admin/products" className="text-sm text-yarn-blush hover:underline flex items-center gap-1">
            View All <MdArrowForward size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🧶</div>
            <p className="text-gray-400">No products yet. Add your first one!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentProducts.map(p => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-blush-100 overflow-hidden flex-shrink-0">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🧶</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-yarn-dark text-sm truncate">{p.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{p.category?.replace(/_/g, ' ')}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-yarn-blush text-sm">₹{p.price.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    p.status === 'active' ? 'bg-green-100 text-green-600' :
                    p.status === 'draft' ? 'bg-gray-100 text-gray-500' :
                    'bg-red-100 text-red-500'
                  }`}>{p.status}</span>
                </div>
                <Link to={`/admin/products/${p.id}/edit`} className="text-yarn-blush hover:text-blush-700 text-xs font-medium ml-2">
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
