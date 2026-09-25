import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Search, ShoppingBag, Heart, Menu, X, Wand2, Sparkles, ArrowRight, ShieldCheck, RefreshCw, Feather } from 'lucide-react'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { useShop } from '../../context/ShopContext'
import { INSTAGRAM_HANDLE, WHATSAPP_NUMBER, EMAIL } from '../../utils/instagram'
import CartDrawer from '../shop/CartDrawer'
import WishlistDrawer from '../shop/WishlistDrawer'
import QuickLookModal from '../shop/QuickLookModal'
import CustomStudioModal from '../shop/CustomStudioModal'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop All' },
  { to: '/custom-orders', label: 'Custom Orders' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact & Help' },
]

function AnnouncementBar() {
  return (
    <div className="bg-ink text-white/90 text-[11px] font-mono tracking-editorial uppercase py-2.5 px-4 text-center border-b border-white/10 overflow-hidden">
      <div className="flex items-center justify-center gap-3">
        <span>100% Handcrafted with Hook</span>
        <span className="text-terracotta-400">·</span>
        <span className="hidden sm:inline">Complimentary Handwritten Card &amp; Wax Seal</span>
        <span className="hidden sm:inline text-terracotta-400">·</span>
        <span>Custom Colors &amp; Bouquets Available</span>
      </div>
    </div>
  )
}

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { cartCount, wishlist, setIsCartOpen, setIsWishlistOpen } = useShop()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'glass-header border-b border-canvas-border shadow-xs' 
        : 'bg-canvas/95 border-b border-canvas-border/60'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-canvas-border group-hover:border-terracotta-500 transition-colors shadow-2xs">
              <img 
                src="/logo.jpeg" 
                alt="TheCozzyLoops" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div className="w-full h-full bg-terracotta-600 items-center justify-center text-white font-editorial font-bold text-sm hidden">
                CL
              </div>
            </div>
            <div>
              <span className="font-editorial text-2xl font-bold tracking-tight text-ink group-hover:text-terracotta-700 transition-colors">
                TheCozzyLoops
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label }) => {
              const active = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`text-sm tracking-wide transition-colors relative py-1.5 ${
                    active 
                      ? 'text-terracotta-700 font-semibold' 
                      : 'text-ink-muted hover:text-ink font-normal'
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta-600 rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2.5 rounded-full text-ink-muted hover:text-ink hover:bg-canvas-subtle transition-colors relative"
              aria-label="View saved items"
              title="Saved Items"
            >
              <Heart size={20} className={wishlist.length > 0 ? 'fill-terracotta-600 text-terracotta-600' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-terracotta-600 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-2 bg-ink hover:bg-ink-charcoal text-white px-4 py-2.5 rounded-full text-xs font-semibold transition-all shadow-xs"
              aria-label="Open shopping bag"
            >
              <ShoppingBag size={15} />
              <span>Bag</span>
              <span className="font-mono bg-white/20 px-1.5 py-0.2 rounded-full text-[11px] ml-0.5">{cartCount}</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-ink-muted hover:text-ink hover:bg-canvas-subtle transition-colors ml-1"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-canvas-border bg-white px-6 py-5 space-y-4 animate-fade-up">
          <div className="space-y-2">
            {NAV_LINKS.map(({ to, label }) => {
              const active = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`block py-2 text-base transition-colors ${
                    active ? 'text-terracotta-700 font-semibold' : 'text-ink-muted'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          <div className="pt-3 border-t border-canvas-border flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                openCustomStudio()
              }}
              className="btn-primary w-full text-xs py-3"
            >
              <Wand2 size={15} />
              <span>Make a Custom Order</span>
            </button>

            <div className="flex gap-2">
              <a
                href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn-outline text-xs py-2.5 flex items-center justify-center gap-1.5"
              >
                <FaInstagram size={14} />
                <span>Instagram</span>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-full text-xs py-2.5 transition-colors font-medium"
              >
                <FaWhatsapp size={14} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function ModernFooter() {
  return (
    <footer className="bg-[#121214] text-[#E4E4E7] border-t border-white/10 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-14 pb-16 border-b border-white/10">
          
          {/* Brand info */}
          <div className="lg:col-span-5 space-y-5">
            <div className="font-editorial text-3xl font-bold text-white tracking-tight">
              TheCozzyLoops
            </div>
            <p className="text-xs font-mono tracking-editorial uppercase text-terracotta-400 font-medium">
              Handmade Crochet Atelier · Odisha, India
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm font-light">
              Crafted with delicate loops, warm hearts, and ultra-soft milk cotton yarn. Every piece is an everlasting keepsake created to brighten your books, desks, and special gifts.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-colors"
                aria-label="Instagram profile"
              >
                <FaInstagram size={17} />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] transition-colors"
                aria-label="WhatsApp direct chat"
              >
                <FaWhatsapp size={17} />
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="text-xs text-zinc-400 hover:text-white transition-colors pl-2"
              >
                {EMAIL}
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono tracking-editorial uppercase text-white font-semibold">
              Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link to="/shop?category=bouquets" className="hover:text-white transition-colors">
                  Bouquets &amp; Pots
                </Link>
              </li>
              <li>
                <Link to="/shop?category=flowers" className="hover:text-white transition-colors">
                  Floral Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/shop?category=keychains" className="hover:text-white transition-colors">
                  Keychains &amp; Charms
                </Link>
              </li>
              <li>
                <Link to="/custom-orders" className="hover:text-white transition-colors text-terracotta-400 font-medium">
                  Custom Orders Studio
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  All Handmade Pieces
                </Link>
              </li>
            </ul>
          </div>

          {/* Ethos & Care */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono tracking-editorial uppercase text-white font-semibold">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Care &amp; Washing Guide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link to="/about#yarn-studio" className="hover:text-white transition-colors">
                  Yarn Library
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Niharika
                </Link>
              </li>
            </ul>
          </div>

          {/* Custom Gifting Card */}
          <div className="lg:col-span-3 bg-white/5 rounded-2xl border border-white/10 p-6 space-y-3.5">
            <div className="flex items-center gap-2 text-terracotta-400 text-xs font-mono uppercase tracking-wider font-semibold">
              <Sparkles size={14} />
              <span>Gifts &amp; Favors</span>
            </div>
            <p className="font-editorial text-lg text-white font-medium leading-snug">
              Looking for wedding favors or event gifts?
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              We create bulk floral bouquets, personalized initial charms, and customized palette gift boxes.
            </p>
            <Link
              to="/custom-orders"
              className="mt-2 block text-center w-full py-3 px-4 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-semibold tracking-wide transition-colors shadow-xs"
            >
              Start a Custom Order
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-light">
          <p>© {new Date().getFullYear()} TheCozzyLoops. All rights reserved. Handcrafted by Niharika.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link to="/custom-orders" className="hover:text-white transition-colors">
              Custom Orders
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact &amp; FAQs
            </Link>
            <Link to="/admin/login" className="hover:text-white transition-colors font-mono opacity-50 hover:opacity-100">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function ShopLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink selection:bg-terracotta-200 selection:text-terracotta-900">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <ModernFooter />

      {/* Global Interactive Overlays */}
      <CartDrawer />
      <WishlistDrawer />
      <QuickLookModal />
      <CustomStudioModal />
    </div>
  )
}
