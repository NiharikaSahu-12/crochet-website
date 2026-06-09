import { Link } from 'react-router-dom'
import { ShoppingBag, Sparkles, Wand2 } from 'lucide-react'
import CustomOrderButton from './CustomOrderButton'

const productShots = [
  { src: '/images/flower_bookmark.jpg', label: 'Daisy bookmarks' },
  { src: '/images/flower_keychain.jpg', label: 'Flower keychains' },
  { src: '/images/bow_keychain.jpg', label: 'Bow charms' },
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blush-50 via-[#fff7df] to-rose-mist">
      <div className="absolute left-0 top-14 h-40 w-40 rounded-full bg-yarn-gold/30 blur-3xl" />
      <div className="absolute bottom-10 right-0 h-56 w-56 rounded-full bg-yarn-pink/40 blur-3xl" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blush-200 bg-white/85 px-4 py-2 text-sm font-semibold text-yarn-blush shadow-sm">
              <Sparkles size={16} aria-hidden="true" />
              Handcrafted with love
            </div>

            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-tight text-yarn-dark">
              Warm Loops, <span className="text-gradient italic">Cozy Hearts.</span>
            </h1>

            <p className="mt-5 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg leading-8 text-[#6b5551]">
              TheCozzyLoops crafts keychains, bookmarks, flowers, accessories, and custom gifts with soft yarn,
              careful finishing, and gift-ready details.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link to="/shop" className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-4">
                <ShoppingBag size={18} aria-hidden="true" />
                Shop pieces
              </Link>
              <CustomOrderButton className="btn-outline inline-flex items-center justify-center gap-2 px-7 py-4 bg-white">
                <Wand2 size={18} aria-hidden="true" />
                Request custom
              </CustomOrderButton>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0">
              {[
                ['Made by hand', 'No factory stock'],
                ['Custom colors', 'Matched to you'],
                ['Gift-ready', 'Packed with care'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-white/80 bg-white/65 p-3 text-left shadow-sm">
                  <p className="text-sm font-semibold text-yarn-dark">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#8a716b]">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-[1fr_0.62fr] gap-3 sm:gap-4 items-stretch">
              <div className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-gradient-to-br from-blush-100 to-yarn-gold/30 p-2 shadow-2xl shadow-blush-200/40">
                <img
                  src="/images/crochet-main.jpg"
                  alt="Crochet flower pot handmade by TheCozzyLoops"
                  className="h-full w-full rounded-[22px] object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-yarn-dark/80 to-transparent p-5 sm:p-6 text-left">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blush-100">Signature gift</p>
                  <p className="mt-1 font-display text-2xl text-white">Crochet blooms</p>
                </div>
              </div>

              <div className="grid gap-3 sm:gap-4">
                {productShots.map((shot) => (
                  <div key={shot.label} className="overflow-hidden rounded-2xl bg-gradient-to-br from-white to-blush-100 p-1 shadow-lg shadow-blush-100/80">
                    <img src={shot.src} alt={shot.label} className="aspect-square h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
