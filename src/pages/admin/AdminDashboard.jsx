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
  Layers,
  Edit2,
  Star,
} from 'lucide-react'
import productService from '../../services/productService'
import { PRODUCT_STATUS } from '../../models/Product'
import { useAuth } from '../../context/AuthContext'

const BAR_PALETTE = [
  'bg-terracotta-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-rose-500',
  'bg-sky-500',
]

function adminNameFromSession(session) {
  const user = session?.user
  const name = user?.user_metadata?.full_name || user?.user_metadata?.name
  if (name) return name
  if (user?.email) return user.email.split('@')[0]
  return 'Curator'
}

function StatCard({ label, value, sub, icon: Icon, tone, bar, barPct, loading }) {
  return (
    <div className="group relative bg-surface rounded-2xl p-5 border border-canvas-border shadow-xs hover:shadow-lifted hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tone}`}>
          <Icon size={17} />
        </div>
      </div>

      <div className="mt-3">
        {loading ? (
          <div className="h-9 w-16 rounded-lg bg-canvas-subtle skeleton-shimmer" />
        ) : (
          <span className="font-editorial text-4xl font-bold text-ink leading-none">{value}</span>
        )}
        <p className="mt-2 text-xs text-ink-subtle">{sub}</p>
      </div>

      <div className="mt-4 h-1 rounded-full bg-canvas-subtle overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${bar}`}
          style={{ width: `${loading ? 0 : barPct}%` }}
        />
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { session } = useAuth()
  const adminName = adminNameFromSession(session)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService
      .getAll()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    const isOut = (product) => product.status === PRODUCT_STATUS.OUT_OF_STOCK || product.stock_qty === 0
    const total = products.length
    const active = products.filter((p) => p.status === PRODUCT_STATUS.ACTIVE && !isOut(p)).length
    const draft = products.filter((p) => p.status === PRODUCT_STATUS.DRAFT).length
    const outOfStock = products.filter(isOut).length
    const featured = products.filter((p) => p.is_featured).length
    const lowStock = products.filter((p) => p.stock_qty > 0 && p.stock_qty <= 3).length

    const categoryCounts = {}
    products.forEach((p) => {
      const cat = p.category || 'other'
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
    })

    return { total, active, draft, outOfStock, featured, lowStock, categoryCounts }
  }, [products])

  const recentProducts = products.slice(0, 5)
  const pct = (n) => (stats.total ? Math.round((n / stats.total) * 100) : 0)

  return (
    <div className="space-y-7">
      {/* Welcome hero */}
      <section className="relative overflow-hidden rounded-3xl bg-elevated text-white p-8 lg:p-10 shadow-lifted border border-white/5">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-terracotta-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-terracotta-300 text-[11px] font-mono uppercase tracking-widest mb-4 backdrop-blur-xs">
                <Sparkles size={12} />
                <span>TheCozzyLoops Admin Control</span>
              </div>
              <h1 className="font-editorial text-3xl lg:text-4xl text-white font-semibold tracking-tight">
                Welcome back, {adminName}
              </h1>
              <p className="mt-2.5 text-sm text-zinc-300 leading-relaxed font-light max-w-xl">
                Your handmade crochet studio at a glance — bouquets, custom orders, inventory
                levels, and storefront curation in one place.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/admin/products"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider transition-colors border border-white/10"
                >
                  <Package size={14} />
                  <span>View Catalog</span>
                </Link>
                <Link
                  to="/admin/reviews"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-subtle"
                >
                  <Star size={14} />
                  <span>Moderate Reviews</span>
                </Link>
              </div>
            </div>

            {/* Live status dial */}
            <div className="shrink-0 flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="relative w-12 h-12">
                <span className="absolute inset-0 rounded-full border-2 border-emerald-400/30" />
                <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 animate-spin" style={{ animationDuration: '2.4s' }} />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </span>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Storefront</div>
                <div className="text-sm font-semibold text-white mt-0.5">Live &amp; Accepting Orders</div>
              </div>
            </div>
          </div>

          {/* Health strip */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-y-5 md:divide-x md:divide-white/10 text-xs">
            <div className="md:pr-6">
              <span className="text-zinc-400 block text-[11px] uppercase tracking-wider">Catalog Health</span>
              <span className="font-medium text-white flex items-center gap-1.5 mt-1.5">
                <CheckCircle2 size={13} className={stats.outOfStock ? 'text-rose-400' : 'text-emerald-400'} />
                <span>{loading ? '—' : stats.outOfStock ? `${stats.outOfStock} out of stock` : 'All items in stock'}</span>
              </span>
            </div>
            <div className="md:px-6">
              <span className="text-zinc-400 block text-[11px] uppercase tracking-wider">Ready to Ship</span>
              <span className="font-medium text-white flex items-center gap-1.5 mt-1.5">
                <Package size={13} className="text-terracotta-400" />
                <span>{loading ? '—' : `${stats.active} items`}</span>
              </span>
            </div>
            <div className="md:px-6">
              <span className="text-zinc-400 block text-[11px] uppercase tracking-wider">Featured</span>
              <span className="font-medium text-white flex items-center gap-1.5 mt-1.5">
                <Sparkles size={13} className="text-amber-400" />
                <span>{loading ? '—' : `${stats.featured} on home`}</span>
              </span>
            </div>
            <div className="md:pl-6">
              <span className="text-zinc-400 block text-[11px] uppercase tracking-wider">Drafts</span>
              <span className="font-medium text-white flex items-center gap-1.5 mt-1.5">
                <Edit2 size={13} className="text-zinc-400" />
                <span>{loading ? '—' : `${stats.draft} unpublished`}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* KPI grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Catalog"
          value={stats.total}
          sub={stats.draft ? `${stats.draft} in draft` : 'All published'}
          icon={Package}
          tone="bg-canvas-subtle text-ink"
          bar="bg-terracotta-500"
          barPct={100}
          loading={loading}
        />
        <StatCard
          label="Active In Shop"
          value={stats.active}
          sub="Available to purchase"
          icon={TrendingUp}
          tone="bg-emerald-50 text-emerald-600"
          bar="bg-emerald-500"
          barPct={pct(stats.active)}
          loading={loading}
        />
        <StatCard
          label="Featured Picks"
          value={stats.featured}
          sub="Shown on storefront"
          icon={Sparkles}
          tone="bg-amber-50 text-amber-600"
          bar="bg-amber-500"
          barPct={pct(stats.featured)}
          loading={loading}
        />
        <StatCard
          label="Stock Alerts"
          value={stats.lowStock + stats.outOfStock}
          sub={stats.outOfStock ? `${stats.outOfStock} out of stock` : 'Healthy levels'}
          icon={AlertCircle}
          tone={stats.lowStock + stats.outOfStock > 0 ? 'bg-rose-50 text-rose-600' : 'bg-canvas-subtle text-ink-muted'}
          bar="bg-rose-500"
          barPct={pct(stats.lowStock + stats.outOfStock)}
          loading={loading}
        />
      </section>

      {/* Two column body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Recent products */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-2xl border border-canvas-border shadow-xs overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-canvas-border flex items-center justify-between">
              <div>
                <h2 className="font-editorial text-xl font-semibold text-ink">Recent Additions</h2>
                <p className="text-xs text-ink-subtle mt-0.5">Latest handcrafted creations in your catalog</p>
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
                  <div key={i} className="h-16 bg-canvas-subtle rounded-xl skeleton-shimmer" />
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-elevated text-white text-xs font-medium hover:bg-elevated-2 transition-colors"
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
                    <div key={product.id} className="p-4 sm:p-5 flex items-center gap-4 hover:bg-canvas-subtle/50 transition-colors">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-canvas-subtle border border-canvas-border shrink-0">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-ink-muted">🧶</div>
                        )}
                      </div>

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
                            <span className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                            <span className={isOut ? 'text-rose-600 font-medium' : isLow ? 'text-amber-600' : ''}>
                              {isOut ? 'Out of Stock' : `${product.stock_qty || 0} in stock`}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex items-center gap-3">
                        <div>
                          <p className="font-editorial text-base font-semibold text-ink">
                            ₹{Number(product.price || 0).toLocaleString()}
                          </p>
                          <span
                            className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${
                              product.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700'
                                : product.status === 'draft'
                                ? 'bg-canvas-muted text-ink-muted'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
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

        {/* Right rail */}
        <div className="space-y-6">
          {/* Shortcuts as tiles */}
          <div className="bg-surface rounded-2xl border border-canvas-border p-5 shadow-xs">
            <h3 className="font-editorial text-lg font-semibold text-ink mb-1">Studio Shortcuts</h3>
            <p className="text-xs text-ink-subtle mb-4">Quick pathways to manage your workshop</p>

            <div className="grid grid-cols-1 gap-2.5">
              <Link
                to="/admin/reviews"
                className="flex items-center justify-between p-3 rounded-xl bg-canvas-subtle hover:bg-terracotta-50 hover:text-terracotta-800 transition-colors group text-xs font-medium text-ink"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-canvas-border flex items-center justify-center text-terracotta-600">
                    <Star size={15} />
                  </div>
                  <span>Reviews &amp; Ratings</span>
                </div>
                <ArrowRight size={14} className="text-ink-subtle group-hover:text-terracotta-600 transition-colors" />
              </Link>

              <Link
                to="/admin/categories"
                className="flex items-center justify-between p-3 rounded-xl bg-canvas-subtle hover:bg-amber-50 hover:text-amber-900 transition-colors group text-xs font-medium text-ink"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-canvas-border flex items-center justify-center text-amber-600">
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
                  <div className="w-8 h-8 rounded-lg bg-surface border border-canvas-border flex items-center justify-center text-purple-600">
                    <Sparkles size={15} />
                  </div>
                  <span>Custom Orders Studio</span>
                </div>
                <ExternalLink size={14} className="text-ink-subtle group-hover:text-purple-600 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="bg-surface rounded-2xl border border-canvas-border p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-editorial text-lg font-semibold text-ink">Catalog Breakdown</h3>
                <p className="text-xs text-ink-subtle">Distribution by collection</p>
              </div>
              <Layers size={17} className="text-ink-subtle" />
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-canvas-subtle rounded-lg skeleton-shimmer" />
                ))}
              </div>
            ) : (
              <div className="space-y-3.5">
                {Object.entries(stats.categoryCounts).map(([cat, count], i) => {
                  const percent = pct(count)
                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="capitalize text-ink">{cat.replace(/_/g, ' ')}</span>
                        <span className="text-ink-muted">{count} · {percent}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-canvas-subtle overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${BAR_PALETTE[i % BAR_PALETTE.length]}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
