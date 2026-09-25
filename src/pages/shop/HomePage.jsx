import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Wand2, Sparkles, Heart, Flower2, Bookmark, Key, Gift, Check, ShieldCheck, Star } from 'lucide-react'
import HeroSection from '../../components/shop/HeroSection'
import ProductCard from '../../components/shop/ProductCard'
import { useFeaturedProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { useShop } from '../../context/ShopContext'

const CATEGORIES_SHOWCASE = [
  {
    id: 'bouquets',
    name: 'Bouquets & Pots',
    desc: 'Everlasting flowers',
    image: '/images/hero_bouquet.jpg',
    to: '/shop?category=bouquets',
  },
  {
    id: 'potted',
    name: 'Potted Blooms',
    desc: 'Desk & tabletop decor',
    image: '/images/potted_bloom.jpg',
    to: '/shop?category=bouquets',
  },
  {
    id: 'flowers',
    name: 'Floral Bookmarks',
    desc: 'Handmade for book lovers',
    image: '/images/floral_bookmark_hd.jpg',
    to: '/shop?category=flowers',
  },
  {
    id: 'keychains',
    name: 'Keychains & Charms',
    desc: 'Bows, sunflowers & daisies',
    image: '/images/flower_keychain.jpg',
    to: '/shop?category=keychains',
  },
  {
    id: 'gifts',
    name: 'Plush & Gifts',
    desc: 'Amigurumi & gift boxes',
    image: '/images/amigurumi_bunny.jpg',
    to: '/shop?category=gifts',
  },
  {
    id: 'custom',
    name: 'Custom Orders',
    desc: 'Pick your dream colors',
    image: '/images/gift_packaging.jpg',
    to: '/custom-orders',
  },
]

const ATELIER_PILLARS = [
  {
    step: '01',
    title: '100% Handcrafted',
    desc: 'Each petal, leafy stem, and bow is crocheted stitch-by-stitch by hand with tight, lasting tension.',
  },
  {
    step: '02',
    title: 'Ultra-Soft Milk Cotton',
    desc: 'Selected for gentle softness, smooth velvety stitch definition, and vibrant, non-fading pastel dyes.',
  },
  {
    step: '03',
    title: 'Heirloom Keepsakes',
    desc: 'Everlasting floral blooms that stay fresh and radiant forever without water or sunlight.',
  },
  {
    step: '04',
    title: 'Aesthetic Gift Boxed',
    desc: 'Every piece is packaged with tissue wrap, wax seal stamp, and a free handwritten calligraphy card.',
  },
]

const COMMUNITY_STORIES = [
  {
    quote: 'The pastel tulip bouquet arrived in the most gorgeous gift box with a wax seal. The flowers look so sweet on my work desk!',
    author: 'Aadya M.',
    location: 'Mumbai',
    item: 'Pastel Tulip Bouquet',
    stars: 5,
  },
  {
    quote: 'I ordered a custom potted sunflower for my sister’s graduation. Niharika captured every single color preference perfectly. 10/10!',
    author: 'Sneha R.',
    location: 'Bengaluru',
    item: 'Custom Potted Bloom',
    stars: 5,
  },
  {
    quote: 'The daisy bookmark is an absolute work of art. The stem is thin enough that it doesn’t damage book spines. Ordering more for my book club!',
    author: 'Kavya T.',
    location: 'Pune',
    item: 'Floral Stem Bookmark',
    stars: 5,
  },
]

export default function HomePage() {
  const { products, loading } = useFeaturedProducts()

  return (
    <div className="bg-canvas">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Visual Categories Showcase with High-Res Photography */}
      <section className="py-20 sm:py-24 border-b border-canvas-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-mono uppercase tracking-editorial text-terracotta-700 font-semibold">
                Curated Collections
              </p>
              <h2 className="mt-2 font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-ink">
                Shop by Category
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink hover:text-terracotta-700 transition-colors pb-1 border-b border-ink/20 hover:border-terracotta-700"
            >
              <span>Explore All Pieces</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Photographic category cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {CATEGORIES_SHOWCASE.map((cat) => (
              <Link
                key={cat.id}
                to={cat.to}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-stone-100 border border-canvas-border shadow-xs hover:shadow-card transition-all duration-300 flex flex-col justify-end p-4 text-white"
              >
                {/* Background image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Subtle dark gradient overlay for crystal readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent transition-opacity group-hover:opacity-90" />

                {/* Text overlay */}
                <div className="relative z-10">
                  <h3 className="font-editorial text-sm sm:text-base font-bold leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-white/80 font-light mt-0.5 truncate">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 3. Featured Products Collection */}
      <section className="py-20 sm:py-28 border-b border-canvas-border bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-mono uppercase tracking-editorial text-terracotta-700 font-semibold">
                Handcrafted Favorites
              </p>
              <h2 className="mt-2 font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-ink">
                Featured Handmade Pieces
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink hover:text-terracotta-700 transition-colors pb-1 border-b border-ink/20 hover:border-terracotta-700"
            >
              <span>View Full Shop</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[4/5] bg-canvas-subtle rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-canvas-subtle rounded-3xl border border-canvas-border p-12 text-center max-w-xl mx-auto">
              <p className="font-editorial text-xl text-ink">New products coming soon!</p>
              <p className="text-xs text-ink-muted mt-2">
                Custom orders are always open! Click below to order your favorite piece.
              </p>
              <Link to="/custom-orders" className="btn-primary mt-6 text-xs px-6 py-3">
                Make a Custom Order
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Atelier Pillars / Handcrafted Values */}
      <section className="border-b border-canvas-border bg-canvas-subtle py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {ATELIER_PILLARS.map((p) => (
              <div key={p.step} className="space-y-2.5">
                <span className="font-mono text-xs font-bold text-terracotta-700 tracking-wider">
                  {p.step}
                </span>
                <h3 className="font-editorial text-xl font-bold text-ink">
                  {p.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed font-light">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Custom Orders Studio Banner */}
      <section className="py-20 sm:py-28 border-b border-canvas-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="bg-ink text-white rounded-3xl overflow-hidden border border-canvas-border shadow-float grid lg:grid-cols-12">
            
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="font-mono text-xs uppercase tracking-editorial text-terracotta-400 font-semibold">
                  Custom Orders &amp; Studio
                </span>
                <h2 className="font-editorial text-3xl sm:text-5xl font-bold leading-tight text-white">
                  Have a specific color or dream crochet idea?
                </h2>
                <p className="text-base sm:text-lg text-white/70 leading-relaxed font-light max-w-xl">
                  Choose your favorite shades, flower species, yarn texture, and personalized initial charm. We craft one-of-a-kind bouquets, desk blooms, and favors for your special moments.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
                <Link
                  to="/custom-orders"
                  className="btn-primary bg-terracotta-600 hover:bg-terracotta-700 px-7 py-3.5"
                >
                  <Wand2 size={16} />
                  <span>Open Custom Orders Studio</span>
                </Link>

                <Link
                  to="/contact"
                  className="text-xs uppercase tracking-wider font-semibold text-white/80 hover:text-white flex items-center gap-1.5 transition-colors py-3"
                >
                  <span>Chat with Niharika</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full">
              <img
                src="/images/gift_packaging.jpg"
                alt="Handmade crochet gift packaging with wax seal by TheCozzyLoops"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent lg:hidden" />
            </div>

          </div>
        </div>
      </section>

      {/* 6. Customer Stories */}
      <section className="py-20 sm:py-28 bg-white border-b border-canvas-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-editorial text-terracotta-700 font-semibold">
              Loved by Customers
            </span>
            <h2 className="mt-2 font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-ink">
              Stories from Our Community
            </h2>
            <p className="mt-3 text-sm text-ink-muted">
              Real notes from book lovers, gift givers, and crochet enthusiasts across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {COMMUNITY_STORIES.map((story) => (
              <div
                key={story.author}
                className="bg-canvas rounded-2xl p-8 border border-canvas-border shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 text-amber-500 mb-5">
                    {[...Array(story.stars)].map((_, i) => (
                      <Star key={i} size={15} fill="#D97706" />
                    ))}
                  </div>
                  <p className="font-editorial text-base text-ink leading-relaxed italic">
                    "{story.quote}"
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-canvas-border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-ink">{story.author}</span>
                    <span className="text-ink-muted"> · {story.location}</span>
                  </div>
                  <span className="font-mono text-[11px] text-terracotta-700 font-medium">
                    {story.item}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Instagram & Atelier Visual Gallery */}
      <section className="py-16 sm:py-20 bg-canvas">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-editorial text-terracotta-700 font-semibold">
                Daily Stitches
              </span>
              <h3 className="font-editorial text-2xl font-bold text-ink mt-0.5">
                Follow @thecozzyloops
              </h3>
            </div>
            <a
              href="https://instagram.com/thecozzyloops"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-wider text-ink hover:text-terracotta-700 transition-colors"
            >
              Follow on Instagram →
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {[
              { src: '/images/hero_bouquet.jpg', alt: 'Crochet tulip bouquet' },
              { src: '/images/potted_bloom.jpg', alt: 'Crochet sunflower plant' },
              { src: '/images/floral_bookmark_hd.jpg', alt: 'Crochet daisy bookmark' },
              { src: '/images/amigurumi_bunny.jpg', alt: 'Crochet bunny plush' },
              { src: '/images/gift_packaging.jpg', alt: 'Crochet packaging' },
            ].map((img, i) => (
              <a
                key={i}
                href="https://instagram.com/thecozzyloops"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl overflow-hidden aspect-square border border-canvas-border shadow-xs"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                  <span>View on Instagram</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
