import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FaBars, FaInstagram, FaHeart, FaEnvelope, FaWhatsapp } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import { INSTAGRAM_HANDLE, INSTAGRAM_DM_URL, EMAIL, WHATSAPP_NUMBER, getWhatsAppOrderUrl } from '../../utils/instagram'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setOpen(false), [location])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-sm border-b border-blush-100' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-yarn-blush/30 group-hover:ring-yarn-blush transition-all duration-300">
              <img src="/logo.jpeg" alt="TheCozzyLoops" className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-yarn-pink to-yarn-blush items-center justify-center text-white font-display font-bold text-sm hidden">CL</div>
            </div>
            <div>
              <span className="font-display text-xl font-bold text-yarn-dark">
                the<span className="text-yarn-blush">cozzyloops</span>
              </span>
              <p className="text-xs text-yarn-pink font-script leading-none hidden sm:block">Handmade Crochet</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  location.pathname === to
                    ? 'bg-yarn-blush text-white shadow-sm'
                    : 'text-yarn-dark hover:bg-blush-100 hover:text-yarn-blush'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            <a
              href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 btn-outline text-sm py-2 px-4"
            >
              <FaInstagram size={15} />
              <span>Follow</span>
            </a>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-xl hover:bg-blush-100 text-yarn-dark transition-colors"
            >
              {open ? <MdClose size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="glass border-t border-blush-100 px-4 py-4 space-y-1">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                location.pathname === to ? 'bg-yarn-blush text-white' : 'text-yarn-dark hover:bg-blush-100'
              }`}
            >
              {label}
            </Link>
          ))}
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 text-yarn-blush font-medium"
          >
            <FaInstagram size={16} /> Follow on Instagram
          </a>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#1e0e06', color: '#e8cdb0', fontFamily: "'Lora', Georgia, serif", textAlign: 'left' }}>
      <style>{`
        .ft a { color: #e8cdb0; text-decoration: none; transition: color 0.2s; }
        .ft a:hover { color: #f5b97a; }
        .ft-label { font-size: 0.7rem; letter-spacing: 0.13em; text-transform: uppercase; color: #b07040; margin-bottom: 14px; text-align: left; }
        .ft-link { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; padding: 5px 0; color: #cba882; text-align: left; }
        .ft-link:hover { color: #f5b97a; }
        .social-btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 16px; border-radius: 999px; font-size: 0.85rem; font-family: 'Lora', serif; font-weight: 600; transition: all 0.2s; text-decoration: none; background: #3a1f0f; color: #f5b97a; border: 1.5px solid #6b3318; }
        .social-btn:hover { color: #fff; }
        .social-ig:hover { background: #e1306c; border-color: #e1306c; }
        .social-wa:hover { background: #25A047; border-color: #25A047; }
        .social-em:hover { background: #b85c2a; border-color: #b85c2a; }
      `}</style>

      <div className="ft" style={{ maxWidth: 1200, margin: '0 auto', padding: '3.5rem 4rem 0', textAlign: 'left' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: '3rem' }}>

          {/* Brand */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.9rem', fontWeight: 900, color: '#fff' }}>
              the<span style={{ color: '#e8854a' }}>cozzyloops</span>
            </div>
            <div style={{ fontStyle: 'italic', color: '#c4956a', fontSize: '0.95rem', marginTop: 4 }}>
              Warm loops, cozy hearts 🧶
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.8, color: '#a07050', marginTop: '1rem', maxWidth: 240 }}>
              Every piece is made by hand with love. No mass production — just slow, intentional craft.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              <a href={`https://instagram.com/${INSTAGRAM_HANDLE}`} target="_blank" rel="noopener noreferrer" className="social-btn social-ig">
                <FaInstagram size={15} /> Instagram
              </a>
              <a href={getWhatsAppOrderUrl(null, WHATSAPP_NUMBER)} target="_blank" rel="noopener noreferrer" className="social-btn social-wa">
                <FaWhatsapp size={15} /> WhatsApp
              </a>
              <a href={`mailto:${EMAIL}`} className="social-btn social-em">
                <FaEnvelope size={15} /> Email
              </a>
            </div>
          </div>

          {/* Pages */}
          <div style={{ textAlign: 'left' }}>
            <div className="ft-label">Pages</div>
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className="ft-link">
                <span style={{ fontSize: 13 }}>→</span> {label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div style={{ textAlign: 'left' }}>
            <div className="ft-label">Reach us</div>
            <a href={INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer" className="ft-link" style={{ alignItems: 'flex-start' }}>
              <FaInstagram size={15} style={{ marginTop: 2 }} /> <span>Message on<br />Instagram</span>
            </a>
            <a href={getWhatsAppOrderUrl(null, WHATSAPP_NUMBER)} target="_blank" rel="noopener noreferrer" className="ft-link" style={{ alignItems: 'flex-start' }}>
              <FaWhatsapp size={15} style={{ marginTop: 2 }} /> <span>Order on<br />WhatsApp</span>
            </a>
            <a href={`mailto:${EMAIL}`} className="ft-link" style={{ alignItems: 'flex-start' }}>
              <FaEnvelope size={15} style={{ marginTop: 2 }} /> <span>{EMAIL}</span>
            </a>
          </div>

        </div>
      </div>

      <div style={{ borderTop: '1px solid #3a1f0f', marginTop: '3rem' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.2rem 8rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, textAlign: 'left' }}>
        <p style={{ fontSize: '0.8rem', color: '#6b4025', margin: 0 }}>© 2025 TheCozzyLoops. All rights reserved.</p>
        <p style={{ fontSize: '0.8rem', color: '#6b4025', margin: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
          Made with <FaHeart size={12} color="#e8854a" /> and lots of yarn
        </p>
      </div>
    </footer>
  )
}

export default function ShopLayout() {
  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}