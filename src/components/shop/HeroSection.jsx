import { Link } from 'react-router-dom'
import { FaInstagram, FaStar } from 'react-icons/fa'
import { MdArrowForward } from 'react-icons/md'
import { INSTAGRAM_DM_URL, INSTAGRAM_HANDLE } from '../../utils/instagram'

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-blush-200/80 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-yarn-gold/40 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
      
      {/* Floating yarn emojis — hidden on small screens to prevent overflow */}
      <div className="hidden sm:block absolute top-32 left-[5%] text-6xl animate-float opacity-60" style={{ animationDelay: '0s' }}>🧶</div>
      <div className="hidden sm:block absolute top-48 right-[8%] text-5xl animate-float opacity-50" style={{ animationDelay: '2s' }}>🪡</div>
      <div className="hidden md:block absolute bottom-32 left-[12%] text-3xl animate-float opacity-40" style={{ animationDelay: '1s' }}>💕</div>
      <div className="hidden md:block absolute bottom-48 right-[15%] text-4xl animate-float opacity-50" style={{ animationDelay: '3s' }}>✨</div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blush-100 text-yarn-blush px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FaStar size={14} />
              Handcrafted with love
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-yarn-dark leading-[1.1] mb-4">
              Warm Loops,
              <br />
              <span className="text-gradient italic">Cozy Hearts</span>
            </h1>

            <p className="font-bold text-lg text-yarn-blush mb-6 block">— TheCozzyLoops</p>

            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Every piece is handmade with premium yarn and endless love. 
              Discover keychains, home décor, accessories, and custom orders crafted just for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/shop" className="btn-primary inline-flex items-center justify-center gap-2 text-base px-8 py-4">
                Shop Now
                <MdArrowForward size={18} />
              </Link>
              <a
                href={INSTAGRAM_DM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center justify-center gap-2 text-base px-8 py-4"
              >
                <FaInstagram size={18} />
                Custom Order
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-12 justify-center lg:justify-start">
              {[
                { num: '50+', label: 'Happy Customers' },
                { num: '50+', label: 'Unique Designs' },
                { num: '5★', label: 'Rated' },
              ].map(({ num, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-2xl font-bold text-yarn-blush">{num}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-blush-200 animate-spin" style={{ animationDuration: '30s' }} />
              <div className="absolute inset-6 rounded-full border border-yarn-gold/30" />
              
              {/* Center logo / illustration */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blush-100 to-blush-200 flex items-center justify-center shadow-2xl overflow-hidden">
                <img
                  src="/logo.jpeg"
                  alt="TheCozzyLoops"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                {/* <div className="w-full h-full items-center justify-center flex-col hidden">
                  <div className="text-6xl mb-2">🧶</div>
                  <p className="font-display font-bold text-yarn-dark text-xl">TheCozzyLoops</p>
                  <p className="font-script text-yarn-blush">Handmade Crochet</p>
                </div> */}
              </div>

              {/* Floating cards */}
              <div className="hidden sm:flex absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 items-center gap-2 animate-float" style={{ animationDelay: '0.5s' }}>
                <span className="text-2xl">❤️</span>
                <div>
                  <p className="text-xs font-semibold text-yarn-dark">Made with love</p>
                  <p className="text-xs text-gray-400">Every stitch counts</p>
                </div>
              </div>
              <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 items-center gap-2 animate-float" style={{ animationDelay: '2s' }}>
                <span className="text-2xl">🌿</span>
                <div>
                  <p className="text-xs font-semibold text-yarn-dark">Natural Yarns</p>
                  <p className="text-xs text-gray-400">Premium quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
