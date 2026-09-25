import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Wand2, Sparkles, Check, Copy, Palette, Flower2, Clock, 
  Gift, Heart, Info, ArrowRight, CheckCircle2, MessageCircle, 
  HelpCircle, ShieldCheck, Feather, Star, ChevronDown, RefreshCw
} from 'lucide-react'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { INSTAGRAM_HANDLE, INSTAGRAM_DM_URL, WHATSAPP_NUMBER } from '../../utils/instagram'
import toast from 'react-hot-toast'

const PRODUCT_TYPES = [
  { id: 'bouquet', name: 'Flower Bouquet', desc: 'Handcrafted floral stems wrapped in kraft paper with cotton ribbon', icon: '💐', popular: true },
  { id: 'potted', name: 'Mini Potted Bloom', desc: 'Cute everlasting crochet plant in a tabletop terracotta or woven pot', icon: '🪴', popular: true },
  { id: 'bookmark', name: 'Floral Stem Bookmark', desc: 'Flat leafy stem with detailed flower head for book lovers', icon: '🔖', popular: true },
  { id: 'keychain', name: 'Bow & Flower Keychain', desc: 'Dainty bag charm with high-quality golden clip and metal ring', icon: '🎀', popular: true },
  { id: 'car_hanging', name: 'Car Mirror Charm', desc: 'Floral, strawberry, or bell pendant to brighten your car drives', icon: '🚗' },
  { id: 'scrunchie', name: 'Hair Scrunchie / Clips', desc: 'Gentle on hair, detailed crochet flowers on sturdy elastic', icon: '🌸' },
  { id: 'plush', name: 'Amigurumi Plush Toy', desc: 'Handmade plushies, cute animals, and soft desk buddies', icon: '🧸' },
  { id: 'other', name: 'Other / Custom Idea', desc: 'Bring your own Pinterest picture, unique color idea, or sketch', icon: '✨' },
]

const COLOR_SWATCHES = [
  { name: 'Soft Pastel Pink', hex: '#F7CAD0', border: 'border-pink-200' },
  { name: 'Terracotta Coral', hex: '#D97059', border: 'border-amber-200' },
  { name: 'Sage Leaf Green', hex: '#94A388', border: 'border-emerald-200' },
  { name: 'Oatmeal & Cream', hex: '#F3E8DC', border: 'border-stone-300' },
  { name: 'Lavender & Lilac', hex: '#C8B6E2', border: 'border-purple-200' },
  { name: 'Buttercup Yellow', hex: '#FDE08B', border: 'border-yellow-200' },
  { name: 'Baby Sky Blue', hex: '#A5C9E1', border: 'border-sky-200' },
  { name: 'Dusty Rose', hex: '#C47B89', border: 'border-rose-200' },
  { name: 'Matcha Olive', hex: '#7A9A60', border: 'border-lime-200' },
  { name: 'Warm Mocha / Brown', hex: '#8B5E3C', border: 'border-amber-700' },
  { name: 'Pure Snow White', hex: '#FFFFFF', border: 'border-stone-300' },
  { name: 'Multi-Color Mix', hex: 'linear-gradient(135deg, #F7CAD0, #FDE08B, #A5C9E1)', border: 'border-pink-300' },
]

const YARN_PREFERENCES = [
  { id: 'milk_cotton', label: 'Soft Milk Cotton', desc: 'Smooth, durable, skin-friendly, sharp stitch definition (Most Popular)' },
  { id: 'chenille', label: 'Fluffy Chenille Velvet', desc: 'Extra squishy cloud texture, velvety soft and warm' },
  { id: 'bamboo', label: 'Bamboo Cotton Blend', desc: 'Silky, lightweight drape with gentle natural sheen' },
  { id: 'any', label: 'Artisan Choice', desc: 'Let Niharika pick the yarn best suited for this exact design' },
]

const OCCASIONS = [
  'Birthday Gift',
  'Anniversary / Romance',
  'Graduation Keepsake',
  'Personal Treat / Self Care',
  'Best Friend Gift',
  'Baby Shower / Newborn',
  'Housewarming / Decor',
  'Other Celebration',
]

const CUSTOM_INSPIRATIONS = [
  {
    title: '5-Stem Pastel Tulip & Daisy Bouquet',
    category: 'Custom Bouquet',
    colors: 'Lavender, Soft Pink, Cream',
    image: '/images/hero_bouquet.jpg',
    story: 'Requested as a graduation gift that never wilts. Includes custom kraft wrapping and a wax seal card.',
    badge: 'Popular Request',
  },
  {
    title: 'Custom Potted Sunflower Bloom',
    category: 'Desk Keepsake',
    colors: 'Sunflower Yellow & Terracotta',
    image: '/images/potted_bloom.jpg',
    story: 'Everlasting desk bloom crocheted in a small ceramic pot with a personalized message card.',
    badge: 'Desk Favorite',
  },
  {
    title: 'Initial Letter Flower Bookmark',
    category: 'Personalized Bookmark',
    colors: 'Terracotta & Sage Green',
    image: '/images/floral_bookmark_hd.jpg',
    story: 'Crocheted daisy bloom with hand-stitched initial tag on the green stem for a book club member.',
    badge: 'Gift Favorite',
  },
  {
    title: 'Sweet Bunny Amigurumi Keepsake',
    category: 'Plush & Keepsakes',
    colors: 'Oatmeal Cream & Baby Blush',
    image: '/images/amigurumi_bunny.jpg',
    story: 'Handcrafted with velvety soft chenille yarn, matching floral collar, and safe embroidered eyes.',
    badge: 'Custom Plush',
  },
]

const CUSTOM_FAQS = [
  {
    q: 'How long does a custom crochet order take?',
    a: 'Small custom items (bookmarks, keychains, scrunchies) typically take 1 to 2 business days to crochet. Larger items like flower bouquets or amigurumi plushies take 3 to 5 days before dispatch. If you need it for a specific date, just let us know in the form!',
  },
  {
    q: 'Can I send a picture from Pinterest or Instagram?',
    a: 'Yes, absolutely! We love custom design challenges. After submitting your request, you can directly send your Pinterest pins, screenshots, or sketch on WhatsApp or Instagram DM.',
  },
  {
    q: 'How does pricing work for custom orders?',
    a: 'Custom pieces are priced transparently based on item size, yarn type, and crafting time. Most bookmarks and keychains range from ₹199 to ₹399, and bouquets range from ₹699 to ₹1,899. We share an exact quote before starting your piece.',
  },
  {
    q: 'Can you match specific wedding or event colors?',
    a: 'Yes! We carry over 40 shades of high-grade milk cotton and velvet yarns. You can share color swatches, event themes, or photos, and we will match the yarn shades perfectly.',
  },
  {
    q: 'How do I pay for my custom order?',
    a: 'We accept instant UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking, and Bank Transfer. Once we finalize your design details on WhatsApp or Instagram, we will share payment details.',
  },
  {
    q: 'Is gift packaging included?',
    a: 'Yes! Every single custom order comes carefully packed in a gift-ready aesthetic box with butter paper, ribbon, and a complimentary handwritten note card with your personal message.',
  },
]

export default function CustomOrdersPage() {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    productType: 'bouquet',
    customProductText: '',
    selectedColors: ['Soft Pastel Pink', 'Oatmeal & Cream'],
    customColorNotes: '',
    yarnType: 'milk_cotton',
    occasion: 'Birthday Gift',
    targetDate: '',
    additionalNotes: '',
    giftWrap: true,
    woodCharm: false,
  })

  const [submitted, setSubmitted] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  const toggleColor = (colorName) => {
    setForm((prev) => {
      const exists = prev.selectedColors.includes(colorName)
      if (exists) {
        if (prev.selectedColors.length === 1) return prev // keep at least 1
        return { ...prev, selectedColors: prev.selectedColors.filter((c) => c !== colorName) }
      } else {
        if (prev.selectedColors.length >= 4) {
          toast('You can pick up to 4 colors, or mention more in the notes below!', { icon: '🎨' })
          return prev
        }
        return { ...prev, selectedColors: [...prev.selectedColors, colorName] }
      }
    })
  }

  const selectedProductObj = PRODUCT_TYPES.find((p) => p.id === form.productType) || PRODUCT_TYPES[0]
  const selectedYarnObj = YARN_PREFERENCES.find((y) => y.id === form.yarnType) || YARN_PREFERENCES[0]

  const buildCustomSummary = () => {
    const productName = form.productType === 'other' && form.customProductText.trim()
      ? `Custom Idea: ${form.customProductText.trim()}`
      : selectedProductObj.name

    const addOns = []
    if (form.giftWrap) addOns.push('Free Gift Box & Handwritten Card')
    if (form.woodCharm) addOns.push('Personal Initial Wooden Charm')

    return [
      `🧶 *CUSTOM CROCHET ORDER REQUEST*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `*Item:* ${productName}`,
      `*Yarn Choice:* ${selectedYarnObj.label}`,
      `*Colors:* ${form.selectedColors.join(', ')}`,
      form.customColorNotes.trim() ? `*Color Notes:* ${form.customColorNotes.trim()}` : null,
      `*Occasion:* ${form.occasion}`,
      form.targetDate.trim() ? `*Needed By:* ${form.targetDate.trim()}` : `*Timeline:* Flexible`,
      addOns.length > 0 ? `*Packaging & Add-ons:* ${addOns.join(' + ')}` : null,
      `*Customer:* ${form.name || 'Friend'}`,
      `*Contact:* ${form.contact || 'WhatsApp'}`,
      form.additionalNotes.trim() ? `*Notes / Special Details:* ${form.additionalNotes.trim()}` : null,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Hi Niharika! I would love to order this custom crochet piece from The CozyLoops. Could you please share availability and pricing?`,
    ].filter(Boolean).join('\n')
  }

  const handleCopy = () => {
    const text = buildCustomSummary()
    navigator.clipboard.writeText(text)
    toast.success('Custom order summary copied to clipboard!')
  }

  const handleSendWhatsApp = () => {
    if (!form.name.trim()) {
      toast.error('Please enter your name so Niharika knows who is asking!')
      return
    }
    const text = buildCustomSummary()
    const encoded = encodeURIComponent(text)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
    setSubmitted(true)
    toast.success('Opening WhatsApp chat with Niharika!')
  }

  const handleSendInstagram = () => {
    if (!form.name.trim()) {
      toast.error('Please enter your name!')
      return
    }
    const text = buildCustomSummary()
    navigator.clipboard.writeText(text)
    window.open(INSTAGRAM_DM_URL, '_blank')
    setSubmitted(true)
    toast.success('Summary copied! Paste it in the Instagram DM chat.')
  }

  return (
    <div className="bg-canvas min-h-screen">
      {/* 1. Header Banner */}
      <section className="bg-canvas-subtle border-b border-canvas-border py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta-100/70 border border-terracotta-200/80 text-terracotta-800 text-xs font-mono uppercase tracking-editorial mb-4">
            <Wand2 size={13} className="text-terracotta-600" />
            <span>Custom Crochet Studio</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-ink tracking-tight">
            Bring Your Dream Crochet Idea to Life
          </h1>

          <p className="mt-4 text-base sm:text-lg text-ink-muted leading-relaxed font-light">
            Want a bouquet in your favorite shades, a personalized flower bookmark, or a cute animal plushie? Choose your colors, yarn, and details below. Each piece is lovingly crocheted by hand.
          </p>

          {/* Process steps */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            {[
              { num: '01', title: 'Pick Item & Colors', desc: 'Use our easy builder below' },
              { num: '02', title: 'Send to Niharika', desc: 'Direct WhatsApp or Instagram' },
              { num: '03', title: 'Crafted with Love', desc: 'Stitched with soft milk cotton' },
              { num: '04', title: 'Gift Boxed & Sent', desc: 'Fast delivery with gift card' },
            ].map((step) => (
              <div key={step.num} className="bg-white border border-canvas-border p-4 rounded-2xl shadow-xs">
                <span className="font-mono text-xs font-bold text-terracotta-700">{step.num}</span>
                <h4 className="font-editorial font-bold text-ink text-base mt-1">{step.title}</h4>
                <p className="text-xs text-ink-muted mt-0.5 font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Main Builder Section */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-10">

            {/* Step 1: Product Type */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-canvas-border shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-terracotta-700 uppercase tracking-editorial">Step 01</span>
                  <h2 className="font-editorial text-xl font-bold text-ink mt-0.5">What Would You Like Us to Make?</h2>
                </div>
                <span className="text-xs text-ink-muted hidden sm:inline">Select one option</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {PRODUCT_TYPES.map((type) => {
                  const selected = form.productType === type.id
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, productType: type.id }))}
                      className={`text-left p-3.5 rounded-xl border transition-all relative flex items-start gap-3 ${
                        selected
                          ? 'bg-terracotta-50/60 border-terracotta-600 ring-1 ring-terracotta-600 shadow-xs'
                          : 'bg-white hover:bg-canvas-subtle/50 border-canvas-border'
                      }`}
                    >
                      <span className="text-2xl mt-0.5 shrink-0">{type.icon}</span>
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-semibold truncate ${selected ? 'text-terracotta-900' : 'text-ink'}`}>
                            {type.name}
                          </span>
                          {type.popular && (
                            <span className="text-[10px] bg-terracotta-100 text-terracotta-800 font-mono px-1.5 py-0.2 rounded font-medium">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-ink-muted line-clamp-2 mt-0.5">{type.desc}</p>
                      </div>
                      {selected && (
                        <CheckCircle2 size={16} className="text-terracotta-600 shrink-0 absolute top-3.5 right-3" />
                      )}
                    </button>
                  )
                })}
              </div>

              {form.productType === 'other' && (
                <div className="pt-2 animate-fade-up">
                  <label className="block text-xs font-mono uppercase text-ink-muted mb-1.5">
                    Describe Your Custom Idea
                  </label>
                  <input
                    type="text"
                    value={form.customProductText}
                    onChange={(e) => setForm((prev) => ({ ...prev, customProductText: e.target.value }))}
                    placeholder="e.g. Strawberry tote bag, sunflower car hanging, cat plush..."
                    className="input-field text-sm"
                  />
                  <p className="text-[11px] text-ink-muted mt-1">
                    You can also share photos or Pinterest links on WhatsApp or Instagram after submitting!
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: Yarn Material */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-canvas-border shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-terracotta-700 uppercase tracking-editorial">Step 02</span>
                  <h2 className="font-editorial text-xl font-bold text-ink mt-0.5">Choose Yarn Type</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {YARN_PREFERENCES.map((yarn) => {
                  const selected = form.yarnType === yarn.id
                  return (
                    <button
                      key={yarn.id}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, yarnType: yarn.id }))}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        selected
                          ? 'bg-terracotta-50/60 border-terracotta-600 ring-1 ring-terracotta-600 shadow-xs'
                          : 'bg-white hover:bg-canvas-subtle/50 border-canvas-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${selected ? 'text-terracotta-900' : 'text-ink'}`}>
                          {yarn.label}
                        </span>
                        {selected && <Check size={14} className="text-terracotta-600" />}
                      </div>
                      <p className="text-xs text-ink-muted mt-1">{yarn.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 3: Color Preferences */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-canvas-border shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-terracotta-700 uppercase tracking-editorial">Step 03</span>
                  <h2 className="font-editorial text-xl font-bold text-ink mt-0.5">Pick Your Color Palette</h2>
                </div>
                <span className="text-xs font-mono text-terracotta-700 bg-terracotta-50 px-2 py-1 rounded">
                  {form.selectedColors.length}/4 selected
                </span>
              </div>

              <p className="text-xs text-ink-muted">
                Tap to pick 1 to 4 shades. We will use them for flower petals, stems, bows, or body colors.
              </p>

              {/* Swatch grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {COLOR_SWATCHES.map((swatch) => {
                  const isSelected = form.selectedColors.includes(swatch.name)
                  return (
                    <button
                      key={swatch.name}
                      type="button"
                      onClick={() => toggleColor(swatch.name)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-terracotta-50/70 border-terracotta-600 font-semibold text-ink shadow-2xs'
                          : 'bg-white hover:bg-canvas-subtle/40 border-canvas-border text-ink-muted'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full shrink-0 shadow-2xs border ${swatch.border}`}
                        style={{ background: swatch.hex }}
                      />
                      <span className="truncate flex-1">{swatch.name}</span>
                      {isSelected && <Check size={12} className="text-terracotta-600 shrink-0" />}
                    </button>
                  )
                })}
              </div>

              {/* Custom Color Text Field */}
              <div className="pt-2">
                <label className="block text-xs font-mono uppercase text-ink-muted mb-1.5">
                  Specific Color Combination or Instructions
                </label>
                <input
                  type="text"
                  value={form.customColorNotes}
                  onChange={(e) => setForm((prev) => ({ ...prev, customColorNotes: e.target.value }))}
                  placeholder="e.g. Lilac flowers with sage leaves and cream center, like my dress"
                  className="input-field text-sm"
                />
              </div>
            </div>

            {/* Step 4: Occasion, Timeline & Notes */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-canvas-border shadow-xs space-y-4">
              <div>
                <span className="text-xs font-mono font-bold text-terracotta-700 uppercase tracking-editorial">Step 04</span>
                <h2 className="font-editorial text-xl font-bold text-ink mt-0.5">Occasion & Timing</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-ink-muted mb-1.5">
                    What is the Occasion?
                  </label>
                  <select
                    value={form.occasion}
                    onChange={(e) => setForm((prev) => ({ ...prev, occasion: e.target.value }))}
                    className="input-field text-sm bg-white"
                  >
                    {OCCASIONS.map((occ) => (
                      <option key={occ} value={occ}>{occ}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink-muted mb-1.5">
                    Needed by Date (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.targetDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, targetDate: e.target.value }))}
                    placeholder="e.g. Next Saturday, or before Oct 15"
                    className="input-field text-sm"
                  />
                </div>
              </div>

              {/* Add-ons */}
              <div className="pt-2 space-y-2.5">
                <label className="block text-xs font-mono uppercase text-ink-muted">Packaging & Keepsakes</label>
                
                <label className="flex items-start gap-3 p-3 rounded-xl border border-canvas-border hover:bg-canvas-subtle/40 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={form.giftWrap}
                    onChange={(e) => setForm((prev) => ({ ...prev, giftWrap: e.target.checked }))}
                    className="mt-0.5 accent-terracotta-600 rounded w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                      <Gift size={13} className="text-terracotta-600" />
                      Free Handwritten Gift Card & Aesthetic Box (Included)
                    </span>
                    <p className="text-[11px] text-ink-muted">
                      Neatly packed in tissue paper and box with a handwritten note card.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-canvas-border hover:bg-canvas-subtle/40 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={form.woodCharm}
                    onChange={(e) => setForm((prev) => ({ ...prev, woodCharm: e.target.checked }))}
                    className="mt-0.5 accent-terracotta-600 rounded w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                      <Sparkles size={13} className="text-terracotta-600" />
                      Add Personalized Initial Charm (+₹49)
                    </span>
                    <p className="text-[11px] text-ink-muted">
                      Wooden tag engraved with your recipient's initial or special letter.
                    </p>
                  </div>
                </label>
              </div>

              {/* Additional notes */}
              <div className="pt-2">
                <label className="block text-xs font-mono uppercase text-ink-muted mb-1.5">
                  Additional Notes or Reference Links
                </label>
                <textarea
                  rows={3}
                  value={form.additionalNotes}
                  onChange={(e) => setForm((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                  placeholder="Share details like preferred flower types (tulips, daisies, lavender, roses), ribbon colors, or note card message..."
                  className="input-field text-sm resize-none"
                />
              </div>
            </div>

            {/* Step 5: Contact Information */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-canvas-border shadow-xs space-y-4">
              <div>
                <span className="text-xs font-mono font-bold text-terracotta-700 uppercase tracking-editorial">Step 05</span>
                <h2 className="font-editorial text-xl font-bold text-ink mt-0.5">Your Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-ink-muted mb-1.5">
                    Your Full Name <span className="text-terracotta-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Priya Sharma"
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink-muted mb-1.5">
                    WhatsApp Number or Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={form.contact}
                    onChange={(e) => setForm((prev) => ({ ...prev, contact: e.target.value }))}
                    placeholder="e.g. +91 98765 43210 or @priyacrafts"
                    className="input-field text-sm"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Request Summary & Action Card */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-white rounded-2xl border border-canvas-border shadow-md overflow-hidden">
              <div className="bg-ink text-white p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wand2 size={16} className="text-terracotta-400" />
                    <h3 className="font-editorial font-bold text-base text-white">Custom Request Summary</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-editorial bg-white/10 px-2 py-0.5 rounded text-white/80">
                    Live Preview
                  </span>
                </div>
                <p className="text-xs text-white/70 mt-1">
                  Ready to send to Niharika for instant confirmation & pricing.
                </p>
              </div>

              <div className="p-6 space-y-4">
                {/* Selected item highlight */}
                <div className="flex items-center gap-3 p-3 bg-canvas-subtle rounded-xl border border-canvas-border">
                  <span className="text-3xl">{selectedProductObj.icon}</span>
                  <div>
                    <span className="text-xs font-mono text-terracotta-700 uppercase font-semibold">Selected Item</span>
                    <h4 className="font-editorial font-bold text-ink text-base">
                      {form.productType === 'other' && form.customProductText.trim()
                        ? form.customProductText.trim()
                        : selectedProductObj.name}
                    </h4>
                    <span className="text-xs text-ink-muted">{selectedYarnObj.label}</span>
                  </div>
                </div>

                {/* Colors pill list */}
                <div>
                  <span className="text-[11px] font-mono uppercase text-ink-muted block mb-1.5">
                    Selected Color Palette ({form.selectedColors.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {form.selectedColors.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1.5 bg-canvas-subtle text-ink text-xs px-2.5 py-1 rounded-full border border-canvas-border">
                        <span className="w-2 h-2 rounded-full bg-terracotta-500" />
                        <span>{c}</span>
                      </span>
                    ))}
                  </div>
                  {form.customColorNotes.trim() && (
                    <p className="text-xs text-ink-muted italic mt-1.5 bg-canvas-subtle/50 p-2 rounded">
                      "{form.customColorNotes.trim()}"
                    </p>
                  )}
                </div>

                {/* Key metadata grid */}
                <div className="grid grid-cols-2 gap-2 text-xs border-y border-canvas-border py-3">
                  <div>
                    <span className="text-ink-muted block text-[10px] font-mono uppercase">Occasion</span>
                    <span className="font-medium text-ink">{form.occasion}</span>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px] font-mono uppercase">Target Date</span>
                    <span className="font-medium text-ink">{form.targetDate.trim() || 'Flexible'}</span>
                  </div>
                </div>

                {/* Customer name preview */}
                <div className="text-xs text-ink-muted">
                  <span>Customer: </span>
                  <span className="font-semibold text-ink">{form.name.trim() || '(Enter your name)'}</span>
                </div>

                {/* Submission CTA buttons */}
                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <FaWhatsapp size={18} />
                    <span>Send Request on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendInstagram}
                    className="w-full py-3.5 px-4 rounded-xl bg-ink hover:bg-ink-charcoal text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <FaInstagram size={18} />
                    <span>Send on Instagram DM</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="w-full py-2.5 px-4 rounded-xl border border-canvas-border hover:bg-canvas-subtle text-ink font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Copy size={13} />
                    <span>Copy Request Summary</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-ink-muted pt-2 text-center">
                  <Clock size={12} className="text-terracotta-600" />
                  <span>Usually responds within 1 to 2 hours</span>
                </div>
              </div>
            </div>

            {/* Quality assurance guarantee card */}
            <div className="p-5 rounded-2xl bg-terracotta-50/70 border border-terracotta-200/80 space-y-2">
              <div className="flex items-center gap-2 text-terracotta-900 font-semibold text-sm">
                <ShieldCheck size={16} className="text-terracotta-700" />
                <span>Handmade Promise</span>
              </div>
              <p className="text-xs text-terracotta-900/80 leading-relaxed font-light">
                Before sending out your piece, we share final photos of your finished crochet item on WhatsApp or Instagram so you can approve every stitch!
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Inspiration Showcase */}
      <section className="bg-white border-y border-canvas-border py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-mono uppercase tracking-editorial text-terracotta-700 font-semibold">
              Made for Customers Like You
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mt-2">
              Custom Creations Inspiration
            </h2>
            <p className="text-sm text-ink-muted mt-2 font-light">
              Here are some popular custom pieces we recently handcrafted for celebrations, gifts, and cozy desks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {CUSTOM_INSPIRATIONS.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-canvas rounded-2xl overflow-hidden border border-canvas-border flex flex-col justify-between hover:shadow-card transition-all duration-300"
              >
                {/* Photo frame */}
                <div className="aspect-[4/3] bg-stone-100 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono uppercase tracking-editorial bg-white/95 text-terracotta-800 px-2 py-0.5 rounded font-semibold shadow-xs">
                      {item.badge}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-editorial font-bold text-base text-ink">{item.title}</h3>
                    <div className="text-xs text-terracotta-700 font-mono mt-1">{item.colors}</div>
                    <p className="text-xs text-ink-muted mt-2 leading-relaxed font-light">{item.story}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-canvas-border flex items-center justify-between text-xs text-ink font-medium">
                    <span>{item.category}</span>
                    <span className="text-terracotta-700 text-[11px] font-mono">100% Handcrafted</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-mono uppercase tracking-editorial text-terracotta-700">
            Everything You Need to Know
          </p>
          <h2 className="font-editorial text-3xl font-bold text-ink mt-1">
            Custom Order FAQs
          </h2>
        </div>

        <div className="space-y-3">
          {CUSTOM_FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx
            return (
              <div 
                key={idx}
                className="bg-white rounded-xl border border-canvas-border overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4"
                >
                  <span className="font-editorial font-semibold text-ink text-base">
                    {faq.q}
                  </span>
                  <ChevronDown 
                    size={18} 
                    className={`text-ink-muted shrink-0 transition-transform ${isOpen ? 'rotate-180 text-terracotta-600' : ''}`} 
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-ink-muted leading-relaxed border-t border-canvas-border/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 5. Direct Contact Banner */}
      <section className="bg-canvas-subtle border-t border-canvas-border py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-editorial text-2xl font-bold text-ink">
            Have a Specific Reference Picture or Urgent Order?
          </h3>
          <p className="text-sm text-ink-muted mt-2 max-w-xl mx-auto">
            You can skip the form and chat with Niharika directly. Send your photo, budget, or preferred deadline.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Niharika! I have a question about a custom crochet design.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <FaWhatsapp size={15} />
              <span>Direct WhatsApp Chat</span>
            </a>
            <a
              href={INSTAGRAM_DM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink hover:bg-ink-charcoal text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <FaInstagram size={15} />
              <span>Send Instagram DM</span>
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-canvas-border bg-white text-ink hover:text-terracotta-700 text-xs font-medium transition-colors"
            >
              <span>General Help & Contact Page</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
