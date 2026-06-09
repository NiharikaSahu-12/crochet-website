import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { MdCategory, MdDashboard, MdLogout, MdChevronRight, MdClose } from 'react-icons/md'
import { FaBox, FaBars } from 'react-icons/fa'
import { RiAdminFill } from "react-icons/ri";
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import toast from 'react-hot-toast'

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: MdDashboard, exact: true },
  { to: '/admin/products', label: 'Products', icon: FaBox },
  { to: '/admin/categories', label: 'Categories', icon: MdCategory },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      navigate('/admin/login')
      toast.success('Signed out')
    } catch {
      toast.error('Sign out failed')
    }
  }

  const isActive = (link) => link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-yarn-dark shadow-xl transform transition-transform duration-300 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
            <div className="w-9 h-9 bg-gradient-to-br from-yarn-pink to-yarn-blush rounded-xl flex items-center justify-center">
              <RiAdminFill size={18} className="text-white" />
            </div>
            <div>
              <p className="font-display text-white font-bold"></p>
              <p className="text-xs text-blush-300">Admin Panel</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-blush-300 hover:text-white">
              <MdClose size={18} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {ADMIN_NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive({ to, exact: to === '/admin' })
                    ? 'bg-yarn-blush text-white shadow-sm'
                    : 'text-blush-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{label}</span>
                {isActive({ to, exact: to === '/admin' }) && (
                  <MdChevronRight size={14} className="ml-auto" />
                )}
              </Link>
            ))}
          </nav>

          {/* Sign out */}
          <div className="px-4 pb-6">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-blush-300 hover:bg-white/10 hover:text-white transition-all text-sm mb-2">
              Visit Shop
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
            >
              <MdLogout size={18} />
              <span className="font-medium text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <FaBars size={20} />
          </button>
          <h1 className="font-display text-xl text-yarn-dark">
            {ADMIN_NAV.find(n => isActive({ to: n.to, exact: n.to === '/admin' }))?.label || 'Admin'}
          </h1>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
