import { useState, useEffect } from 'react'
import { X, Sparkles, Wand2, Check, ArrowRight, Palette, Layers, Gift, Clock } from 'lucide-react'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { useShop } from '../../context/ShopContext'
import { WHATSAPP_NUMBER, INSTAGRAM_DM_URL } from '../../utils/instagram'
import toast from 'react-hot-toast'

const ARCHETYPES = [
  { id: 'bouquet', name: 'Flower Bouquet', basePrice: 499, time: '3–5 days', desc: 'Handmade crochet flower bouquet tied with ribbon' },
  { id: 'potted', name: 'Potted Flower', basePrice: 449, time: '3–4 days', desc: 'Cute mini crochet flower pot for desks or shelves' },
  { id: 'bookmark', name: 'Flower Bookmark', basePrice: 199, time: '1–2 days', desc: 'Leafy stem with a cute handmade flower' },
  { id: 'keychain', name: 'Bow Keychain', basePrice: 149, time: '1–2 days', desc: 'Pretty bag charm with sturdy metal keyring' },
  { id: 'bespoke', name: 'Custom Idea / Other', basePrice: 399, time: '4–7 days', desc: 'Send us a photo or share your own crochet idea' },
]

const YARNS = [
  { id: 'milk-cotton', name: 'Soft Milk Cotton', extra: 0, tag: 'Most Popular', desc: 'Very soft, neat stitches, safe for skin' },
  { id: 'bamboo', name: 'Bamboo Cotton Blend', extra: 60, tag: 'Silky & Light', desc: 'Smooth, shiny, and lightweight finish' },
  { id: 'chenille', name: 'Chenille Velvet', extra: 80, tag: 'Super Fluffy', desc: 'Squishy and soft for cute puffy charms' },
]

const SWATCHES = [
  { name: 'Vintage Rose', hex: '#D28873' },
  { name: 'Warm Terracotta', hex: '#A8533D' },
  { name: 'Sage Green', hex: '#7E9F7B' },
  { name: 'Deep Forest', hex: '#385237' },
  { name: 'Buttercream', hex: '#F6E6C3' },
  { name: 'Honey Mustard', hex: '#C4823F' },
  { name: 'Lavender Mist', hex: '#B8A8D6' },
  { name: 'Cloud White', hex: '#FAF8F5' },
  { name: 'Soft Denim Blue', hex: '#879EB8' },
  { name: 'Espresso Cocoa', hex: '#4A3728' },
]

const FINISHES = [
  { id: 'gold-hardware', name: 'Gold-Tone Bag Clasp', extra: 40 },
  { id: 'brass-ring', name: 'Sturdy Keyring', extra: 20 },
  { id: 'wood-tag', name: 'Wooden Initial Letter Tag', extra: 75 },
  { id: 'gift-box', name: 'Gift Box with Handwritten Note', extra: 90 },
]

export default function CustomStudioModal() {
  const { isCustomStudioOpen, closeCustomStudio, customStudioDefaults } = useShop()

  const [archetype, setArchetype] = useState(ARCHETYPES[0].id)
  const [yarn, setYarn] = useState(YARNS[0].id)
  const [selectedColors, setSelectedColors] = useState(['Vintage Rose', 'Sage Green'])
  const [customColorNote, setCustomColorNote] = useState('')
  const [selectedFinishes, setSelectedFinishes] = useState(['gift-box'])
  const [deadline, setDeadline] = useState('')
  const [customRequestText, setCustomRequestText] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerContact, setCustomerContact] = useState('')

  useEffect(() => {
    if (customStudioDefaults) {
      if (customStudioDefaults.category === 'bouquets') setArchetype('bouquet')
      else if (customStudioDefaults.category === 'keychains') setArchetype('keychain')
      else if (customStudioDefaults.category === 'flowers') setArchetype('bookmark')
      else setArchetype('bespoke')

      if (customStudioDefaults.name) {
        setCustomRequestText(`Reference base piece: ${customStudioDefaults.name}`)
      }
    }
  }, [customStudioDefaults])

  if (!isCustomStudioOpen) return null

  const selectedArchObj = ARCHETYPES.find((a) => a.id === archetype) || ARCHETYPES[0]
  const selectedYarnObj = YARNS.find((y) => y.id === yarn) || YARNS[0]
  const finishesTotal = selectedFinishes.reduce((sum, fid) => {
    const f = FINISHES.find((item) => item.id === fid)
    return sum + (f?.extra || 0)
  }, 0)

  const estimatedTotal = selectedArchObj.basePrice + selectedYarnObj.extra + finishesTotal

  const toggleColor = (name) => {
    if (selectedColors.includes(name)) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter((c) => c !== name))
      }
    } else {
      if (selectedColors.length < 4) {
        setSelectedColors([...selectedColors, name])
      } else {
        toast('Selected up to 4 colors. Add extra tones in notes below!')
      }
    }
  }

  const toggleFinish = (id) => {
    if (selectedFinishes.includes(id)) {
      setSelectedFinishes(selectedFinishes.filter((f) => f !== id))
    } else {
      setSelectedFinishes([...selectedFinishes, id])
    }
  }

  const buildSummary = () => {
    const finishNames = selectedFinishes.map((fId) => FINISHES.find((f) => f.id === fId)?.name).filter(Boolean)

    return [
      `🎨 *CUSTOM CROCHET ORDER REQUEST*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `*Item:* ${selectedArchObj.name}`,
      `*Yarn:* ${selectedYarnObj.name}`,
      `*Colors:* ${selectedColors.join(', ')}${customColorNote ? ` (${customColorNote})` : ''}`,
      `*Add-ons & Packaging:* ${finishNames.length ? finishNames.join(' + ') : 'None'}`,
      `*Estimated Cost:* ₹${estimatedTotal.toLocaleString()}`,
      `*Need By:* ${deadline || 'Flexible'}`,
      `*Name:* ${customerName || 'Friend'} (${customerContact || 'DM'})`,
      `*Notes:* ${customRequestText || 'Standard order'}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Hi Niharika! Could you let me know if you can make this and when it would be ready?`,
    ].join('\n')
  }

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault()
    const summary = buildSummary()
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(summary)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    closeCustomStudio()
  }

  const handleInstagramSubmit = async (e) => {
    e.preventDefault()
    const summary = buildSummary()
    try {
      await navigator.clipboard.writeText(summary)
      toast.success('Order details copied! Opening Instagram DM...')
    } catch {
      toast.success('Opening Instagram DM...')
    }
    window.open(INSTAGRAM_DM_URL, '_blank', 'noopener,noreferrer')
    closeCustomStudio()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity" 
        onClick={closeCustomStudio}
      />

      <div className="relative w-full max-w-4xl bg-canvas rounded-3xl border border-canvas-border shadow-float overflow-hidden z-10 max-h-[92vh] flex flex-col animate-fade-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-canvas-border bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-terracotta-100 flex items-center justify-center text-terracotta-700">
              <Wand2 size={16} />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold text-ink">Custom Crochet Studio</h2>
              <p className="text-xs text-ink-muted">Choose your favorite colors, yarn type, and gift box</p>
            </div>
          </div>
          <button
            onClick={closeCustomStudio}
            className="p-2 text-ink-muted hover:text-ink rounded-full hover:bg-canvas-subtle transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form className="flex-1 overflow-y-auto p-6 space-y-7">
          {/* Step 1: Base Item */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <span className="font-mono text-terracotta-600">01.</span> What would you like us to make?
              </label>
              <span className="text-xs text-ink-muted">Ready in: {selectedArchObj.time}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ARCHETYPES.map((arch) => {
                const active = arch.id === archetype
                return (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => setArchetype(arch.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      active
                        ? 'border-terracotta-600 bg-white ring-2 ring-terracotta-500/20 shadow-subtle'
                        : 'border-canvas-border bg-white/70 hover:border-ink/20 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-ink">{arch.name}</span>
                      <span className="font-mono text-xs font-bold text-terracotta-700">₹{arch.basePrice}</span>
                    </div>
                    <p className="text-xs text-ink-muted mt-1 leading-snug">{arch.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 2: Yarn selection */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-3">
              <span className="font-mono text-terracotta-600">02.</span> Choose Yarn Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {YARNS.map((y) => {
                const active = y.id === yarn
                return (
                  <button
                    key={y.id}
                    type="button"
                    onClick={() => setYarn(y.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      active
                        ? 'border-terracotta-600 bg-white ring-2 ring-terracotta-500/20 shadow-subtle'
                        : 'border-canvas-border bg-white/70 hover:border-ink/20 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-ink">{y.name}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-canvas-subtle text-ink-muted">
                        {y.tag}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted mt-1 leading-snug">{y.desc}</p>
                    {y.extra > 0 && (
                      <span className="inline-block mt-2 font-mono text-[11px] text-terracotta-700 font-medium">
                        +₹{y.extra}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 3: Color Palette Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <span className="font-mono text-terracotta-600">03.</span> Choose Colors (Pick 1 to 4)
              </label>
              <span className="text-xs text-ink-muted">
                Selected: <span className="font-semibold text-ink">{selectedColors.join(', ')}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 bg-white p-3.5 rounded-2xl border border-canvas-border">
              {SWATCHES.map((swatch) => {
                const isSelected = selectedColors.includes(swatch.name)
                return (
                  <button
                    key={swatch.name}
                    type="button"
                    onClick={() => toggleColor(swatch.name)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all text-xs ${
                      isSelected
                        ? 'border-ink bg-canvas-subtle font-semibold text-ink'
                        : 'border-canvas-border hover:border-ink/20 text-ink-muted'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-xs"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <span className="truncate">{swatch.name}</span>
                    {isSelected && <Check size={12} className="ml-auto text-ink shrink-0" />}
                  </button>
                )
              })}
            </div>

            <input
              type="text"
              placeholder="Any specific color shade or photo link you want us to match (optional)..."
              value={customColorNote}
              onChange={(e) => setCustomColorNote(e.target.value)}
              className="input-field mt-2.5 text-xs py-2.5"
            />
          </div>

          {/* Step 4: Finishes & Packaging */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2.5">
              <span className="font-mono text-terracotta-600">04.</span> Add-ons & Packaging
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {FINISHES.map((finish) => {
                const active = selectedFinishes.includes(finish.id)
                return (
                  <button
                    key={finish.id}
                    type="button"
                    onClick={() => toggleFinish(finish.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all text-xs ${
                      active
                        ? 'border-terracotta-600 bg-white ring-1 ring-terracotta-500/30'
                        : 'border-canvas-border bg-white/70 hover:bg-white text-ink-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${active ? 'bg-terracotta-600 border-terracotta-600 text-white' : 'border-ink/30'}`}>
                        {active && <Check size={10} />}
                      </div>
                      <span className="text-ink font-medium">{finish.name}</span>
                    </div>
                    <span className="font-mono font-medium text-terracotta-700">+₹{finish.extra}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 5: Details & Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Your Name & Phone / Instagram *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="input-field py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Phone or @handle"
                  required
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  className="input-field py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                When do you need it? (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Next week for a birthday, or anytime"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="input-field py-2 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Special Requests or Details
              </label>
              <textarea
                rows={2}
                placeholder="Tell us any special details, letter initial, or design wishes..."
                value={customRequestText}
                onChange={(e) => setCustomRequestText(e.target.value)}
                className="input-field py-2 text-xs resize-none"
              />
            </div>
          </div>
        </form>

        {/* Footer sticky bar */}
        <div className="px-6 py-4 border-t border-canvas-border bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div>
            <div className="text-xs text-ink-muted">Estimated Total</div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-terracotta-700">
                ₹{estimatedTotal.toLocaleString()}
              </span>
              <span className="text-xs text-ink-subtle">
                ({selectedArchObj.name} + {selectedYarnObj.name})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleWhatsAppSubmit}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-medium text-xs py-3 px-5 rounded-full transition-all shadow-xs"
            >
              <FaWhatsapp size={15} />
              <span>Send on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleInstagramSubmit}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-ink hover:bg-ink-charcoal text-white font-medium text-xs py-3 px-5 rounded-full transition-all shadow-xs"
            >
              <FaInstagram size={15} />
              <span>Send on Instagram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
