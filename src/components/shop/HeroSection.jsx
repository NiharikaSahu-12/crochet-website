import { Link } from 'react-router-dom'
import { ArrowRight, Wand2, Star, Flower2, HeartHandshake } from 'lucide-react'

const MARQUEE_ITEMS = [
  'Everlasting Bouquets',
  'Potted Blooms',
  'Floral Bookmarks',
  'Keychains & Charms',
  'Amigurumi Plush',
  'Aesthetic Gift Boxes',
  'Custom Color Studio',
]

const PROOF_FACES = [
  '/images/hero_bouquet.jpg',
  '/images/potted_bloom.jpg',
  '/images/floral_bookmark_hd.jpg',
  '/images/amigurumi_bunny.jpg',
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-canvas">
      {/* Layered warm wash + glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-soft/50 via-canvas to-canvas pointer-events-none" />
      <div className="absolute -top-40 -right-32 w-[34rem] h-[34rem] rounded-full bg-terracotta-300/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[26rem] h-[26rem] rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgb(var(--ink)) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-14 pb-12 lg:pb-14">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left: editorial copy */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-terracotta-600/25 bg-surface/70 backdrop-blur-xs text-[11px] font-mono tracking-editorial uppercase text-terracotta-700">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta-600 animate-pulse" />
              <span>Artisan Crochet Studio · Small Batches</span>
            </div>

            <h1 className="font-editorial text-4xl min-[380px]:text-[2.6rem] sm:text-6xl lg:text-[4.4rem] font-semibold tracking-tight text-ink leading-[1.04]">
              Everlasting blooms,{' '}
              <span className="block italic font-normal text-terracotta-700">
                stitched to be kept forever.
              </span>
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-ink-muted leading-relaxed font-light">
              Soft pastel bouquets, desk blooms, floral bookmarks and charms — each one
              crocheted by hand from ultra-fine milk cotton, then gift-boxed with a wax seal
              and a handwritten note.
            </p>

            <div className="pt-1 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/shop" className="btn-primary group">
                <span>Explore the Collection</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/custom-orders" className="btn-outline inline-flex items-center justify-center gap-2">
                <Wand2 size={16} className="text-terracotta-600" />
                <span>Custom Order Studio</span>
              </Link>
            </div>

            {/* Social proof row */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3">
                {PROOF_FACES.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border-2 border-canvas shadow-xs"
                  />
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                  <span className="ml-1 text-xs font-semibold text-ink">4.9</span>
                </div>
                <p className="text-xs text-ink-muted mt-0.5">Loved by 200+ gift-givers across India</p>
              </div>
            </div>
          </div>

          {/* Right: arch visual with floating accents */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg">
              {/* Offset outline frame */}
              <div className="absolute -inset-3 sm:-inset-4 rounded-t-[999px] rounded-b-[2.5rem] border border-terracotta-600/25 pointer-events-none" />

              {/* Arch image */}
              <div className="relative rounded-t-[999px] rounded-b-[2.5rem] overflow-hidden bg-canvas-muted border border-canvas-border shadow-lifted">
                <div className="aspect-[4/5]">
                  <img
                    src="/images/hero_bouquet.jpg"
                    alt="Handcrafted everlasting crochet bouquet by TheCozzyLoops"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/85 via-night/25 to-transparent pt-16 pb-6 px-6">
                  <div className="flex items-end justify-between text-white">
                    <div>
                      <div className="text-[10px] font-mono tracking-editorial uppercase text-terracotta-300 font-semibold">
                        Featured Piece
                      </div>
                      <div className="font-editorial text-lg font-semibold leading-tight">
                        Pastel Tulip &amp; Daisy Bouquet
                      </div>
                    </div>
                    <span className="font-mono text-base font-bold">₹899</span>
                  </div>
                </div>
              </div>

              {/* Floating rating chip */}
              <div className="absolute -left-4 sm:-left-8 bottom-16 glass-panel rounded-2xl border border-canvas-border shadow-float px-4 py-3 hidden sm:block">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-terracotta-600 text-white flex items-center justify-center">
                    <HeartHandshake size={17} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-ink leading-none">Hand-stitched</div>
                    <div className="text-[10px] text-ink-muted mt-1">No two pieces alike</div>
                  </div>
                </div>
              </div>

              {/* Floating bloom badge */}
              <div className="absolute -right-3 sm:-right-6 top-10 glass-panel rounded-full border border-canvas-border shadow-float px-4 py-2 hidden sm:flex items-center gap-2">
                <Flower2 size={14} className="text-terracotta-600" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-ink font-semibold">
                  Everlasting
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee band */}
      <div className="relative border-y border-canvas-border bg-surface/60 backdrop-blur-xs py-4 overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center shrink-0">
              {MARQUEE_ITEMS.map((item) => (
                <span key={`${dup}-${item}`} className="flex items-center">
                  <span className="px-6 text-xs font-mono uppercase tracking-editorial text-ink-muted whitespace-nowrap">
                    {item}
                  </span>
                  <Flower2 size={13} className="text-terracotta-500/70" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
