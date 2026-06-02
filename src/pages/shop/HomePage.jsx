import { Link } from 'react-router-dom'
import { MdArrowForward, MdRefresh } from 'react-icons/md'
import { FaInstagram, FaTruck, FaStar, FaEnvelope, FaWhatsapp } from 'react-icons/fa'
import HeroSection from '../../components/shop/HeroSection'
import ProductCard from '../../components/shop/ProductCard'
import { useFeaturedProducts } from '../../hooks/useProducts'
import { INSTAGRAM_DM_URL, WHATSAPP_NUMBER, EMAIL, getWhatsAppOrderUrl } from '../../utils/instagram'
import { PRODUCT_CATEGORIES } from '../../models/Product'

function CategoryCard({ category }) {
  const icons = { bags: '👜', home_decor: '🏠', accessories: '💍', baby: '🍼', seasonal: '🌸', custom: '✨' }
  return (
    <Link
      to={`/shop?category=${category.value}`}
      className="group flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-blush-100 hover:border-yarn-blush"
    >
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
        {icons[category.value] || '🧶'}
      </div>
      <p className="font-medium text-yarn-dark text-sm text-center">{category.label}</p>
    </Link>
  )
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="text-center p-6">
      <div className="w-14 h-14 bg-blush-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon size={24} className="text-yarn-blush" />
      </div>
      <h3 className="font-display font-semibold text-yarn-dark mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

export default function HomePage() {
  const { products, loading } = useFeaturedProducts()

  return (
    <div>
      <HeroSection />

      {/* Features strip */}
      <section className="py-12 bg-white border-y border-blush-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FeatureCard icon={FaStar} title="Handcrafted" desc="Every piece made by hand with love and attention" />
            <FeatureCard icon={FaTruck} title="Shipped with care" desc="Safe packaging to your doorstep" />
            <FeatureCard icon={FaInstagram} title="Custom Orders" desc="Tell us your dream piece, we'll make it" />
            <FeatureCard icon={MdRefresh} title="Made to Order" desc="Fresh and unique every time" />
          </div>
        </div>
      </section>

      {/* Shop by category */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-script text-yarn-blush text-2xl mb-2">Browse by</p>
          <h2 className="font-display text-4xl md:text-5xl text-yarn-dark">Categories</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-yarn-blush to-yarn-gold rounded-full mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PRODUCT_CATEGORIES.map(cat => <CategoryCard key={cat.value} category={cat} />)}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-blush-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <p className="font-script text-yarn-blush text-2xl mb-2">Our best</p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-yarn-dark">Featured Picks</h2>
            </div>
            <Link to="/shop" className="flex items-center gap-2 text-yarn-blush font-medium hover:gap-3 transition-all text-sm sm:text-base">
              View All <MdArrowForward size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-blush-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-blush-100 rounded w-1/2" />
                    <div className="h-5 bg-blush-100 rounded w-3/4" />
                    <div className="h-4 bg-blush-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🧶</div>
              <p className="font-display text-2xl text-yarn-dark mb-2">Coming Soon!</p>
              <p className="text-gray-500">Our featured products will appear here soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {products.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              Shop All Products <MdArrowForward size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Order CTA */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-yarn-dark to-blush-900 rounded-3xl p-6 sm:p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yarn-blush/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yarn-gold/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          <div className="relative">
            <p className="font-script text-yarn-pink text-2xl mb-3">Let's connect</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mb-4">
              Place Your Order
            </h2>
            <p className="text-blush-200 text-lg mb-8 max-w-md mx-auto">
              Choose your preferred way to reach us and order your custom crochet piece today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-8 py-4 rounded-full font-semibold text-base hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <FaEnvelope size={20} />
                Email Us
              </a>
              <a
                href={INSTAGRAM_DM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white px-8 py-4 rounded-full font-semibold text-base hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <FaInstagram size={20} />
                Message on Instagram
              </a>
              <a
                href={getWhatsAppOrderUrl(null, WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-semibold text-base hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <FaWhatsapp size={20} />
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
