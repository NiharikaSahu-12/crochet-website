import { Link } from 'react-router-dom'
import { ArrowRight, Wand2, Sparkles, Scissors, Heart, ShieldCheck, Feather, Flower2 } from 'lucide-react'
import { useShop } from '../../context/ShopContext'

const CRAFT_STEPS = [
  {
    num: '01',
    title: 'Choosing Soft Yarn',
    desc: 'We choose soft 4-ply and 5-ply milk cotton yarn that feels gentle, does not pill or scratch, and comes in lovely colors.',
  },
  {
    num: '02',
    title: 'Crocheting by Hand',
    desc: 'Every flower petal, stem, and bow is crocheted by hand. Careful stitching makes sure the shape stays nice and firm.',
  },
  {
    num: '03',
    title: 'Shaping & Quality Check',
    desc: 'We check every single piece, secure loose threads, and shape the petals neatly so they look great on your desk or bag.',
  },
  {
    num: '04',
    title: 'Neat Gift Packaging',
    desc: 'Your order is packed in eco-friendly paper with soft cotton string, a cute bow, and a handwritten note card.',
  },
]

const FIBERS = [
  {
    name: 'Milk Cotton Yarn',
    badge: 'Our Favorite',
    desc: 'Super soft yarn that feels gentle like a cloud. It is safe for sensitive skin and baby gifts.',
  },
  {
    name: 'Bamboo Cotton Blend',
    badge: 'Silky & Light',
    desc: 'Smooth and lightweight yarn that works great for delicate flower bookmarks.',
  },
  {
    name: 'Chenille Velvet',
    badge: 'Fluffy & Puffy',
    desc: 'Super soft and squishy velvet yarn used for puffy flower keychains and cute charms.',
  },
]

export default function AboutPage() {
  const { openCustomStudio } = useShop()

  return (
    <div className="bg-canvas min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Hero Banner */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="font-mono text-xs uppercase tracking-editorial text-terracotta-700">
              Our Story
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl font-bold text-ink leading-[1.1]">
              Handmade with love, <br />
              <span className="italic font-normal font-serif text-terracotta-700">
                care, and soft yarn.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-light">
              TheCozzyLoops started with a simple idea: making cute, handmade gifts that last. 
              We believe everyday things — like a bookmark in your favorite book, a keychain on your keys, or a crochet flower on your desk — feel much more special when made by hand.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary text-xs sm:text-sm px-6 py-3.5">
                <span>Shop All Products</span>
                <ArrowRight size={15} />
              </Link>
              <button
                onClick={() => openCustomStudio()}
                className="btn-outline text-xs sm:text-sm px-6 py-3.5 bg-white"
              >
                <Wand2 size={15} className="text-terracotta-600" />
                <span>Custom Orders</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-white border border-canvas-border shadow-lifted">
              <img
                src="/images/about_1.jpg"
                alt="Crochet workspace and handcrafted floral pieces"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="p-6 bg-white border-t border-canvas-border">
                <p className="font-editorial text-lg font-bold text-ink">
                  Every loop is made by hand
                </p>
                <p className="text-xs text-ink-muted mt-1">
                  Crocheted by Niharika with love and patience in small batches.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The 4-step Crafting Process */}
        <div className="border-t border-canvas-border pt-16">
          <div className="max-w-2xl mb-12">
            <span className="font-mono text-xs uppercase tracking-editorial text-terracotta-700">
              How We Work
            </span>
            <h2 className="mt-2 font-editorial text-3xl sm:text-4xl font-bold text-ink">
              How Each Piece is Made
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              From soft yarn to your doorstep, here is how each item is made.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CRAFT_STEPS.map((step) => (
              <div
                key={step.num}
                className="bg-white p-6 rounded-2xl border border-canvas-border shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-terracotta-700">
                    {step.num}
                  </span>
                  <h3 className="font-editorial text-lg font-bold text-ink mt-3">
                    {step.title}
                  </h3>
                  <p className="text-xs text-ink-muted mt-2 leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Fiber Studio */}
        <div id="yarn-studio" className="bg-canvas-subtle p-8 sm:p-12 rounded-3xl border border-canvas-border">
          <div className="max-w-2xl mb-8">
            <span className="font-mono text-xs uppercase tracking-editorial text-terracotta-700">
              Our Materials
            </span>
            <h2 className="mt-2 font-editorial text-3xl sm:text-4xl font-bold text-ink">
              Soft Yarns We Use
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              We never use rough or itchy yarn. Here are the quality yarns we pick for our products:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FIBERS.map((f) => (
              <div key={f.name} className="bg-white p-6 rounded-2xl border border-canvas-border shadow-xs">
                <span className="text-[11px] font-mono uppercase tracking-wider text-terracotta-700 font-semibold">
                  {f.badge}
                </span>
                <h3 className="font-editorial text-xl font-bold text-ink mt-2">
                  {f.name}
                </h3>
                <p className="text-xs text-ink-muted mt-2 leading-relaxed font-light">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Commission Callout Banner */}
        <div className="bg-ink text-white rounded-3xl p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-float">
          <span className="font-mono text-xs uppercase tracking-editorial text-terracotta-400">
            Custom Orders
          </span>
          <h2 className="mt-3 font-editorial text-3xl sm:text-4xl font-bold">
            Want something made just for you?
          </h2>
          <p className="mt-3 text-sm text-ink-subtle max-w-xl mx-auto leading-relaxed">
            Need special colors for a birthday gift, a wedding, or your favorite book? 
            We are always happy to crochet it for you.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => openCustomStudio()}
              className="btn-primary bg-terracotta-600 hover:bg-terracotta-700 text-xs sm:text-sm px-7 py-3.5"
            >
              <Wand2 size={16} />
              <span>Start a Custom Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
