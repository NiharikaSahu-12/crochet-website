import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Package, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  FolderTree, 
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
  Edit2
} from 'lucide-react'
import productService from '../../services/productService'
import { PRODUCT_STATUS } from '../../models/Product'
import { useAuth } from '../../context/AuthContext'

function adminNameFromSession(session) {
  const user = session?.user
  const name = user?.user_metadata?.full_name || user?.user_metadata?.name
  if (name) return name
  if (user?.email) return user.email.split('@')[0]
  return 'Curator'
}

export default function AdminDashboard() {
  const { session } = useAuth()
  const adminName = adminNameFromSession(session)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService.getAll()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    const isOut = (product) => product.status === PRODUCT_STATUS.OUT_OF_STOCK || product.stock_qty === 0
    const total = products.length
    const active = products.filter((product) => product.status === PRODUCT_STATUS.ACTIVE && !isOut(product)).length
    const draft = products.filter((product) => product.status === PRODUCT_STATUS.DRAFT).length
    const outOfStock = products.filter(isOut).length
    const featured = products.filter((product) => product.is_featured).length
    const lowStock = products.filter((product) => product.stock_qty > 0 && product.stock_qty <= 3).length

    // Category distribution
    const categoryCounts = {}
    products.forEach((p) => {
      const cat = p.category || 'other'
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
    })

    return { total, active, draft, outOfStock, featured, lowStock, categoryCounts }
  }, [products])

  const recentProducts = products.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Atelier Welcome Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-ink text-white p-8 lg:p-10 shadow-lifted border border-white/5">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-terracotta-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-terracotta-300 text-[11px] font-mono uppercase tracking-widest mb-3 backdrop-blur-xs">
              <Sparkles size={12} />
              <span>TheCozzyLoops Atelier Control</span>
            </div>
            <h1 className="font-editorial text-3xl lg:text-4xl text-white font-medium tracking-tight">
              Welcome back, {adminName}
            </h1>
            <p className="mt-2 text-sm text-zinc-300 leading-relaxed font-light">
              Here is your handmade crochet studio overview. Manage your timeless flower bouquets, 
              custom orders, inventory levels, and storefront curation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-terracotta-600 hover:bg-terracotta-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-subtle"
            >
              <Plus size={16} />
              <span>Add Creation</span>
            </Link>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider transition-colors border border-white/10"
            >
              <span>View Catalog</span>
            </Link>
          </div>
        </div>

        {/* Quick Health Strip */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-zinc-400 block text-[11px] uppercase tracking-wider">Catalog Health</span>
            <span className="font-medium text-white flex items-center gap-1.5 mt-1">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>{stats.outOfStock ? `${stats.outOfStock} items out of stock` : 'All items in stock'}</span>
            </span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[11px] uppercase tracking-wider">Storefront State</span>
            <span className="font-medium text-white flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Live & Accepting Inquiries</span>
            </span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[11px] uppercase tracking-wider">Active Inventory</span>
            <span className="font-medium text-white flex items-center gap-1.5 mt-1">
              <Package size={13} className="text-terracotta-400" />
              <span>{loading ? '...' : `${stats.active} items ready to ship`}</span>
            </span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[11px] uppercase tracking-wider">Featured Curation</span>
            <span className="font-medium text-white flex items-center gap-1.5 mt-1">
              <Sparkles size={13} className="text-amber-400" />
              <span>{loading ? '...' : `${stats.featured} showcased on home`}</span>
            </span>
          </div>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Products */}
        <div className="bg-white rounded-2xl p-6 border border-canvas-border shadow-xs hover:shadow-subtle transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-muted">Total Catalog</span>
            <div className="w-9 h-9 rounded-xl bg-canvas-subtle flex items-center justify-center text-ink">
              <Package size={18} />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-editorial text-3xl font-bold text-ink">
              {loading ? '-' : stats.total}
            </span>
            <p className="mt-1 text-xs text-ink-subtle">
              {stats.draft ? `${stats.draft} currently in draft` : 'All items published'}
            </p>
          </div>
        </div>

        {/* Active In Shop */}
        <div className="bg-white rounded-2xl p-6 border border-canvas-border shadow-xs hover:shadow-subtle transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-muted">Active In Shop</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-editorial text-3xl font-bold text-emerald-700">
              {loading ? '-' : stats.active}
            </span>
            <p className="mt-1 text-xs text-ink-subtle">Available for immediate purchase</p>
          </div>
        </div>

        {/* Featured Atelier Pieces */}
        <div className="bg-white rounded-2xl p-6 border border-canvas-border shadow-xs hover:shadow-subtle transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-muted">Featured Picks</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-editorial text-3xl font-bold text-amber-700">
              {loading ? '-' : stats.featured}
            </span>
            <p className="mt-1 text-xs text-ink-subtle">Highlighted on storefront home</p>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="bg-white rounded-2xl p-6 border border-canvas-border shadow-xs hover:shadow-subtle transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-muted">Stock Alerts</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              stats.lowStock + stats.outOfStock > 0 ? 'bg-rose-50 text-rose-600' : 'bg-canvas-subtle text-ink-muted'
            }`}>
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="mt-4">
            <span className={`font-editorial text-3xl font-bold ${
              stats.lowStock + stats.outOfStock > 0 ? 'text-rose-600' : 'text-ink'
            }`}>
              {loading ? '-' : stats.lowStock + stats.outOfStock}
            </span>
            <p className="mt-1 text-xs text-ink-subtle">
              {stats.outOfStock > 0 ? `${stats.outOfStock} out of stock` : 'Healthy stock levels'}
            </p>
          </div>
        </div>
      </section>

      {/* Two Column Layout: Recent Products & Quick Studio Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Products List (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-canvas-border shadow-xs overflow-hidden">
            <div className="px-6 py-5 border-b border-canvas-border flex items-center justify-between">
              <div>
                <h2 className="font-editorial text-xl font-semibold text-ink">Recent Atelier Additions</h2>
                <p className="text-xs text-ink-subtle mt-0.5">The latest handcrafted creations in your catalog</p>
              </div>
              <Link
                to="/admin/products"
                className="text-xs font-medium text-terracotta-600 hover:text-terracotta-700 inline-flex items-center gap-1 group"
              >
                <span>View all ({products.length})</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-canvas-subtle rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentProducts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-canvas-subtle flex items-center justify-center mx-auto text-ink-muted mb-3">
                  <Package size={22} />
                </div>
                <p className="font-editorial text-lg text-ink">No creations yet</p>
                <p className="text-xs text-ink-subtle mt-1 mb-4">Start creating your first handcrafted product.</p>
                <Link
                  to="/admin/products/new"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ink text-white text-xs font-medium hover:bg-ink-charcoal transition-colors"
                >
                  <Plus size={14} /> Add Product
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-canvas-border">
                {recentProducts.map((product) => {
                  const isOut = product.status === PRODUCT_STATUS.OUT_OF_STOCK || product.stock_qty === 0
                  const isLow = product.stock_qty > 0 && product.stock_qty <= 3

                  return (
                    <div 
                      key={product.id}
                      className="p-4 sm:p-5 flex items-center gap-4 hover:bg-canvas-subtle/50 transition-colors"
                    >
                      {/* Image */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-canvas-subtle border border-canvas-border shrink-0">
                        {product.images?.[0] ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-ink-muted">
                            🧶
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-ink truncate">{product.name}</p>
                          {product.is_featured && (
                            <span className="shrink-0 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-medium">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-ink-subtle">
                          <span className="capitalize">{product.category?.replace(/_/g, ' ') || 'General'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isOut ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                            }`} />
                            <span className={isOut ? 'text-rose-600 font-medium' : isLow ? 'text-amber-600' : ''}>
                              {isOut ? 'Out of Stock' : `${product.stock_qty || 0} in stock`}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="text-right shrink-0 flex items-center gap-4">
                        <div>
                          <p className="font-editorial text-base font-semibold text-ink">
                            ₹{Number(product.price || 0).toLocaleString()}
                          </p>
                          <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${
                            product.status === 'active' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : product.status === 'draft'
                              ? 'bg-zinc-100 text-zinc-600'
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {product.status}
                          </span>
                        </div>
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-2 rounded-xl text-ink-subtle hover:text-ink hover:bg-canvas border border-transparent hover:border-canvas-border transition-colors"
                          title="Edit creation"
                        >
                          <Edit2 size={15} />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Studio Tools & Category Distribution */}
        <div className="space-y-6">
          {/* Quick Studio Navigation */}
          <div className="bg-white rounded-2xl border border-canvas-border p-6 shadow-xs">
            <h3 className="font-editorial text-lg font-semibold text-ink mb-1">Studio Shortcuts</h3>
            <p className="text-xs text-ink-subtle mb-4">Quick pathways to manage your workshop</p>

            <div className="space-y-2.5">
              <Link
                to="/admin/products/new"
                className="flex items-center justify-between p-3 rounded-xl bg-canvas-subtle hover:bg-terracotta-50 hover:text-terracotta-800 transition-colors group text-xs font-medium text-ink"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-canvas-border flex items-center justify-center text-terracotta-600">
                    <Plus size={15} />
                  </div>
                  <span>Add New Product</span>
                </div>
                <ArrowRight size={14} className="text-ink-subtle group-hover:text-terracotta-600 transition-colors" />
              </Link>

              <Link
                to="/admin/categories"
                className="flex items-center justify-between p-3 rounded-xl bg-canvas-subtle hover:bg-amber-50 hover:text-amber-900 transition-colors group text-xs font-medium text-ink"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-canvas-border flex items-center justify-center text-amber-600">
                    <FolderTree size={15} />
                  </div>
                  <span>Manage Categories</span>
                </div>
                <ArrowRight size={14} className="text-ink-subtle group-hover:text-amber-600 transition-colors" />
              </Link>

              <Link
                to="/custom-orders"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-canvas-subtle hover:bg-purple-50 hover:text-purple-900 transition-colors group text-xs font-medium text-ink"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-canvas-border flex items-center justify-center text-purple-600">
                    <Sparkles size={15} />
                  </div>
                  <span>Custom Orders Studio</span>
                </div>
                <ExternalLink size={14} className="text-ink-subtle group-hover:text-purple-600 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl border border-canvas-border p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-editorial text-lg font-semibold text-ink">Catalog Breakdown</h3>
                <p className="text-xs text-ink-subtle">Product distribution by collection</p>
              </div>
              <Layers size={17} className="text-ink-subtle" />
            </div>

            <div className="space-y-3">
              {Object.entries(stats.categoryCounts).map(([cat, count]) => {
                const percent = stats.total ? Math.round((count / stats.total) * 100) : 0
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="capitalize text-ink">{cat.replace(/_/g, ' ')}</span>
                      <span className="text-ink-muted">{count} items ({percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-canvas-subtle overflow-hidden">
                      <div 
                        className="h-full bg-terracotta-500 rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Atelier Curator Note */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-5 text-xs text-amber-900 leading-relaxed">
            <div className="flex items-center gap-2 font-semibold text-amber-950 mb-1.5">
              <Sparkles size={14} className="text-amber-700" />
              <span>Curator Note</span>
            </div>
            High-resolution photography, clear yarn material details (like Milk Cotton), and responsive 
            WhatsApp contact links directly increase customer trust and custom order volume.
          </div>
        </div>
      </div>
    </div>
  )
}
