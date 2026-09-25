import { Link } from 'react-router-dom'
import { ArrowRight, Wand2, Sparkles, Feather, ShieldCheck } from 'lucide-react'
import { useShop } from '../../context/ShopContext'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-canvas border-b border-canvas-border">
      {/* Subtle organic texture */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#18181B 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Elegant kicker with botanical accent */}
            <div className="inline-flex items-center gap-2.5 text-xs font-mono tracking-editorial uppercase text-terracotta-700">
              <span className="w-2 h-2 rounded-full bg-terracotta-600 animate-pulse" />
              <span>Artisan Crochet Studio · Handcrafted in Small Batches</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink leading-[1.06]">
              Everlasting blooms &amp; <br />
              <span className="italic font-normal font-serif text-terracotta-700">
                tender handmade keepsakes.
              </span>
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-ink-muted leading-relaxed font-light">
              Welcome to The CozyLoops. We crochet soft pastel flower bouquets, everlasting potted blooms, delicate floral bookmarks, and charming accessories using ultra-fine milk cotton yarn.
            </p>

            {/* CTAs with generous modern sizing */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to="/shop" 
                className="btn-primary group"
              >
                <span>Explore the Collection</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/custom-orders"
                className="btn-outline inline-flex items-center justify-center gap-2"
              >
                <Wand2 size={16} className="text-terracotta-600" />
                <span>Custom Order Studio</span>
              </Link>
            </div>

            {/* Quiet, unboxed editorial proof strip */}
            <div className="pt-8 border-t border-canvas-border grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <div className="font-mono text-lg sm:text-xl font-bold text-ink">100%</div>
                <div className="text-xs text-ink-muted mt-0.5">Hand-Stitched with Hook</div>
              </div>
              <div>
                <div className="font-mono text-lg sm:text-xl font-bold text-ink">Ultra-Soft</div>
                <div className="text-xs text-ink-muted mt-0.5">Milk Cotton &amp; Chenille</div>
              </div>
              <div>
                <div className="font-mono text-lg sm:text-xl font-bold text-ink">Gift-Ready</div>
                <div className="text-xs text-ink-muted mt-0.5">Free Card &amp; Wax Seal</div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Resolution Visual Layout */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary Anchor Frame with High-Res Bouquet */}
              <div className="relative rounded-3xl overflow-hidden bg-white border border-canvas-border shadow-lifted">
                <div className="aspect-[4/5] overflow-hidden bg-stone-100">
                  <img
                    src="/images/hero_bouquet.jpg"
                    alt="Handcrafted Everlasting Crochet Bouquet by TheCozzyLoops"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                    loading="eager"
                  />
                </div>

                {/* Minimalist caption bar */}
                <div className="p-5 bg-white border-t border-canvas-border flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-mono tracking-editorial uppercase text-terracotta-700 font-semibold">
                      Featured Piece
                    </div>
                    <div className="font-editorial text-base font-semibold text-ink">
                      Pastel Tulip &amp; Daisy Bouquet
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-ink">₹899</span>
                    <div className="text-[10px] text-ink-muted">Hand-wrapped</div>
                  </div>
                </div>
              </div>

              {/* Floating Accent Snapshot 1: Flower bookmark */}
              <div className="absolute -bottom-6 -left-6 sm:-left-8 w-40 sm:w-48 bg-white p-2.5 rounded-2xl border border-canvas-border shadow-float hidden sm:block">
                <div className="aspect-square rounded-xl overflow-hidden bg-canvas-subtle mb-2">
                  <img
                    src="/images/floral_bookmark_hd.jpg"
                    alt="Handmade Daisy Bookmark"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-1 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <div className="text-[10px] font-mono uppercase text-ink-muted">Bookmark</div>
                    <div className="text-xs font-semibold text-ink truncate">Floral Stem</div>
                  </div>
                  <span className="font-mono text-xs font-bold text-terracotta-700">₹199</span>
                </div>
              </div>

              {/* Floating Accent Snapshot 2: Potted Bloom */}
              <div className="absolute -top-6 -right-4 sm:-right-6 w-36 sm:w-40 bg-white p-2 rounded-2xl border border-canvas-border shadow-float hidden sm:block">
                <div className="aspect-square rounded-xl overflow-hidden bg-canvas-subtle mb-1.5">
                  <img
                    src="/images/potted_bloom.jpg"
                    alt="Crochet Potted Plant"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-1 text-center">
                  <span className="text-[11px] font-mono uppercase text-terracotta-700 font-semibold">
                    Potted Bloom · ₹449
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
