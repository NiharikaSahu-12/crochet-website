import { useEffect, useMemo, useState } from 'react'
import { FaBox, FaStar } from 'react-icons/fa'
import { MdInventory, MdTrendingUp } from 'react-icons/md'
import { Activity, PackageCheck } from 'lucide-react'
import productService from '../../services/productService'
import { PRODUCT_STATUS } from '../../models/Product'
import { useAuth } from '../../context/AuthContext'

function adminNameFromSession(session) {
  const user = session?.user
  const name = user?.user_metadata?.full_name || user?.user_metadata?.name
  if (name) return name
  if (user?.email) return user.email.split('@')[0]
  return 'Admin'
}

function getPercent(value, total) {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

function KpiCard({ icon: Icon, label, value, helper, accent }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
          <Icon size={20} aria-hidden="true" />
        </div>
        <p className="font-display text-3xl font-semibold text-yarn-dark">{value}</p>
      </div>
      <p className="mt-4 text-sm font-semibold text-yarn-dark">{label}</p>
      <p className="mt-1 text-xs text-gray-500">{helper}</p>
    </div>
  )
}

function RecentProducts({ loading, products }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blush-50 text-yarn-blush">
          <Activity size={19} aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-display text-xl text-yarn-dark">Recent Products</h3>
          <p className="text-sm text-gray-500">Latest catalog entries</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 p-5">
          {[1, 2, 3].map((item) => <div key={item} className="h-16 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="p-10 text-center">
          <PackageCheck size={28} className="mx-auto text-yarn-blush" aria-hidden="true" />
          <p className="mt-3 font-display text-lg text-yarn-dark">No products yet</p>
          <p className="mt-1 text-sm text-gray-500">Recent products will appear here.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {products.map((product) => (
            <div key={product.id} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 p-4 transition hover:bg-blush-50/60">
              <div className="h-12 w-12 overflow-hidden rounded-xl bg-blush-100">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-yarn-blush">Img</div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-yarn-dark">{product.name}</p>
                <p className="mt-0.5 text-xs capitalize text-gray-400">{product.category?.replace(/_/g, ' ')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-yarn-blush">Rs {product.price.toLocaleString()}</p>
                <p className="mt-0.5 text-xs capitalize text-gray-400">{product.status.replace(/_/g, ' ')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
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
    const draft = products.filter((product) => product.status === PRODUCT_STATUS.DRAFT && !isOut(product)).length
    const outOfStock = products.filter(isOut).length
    const featured = products.filter((product) => product.is_featured).length
    const lowStock = products.filter((product) => product.stock_qty > 0 && product.stock_qty <= 3).length

    return { total, active, draft, outOfStock, featured, lowStock }
  }, [products])

  const recentProducts = products.slice(0, 5)
  const catalogMessage = loading
    ? 'Loading catalog data'
    : stats.total
      ? `${stats.active} active, ${stats.draft} draft, ${stats.outOfStock} out of stock`
      : 'Catalog is empty'

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yarn-blush to-yarn-gold text-white shadow-sm">
              <span className="font-display text-2xl font-semibold">{adminName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-yarn-blush">Dashboard</p>
              <h2 className="mt-1 font-display text-3xl text-yarn-dark">Welcome, {adminName}</h2>
              <p className="mt-1 text-sm text-gray-500">{catalogMessage}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blush-50 to-[#fff4d8] px-5 py-4 text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Catalog health</p>
            <p className="mt-1 font-display text-2xl font-semibold text-yarn-dark">
              {loading ? 'Loading' : stats.outOfStock || stats.lowStock ? 'Review stock' : 'Ready'}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard icon={FaBox} label="Total Products" value={loading ? '-' : stats.total} helper="All catalog items" accent="bg-blush-50 text-yarn-blush" />
        <KpiCard icon={MdTrendingUp} label="Active Products" value={loading ? '-' : stats.active} helper="Visible in shop" accent="bg-green-50 text-green-600" />
        <KpiCard icon={FaStar} label="Featured Picks" value={loading ? '-' : stats.featured} helper="Homepage products" accent="bg-[#fff4d8] text-yarn-gold" />
        <KpiCard icon={MdInventory} label="Stock Alerts" value={loading ? '-' : stats.lowStock + stats.outOfStock} helper="Low or out of stock" accent="bg-red-50 text-red-500" />
      </section>

      <section>
        <RecentProducts loading={loading} products={recentProducts} />
      </section>
    </div>
  )
}
