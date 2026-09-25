import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X, 
  Plus, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import toast from 'react-hot-toast'

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/products', label: 'Products & Inventory', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { session } = useAuth()

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      navigate('/admin/login')
      toast.success('Signed out of Atelier Console')
    } catch {
      toast.error('Sign out failed')
    }
  }

  const isActive = (link) => 
    link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to)

  const currentNav = ADMIN_NAV.find(n => isActive(n)) || { label: 'Atelier Console' }
  const adminEmail = session?.user?.email || 'admin@thecozzyloops.com'
  const adminInitial = adminEmail.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-canvas flex font-sans antialiased text-ink selection:bg-terracotta-100 selection:text-terracotta-900">
      {/* Sidebar Desktop & Mobile */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-ink text-white flex flex-col transition-all duration-300 ease-in-out border-r border-white/5
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto`}
      >
        {/* Brand Header */}
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta-500/20 border border-terracotta-400/30 flex items-center justify-center text-terracotta-400 shadow-xs">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="font-editorial text-lg tracking-wide text-white leading-none">TheCozzyLoops</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Atelier Studio</span>
              </div>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Action */}
        <div className="px-5 pt-5 pb-2">
          <Link
            to="/admin/products/new"
            onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-terracotta-600 hover:bg-terracotta-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-subtle"
          >
            <Plus size={15} />
            <span>New Creation</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">
            Management
          </div>
          {ADMIN_NAV.map(({ to, label, icon: Icon, exact }) => {
            const active = isActive({ to, exact })
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 group ${
                  active
                    ? 'bg-white/10 text-white font-medium shadow-xs border border-white/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={17} className={active ? 'text-terracotta-400' : 'text-zinc-400 group-hover:text-zinc-200'} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={14} className="text-zinc-400" />}
              </Link>
            )
          })}

          <div className="pt-5 px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">
            Storefront
          </div>
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
          >
            <ExternalLink size={17} className="text-zinc-400 group-hover:text-zinc-200" />
            <span className="flex-1">Live Storefront</span>
            <span className="text-[10px] text-zinc-400 border border-zinc-700 rounded px-1.5 py-0.5">tab</span>
          </Link>
        </nav>

        {/* Staff Profile & Footer */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 mb-3">
            <div className="w-9 h-9 rounded-lg bg-terracotta-500 text-white font-semibold flex items-center justify-center text-sm shadow-xs shrink-0">
              {adminInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate">{adminEmail}</p>
              <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                <ShieldCheck size={11} className="text-terracotta-400" />
                <span>Store Curator</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 text-xs font-medium transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out of Atelier</span>
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-ink/70 backdrop-blur-xs z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-canvas-border px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-canvas-subtle transition-colors border border-canvas-border"
            >
              <Menu size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs text-ink-subtle">
                <span>Atelier Studio</span>
                <ChevronRight size={12} />
                <span className="text-ink font-medium">{currentNav.label}</span>
              </div>
              <h1 className="font-editorial text-xl font-semibold text-ink tracking-tight mt-0.5">
                {currentNav.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-canvas-border bg-white text-ink-muted hover:text-ink hover:border-ink/20 text-xs font-medium transition-colors shadow-xs"
            >
              <ExternalLink size={13} />
              <span>View Store</span>
            </Link>

            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink hover:bg-ink-charcoal text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-subtle"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
