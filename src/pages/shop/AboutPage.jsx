import { Link } from 'react-router-dom'
import { ArrowRight, Heart, PackageCheck, Palette, Scissors, Sparkles, Wand2 } from 'lucide-react'
import CustomOrderButton from '../../components/shop/CustomOrderButton'

const values = [
  {
    icon: Scissors,
    title: 'Slow-made craft',
    desc: 'Pieces are shaped, checked, and finished by hand instead of rushed through batches.',
  },
  {
    icon: Palette,
    title: 'Personal color',
    desc: 'Custom requests can be matched to an outfit, room, celebration, or favorite palette.',
  },
  {
    icon: PackageCheck,
    title: 'Gift-ready care',
    desc: 'Orders are packed neatly so they feel considered from the first stitch to the handoff.',
  },
]

const process = [
  ['Choose', 'Pick a listed piece or share a reference for a custom idea.'],
  ['Confirm', 'We align on size, colors, timing, and any special gift details.'],
  ['Create', 'Your crochet piece is handmade, checked, packed, and sent with care.'],
]

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-[#fffaf6] via-white to-rose-mist">
      <section className="relative overflow-hidden border-b border-blush-100 bg-gradient-to-br from-white via-blush-50 to-[#fff4d8]">
        <div className="absolute -left-12 top-16 h-44 w-44 rounded-full bg-yarn-gold/25 blur-3xl" />
        <div className="absolute -right-10 bottom-8 h-52 w-52 rounded-full bg-yarn-pink/35 blur-3xl" />
        <div className="relative max-w-7xl mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 py-12 lg:py-16 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-blush-200 bg-blush-50 px-4 py-2 text-sm font-semibold text-yarn-blush">
              <Sparkles size={16} aria-hidden="true" />
              About TheCozzyLoops
            </p>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-tight text-yarn-dark">
              Crochet gifts with softness, <span className="text-gradient italic">color</span>, and intention.
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg leading-8 text-[#6b5551]">
              TheCozzyLoops is a small handmade crochet business creating cheerful keepsakes, accessories,
              bookmarks, flowers, and custom pieces for people who love thoughtful details.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/shop" className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-4">
                Browse the shop
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <CustomOrderButton className="btn-outline inline-flex items-center justify-center gap-2 bg-white px-7 py-4">
                <Wand2 size={18} aria-hidden="true" />
                Start a custom order
              </CustomOrderButton>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[32px] border border-white bg-white/75 p-6 shadow-2xl shadow-blush-200/60 backdrop-blur">
              <div className="rounded-[26px] bg-gradient-to-br from-yarn-dark via-blush-900 to-yarn-blush p-6 text-white">
                <Scissors size={30} className="text-blush-200" aria-hidden="true" />
                <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-blush-200">Note</p>
                <h2 className="mt-3 font-display text-3xl leading-tight">Every loop has a purpose.</h2>
                <p className="mt-4 text-sm leading-7 text-blush-100">
                  We work in small batches, plan color combinations carefully, and finish each order with gifting in mind.
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  [Palette, 'Color-led', 'Soft palettes and cheerful accents.'],
                  [PackageCheck, 'Gift ready', 'Packed neatly for special moments.'],
                  [Heart, 'Personal', 'Custom ideas are always welcome.'],
                ].map(([Icon, title, desc]) => (
                  <div key={title} className="rounded-2xl bg-gradient-to-br from-blush-50 to-[#fff4d8] p-4">
                    <Icon size={20} className="text-yarn-blush" aria-hidden="true" />
                    <p className="mt-3 font-display text-lg text-yarn-dark">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-[#75625d]">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="overflow-hidden rounded-[28px] bg-blush-100">
              <img
                src="/images/crochet-main.jpg"
                alt="Crochet flower pot holding a thank you card"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yarn-blush">Our story</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl text-yarn-dark">
                Built around patient stitches and playful details.
              </h2>
              <div className="mt-5 space-y-4 text-base leading-8 text-[#6b5551]">
                <p>
                  What began as a quiet creative practice became a small crochet studio focused on pieces that feel warm,
                  useful, and personal. Each item is made by hand, so the details can be adjusted with care.
                </p>
                <p>
                  The goal is simple: make crochet pieces people want to keep close, gift proudly, and remember fondly.
                  From flower keychains to custom requests, every order is treated as a small keepsake.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ['100%', 'handmade', 'from-blush-50 to-rose-mist'],
                  ['Custom', 'orders welcome', 'from-[#fff4d8] to-blush-50'],
                  ['Gift', 'friendly pieces', 'from-rose-mist to-white'],
                ].map(([stat, label, tone]) => (
                  <div key={label} className={`rounded-2xl border border-white bg-gradient-to-br ${tone} p-4 shadow-sm`}>
                    <p className="font-display text-3xl font-semibold text-yarn-blush">{stat}</p>
                    <p className="mt-1 text-sm text-[#75625d]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-blush-100 bg-gradient-to-r from-white via-blush-50 to-[#fff4d8] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yarn-blush">What matters here</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-yarn-dark">
              Made with the kind of care you can feel.
            </h2>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-white bg-white/80 p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-blush-100 to-yarn-gold/30 text-yarn-blush shadow-sm">
                  <Icon size={21} aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-yarn-dark">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#75625d]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yarn-blush">How custom orders work</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl text-yarn-dark">
                A simple path from idea to handmade piece.
              </h2>
            </div>
            <div className="grid gap-3">
              {process.map(([title, desc], index) => (
                <div key={title} className="grid grid-cols-[48px_1fr] gap-4 rounded-2xl border border-blush-100 bg-white p-5 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yarn-blush to-yarn-gold font-display text-xl text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-yarn-dark">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#75625d]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] bg-gradient-to-br from-yarn-dark via-blush-900 to-yarn-blush p-6 text-center shadow-2xl shadow-blush-200/50 sm:p-10 lg:p-12">
            <Heart className="mx-auto text-blush-200" size={28} aria-hidden="true" />
            <h2 className="mt-4 font-display text-3xl sm:text-4xl text-white">Ready to plan your piece?</h2>
            <p className="mt-3 mx-auto max-w-xl text-base leading-7 text-blush-100">
              Reach out with a product link, color idea, or reference photo, and we will help shape the next step.
            </p>
            <CustomOrderButton className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-yarn-dark transition hover:bg-blush-50">
              <Wand2 size={18} aria-hidden="true" />
              Open custom order form
            </CustomOrderButton>
          </div>
        </div>
      </section>
    </div>
  )
}
