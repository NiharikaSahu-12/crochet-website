import { Link } from 'react-router-dom'
import { ArrowRight, Flower2, Gift, Home, PackageCheck, RefreshCw, Send, ShoppingBag, Sparkles, Star, Wand2 } from 'lucide-react'
import HeroSection from '../../components/shop/HeroSection'
import ProductCard from '../../components/shop/ProductCard'
import CustomOrderButton from '../../components/shop/CustomOrderButton'
import { useFeaturedProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'

const categoryIcons = {
  bags: ShoppingBag,
  home_decor: Home,
  accessories: Sparkles,
  baby: Gift,
  seasonal: Flower2,
  custom: Wand2,
}

const featureCards = [
  { icon: Star, title: 'Hand finished', desc: 'Clean seams, tidy details, and careful shaping on every piece.', tone: 'from-blush-50 to-rose-mist' },
  { icon: PackageCheck, title: 'Packed safely', desc: 'Orders are wrapped to protect texture, shape, and gifting details.', tone: 'from-[#fff4d8] to-blush-50' },
  { icon: Send, title: 'Easy ordering', desc: 'Pick from the shop or send a reference for a custom request.', tone: 'from-rose-mist to-white' },
  { icon: RefreshCw, title: 'Made to order', desc: 'Fresh pieces can be adjusted by color, size, and occasion.', tone: 'from-blush-100 to-[#fff4d8]' },
]

function cleanCategoryLabel(label) {
  return label.replace(/Home D.*cor/, 'Home Decor')
}

function CategoryCard({ category }) {
  const Icon = categoryIcons[category.value] || Sparkles

  return (
    <Link
      to={`/shop?category=${category.value}`}
      className="group rounded-2xl border border-blush-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-yarn-blush hover:shadow-lg"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-blush-100 to-yarn-gold/30 text-yarn-blush transition-colors group-hover:from-yarn-blush group-hover:to-yarn-gold group-hover:text-white">
        <Icon size={21} aria-hidden="true" />
      </div>
      <p className="mt-4 font-semibold text-yarn-dark">{cleanCategoryLabel(category.label)}</p>
      <p className="mt-2 flex items-center gap-1 text-sm text-[#8a716b]">
        Explore <ArrowRight size={14} aria-hidden="true" />
      </p>
    </Link>
  )
}

function FeatureCard({ icon: Icon, title, desc, tone }) {
  return (
    <div className={`rounded-2xl border border-white bg-gradient-to-br ${tone} p-5 shadow-sm`}>
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-yarn-blush shadow-sm">
        <Icon size={20} aria-hidden="true" />
      </div>
      <h3 className="font-display text-lg font-semibold text-yarn-dark">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#75625d]">{desc}</p>
    </div>
  )
}

export default function HomePage() {
  const { products, loading } = useFeaturedProducts()
  const { categories } = useCategories({ activeOnly: true })

  return (
    <div className="bg-gradient-to-b from-[#fffaf6] via-white to-blush-50">
      <HeroSection />

      <section className="border-y border-blush-100 bg-gradient-to-r from-white via-blush-50 to-[#fff6df] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yarn-blush">Shop by type</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl text-yarn-dark">Find the right handmade piece</h2>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-2 font-semibold text-yarn-blush hover:text-blush-700">
              View all products <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.value} category={cat} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-blush-50 via-[#fff4d8] to-rose-mist py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yarn-blush">Featured picks</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl text-yarn-dark">Ready-to-love favorites</h2>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-2 font-semibold text-yarn-blush hover:text-blush-700">
              Shop the collection <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          {loading ? (
            <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="overflow-hidden rounded-2xl bg-white animate-pulse">
                  <div className="aspect-[3/4] bg-blush-100" />
                  <div className="space-y-2 p-4">
                    <div className="h-3 w-1/2 rounded bg-blush-100" />
                    <div className="h-5 w-3/4 rounded bg-blush-100" />
                    <div className="h-4 w-1/3 rounded bg-blush-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="mt-9 rounded-2xl border border-dashed border-blush-200 bg-white/80 p-10 text-center shadow-sm">
              <p className="font-display text-2xl text-yarn-dark">Featured products are coming soon.</p>
              <p className="mt-2 text-[#75625d]">Custom orders are still open through Instagram, WhatsApp, or email.</p>
            </div>
          ) : (
            <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 overflow-hidden rounded-[28px] bg-gradient-to-br from-yarn-dark via-blush-900 to-yarn-blush shadow-2xl shadow-blush-200/50 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="min-h-[320px]">
              <img
                src="/images/about_1.jpg"
                alt="Display of handmade crochet flower pieces"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blush-200">Custom orders</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl text-white">Have a color, gift, or idea in mind?</h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-blush-100">
                Send a reference, choose your preferred palette, and we will help turn it into a crochet piece that feels personal.
              </p>
              <CustomOrderButton className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-yarn-dark transition hover:bg-blush-50">
                <Wand2 size={18} aria-hidden="true" />
                Start custom order
              </CustomOrderButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
