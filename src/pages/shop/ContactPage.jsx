import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Mail, Phone, MapPin, Send, MessageCircle, HelpCircle, 
  Sparkles, Wand2, Check, Copy, Clock, Gift, Heart, 
  Info, ArrowRight, CheckCircle2, ChevronDown, Truck, ShieldCheck
} from 'lucide-react'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { INSTAGRAM_HANDLE, INSTAGRAM_DM_URL, WHATSAPP_NUMBER, EMAIL } from '../../utils/instagram'
import toast from 'react-hot-toast'

const INQUIRY_TOPICS = [
  'Order Status & Tracking',
  'Product Question or Sizing',
  'Bulk & Event Gifting (Weddings, Birthdays, Giveaways)',
  'Shipping & Delivery Question',
  'Care & Washing Help',
  'Other / General Question',
]

const SHOP_FAQS = [
  {
    q: 'How do I track my order?',
    a: 'Once your order is ready and dispatched, we send an express tracking link on WhatsApp and email. You can also message us directly on WhatsApp with your name or order details anytime.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Ready-to-ship items are dispatched within 24 to 48 hours. Express delivery usually takes 3 to 5 business days across major Indian cities, and 5 to 7 days for regional locations.',
  },
  {
    q: 'How do I care for and wash my crochet items?',
    a: 'Spot clean with a damp cloth and mild soap whenever possible. For deeper cleaning, gently hand wash in cold water with mild detergent. Roll in a clean towel to absorb excess water, reshape by hand, and air dry flat. Avoid machine drying or wringing.',
  },
  {
    q: 'Do you offer bulk discounts for weddings or party favors?',
    a: 'Yes! We frequently make bookmarks, keychains, and mini flower pots for wedding return gifts, birthday parties, and corporate gifting. Contact us with your quantity and date for a special bulk discount.',
  },
  {
    q: 'Where are you based and do you ship internationally?',
    a: 'Our crochet studio is based in Bhubaneswar, Odisha, India. We ship all across India. For international orders, please send us a direct message on WhatsApp or Instagram with your location so we can arrange international courier shipping.',
  },
  {
    q: 'What is your return or exchange policy?',
    a: 'Because each piece is handmade in slow batches, we do not accept general returns. However, if your package arrives damaged or there is an issue with your piece, please contact us within 48 hours with photos and we will gladly make it right with a replacement.',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    topic: 'Order Status & Tracking',
    orderId: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  const buildMessage = () => {
    return [
      `💬 *INQUIRY FOR THE COZYLOOPS*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `*Name:* ${form.name || 'Friend'}`,
      `*Contact:* ${form.contact || 'Direct Chat'}`,
      `*Topic:* ${form.topic}`,
      form.orderId.trim() ? `*Order ID:* ${form.orderId.trim()}` : null,
      `*Message:* ${form.message || '(No message provided)'}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Hi Niharika! Could you please help me with this inquiry?`,
    ].filter(Boolean).join('\n')
  }

  const handleSendWhatsApp = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Please enter your name!')
      return
    }
    if (!form.message.trim()) {
      toast.error('Please enter your message!')
      return
    }

    const text = buildMessage()
    const encoded = encodeURIComponent(text)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
    setSubmitted(true)
    toast.success('Opening WhatsApp chat!')
  }

  const handleCopyMessage = () => {
    if (!form.message.trim()) {
      toast.error('Please type a message first!')
      return
    }
    const text = buildMessage()
    navigator.clipboard.writeText(text)
    toast.success('Inquiry copied to clipboard!')
  }

  return (
    <div className="bg-canvas min-h-screen">
      {/* 1. Header Banner */}
      <section className="bg-canvas-subtle border-b border-canvas-border py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta-100/70 border border-terracotta-200/80 text-terracotta-800 text-xs font-mono uppercase tracking-editorial mb-4">
            <MessageCircle size={13} className="text-terracotta-600" />
            <span>Customer Care &amp; Support</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-ink tracking-tight">
            We’re Here to Help
          </h1>

          <p className="mt-4 text-base sm:text-lg text-ink-muted leading-relaxed font-light">
            Have questions about an order, delivery times, bulk event favors, or washing tips? Reach out directly via WhatsApp, Instagram, or the inquiry form below.
          </p>
        </div>
      </section>

      {/* 2. Custom Orders Notice Banner */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-10">
        <div className="bg-gradient-to-r from-terracotta-50 to-amber-50/50 border border-terracotta-200/90 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-terracotta-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Wand2 size={20} />
            </div>
            <div>
              <h4 className="font-editorial font-bold text-ink text-lg">
                Looking for a Custom Crochet Design?
              </h4>
              <p className="text-sm text-ink-muted mt-0.5 font-light">
                We have a dedicated Custom Orders Studio where you can choose flower styles, yarn textures, and color combinations.
              </p>
            </div>
          </div>
          <Link
            to="/custom-orders"
            className="btn-primary whitespace-nowrap"
          >
            <span>Open Custom Studio</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* 3. Main Contact Section (Channels + Inquiry Form) */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-10 items-start">

          {/* Left Column: Direct Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-terracotta-700 uppercase tracking-editorial">Quick Channels</span>
              <h2 className="font-editorial text-2xl font-bold text-ink mt-0.5">Get in Touch Directly</h2>
              <p className="text-xs text-ink-muted mt-1">
                For the fastest answer, send a message directly to Niharika on WhatsApp.
              </p>
            </div>

            {/* WhatsApp Card */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Niharika! I have a question about The CozyLoops.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 rounded-2xl bg-white border border-canvas-border hover:border-[#25D366] transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FaWhatsapp size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-editorial font-bold text-ink text-base group-hover:text-[#25D366] transition-colors">
                      WhatsApp Chat
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded">
                      Fastest
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted mt-0.5">+91 94399 22002</p>
                  <p className="text-[11px] text-ink-muted/80 mt-1">Replies usually within 1 hour</p>
                </div>
              </div>
            </a>

            {/* Instagram Card */}
            <a
              href={INSTAGRAM_DM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 rounded-2xl bg-white border border-canvas-border hover:border-terracotta-500 transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FaInstagram size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-editorial font-bold text-ink text-base group-hover:text-pink-600 transition-colors">
                    Instagram DM
                  </span>
                  <p className="text-xs text-ink-muted mt-0.5">@{INSTAGRAM_HANDLE}</p>
                  <p className="text-[11px] text-ink-muted/80 mt-1">Photos, behind-the-scenes & drops</p>
                </div>
              </div>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${EMAIL}`}
              className="block p-5 rounded-2xl bg-white border border-canvas-border hover:border-ink transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-canvas-subtle text-ink flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mail size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-editorial font-bold text-ink text-base">
                    Email Inquiry
                  </span>
                  <p className="text-xs text-ink-muted mt-0.5">{EMAIL}</p>
                  <p className="text-[11px] text-ink-muted/80 mt-1">For bulk orders & brand collaborations</p>
                </div>
              </div>
            </a>

            {/* Studio Hours & Location */}
            <div className="p-5 rounded-2xl bg-canvas-subtle border border-canvas-border space-y-3">
              <div className="flex items-start gap-3 text-xs text-ink-muted">
                <Clock size={16} className="text-terracotta-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-ink block">Working Hours</span>
                  <span>Monday – Saturday: 9:00 AM – 8:00 PM IST</span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs text-ink-muted">
                <MapPin size={16} className="text-terracotta-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-ink block">Studio Location</span>
                  <span>Bhubaneswar, Odisha, India • Delivering Nationwide & Worldwide</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-canvas-border shadow-xs">
            <div className="mb-6">
              <span className="text-xs font-mono font-bold text-terracotta-700 uppercase tracking-editorial">Message Form</span>
              <h2 className="font-editorial text-2xl font-bold text-ink mt-0.5">Send Us a Note</h2>
              <p className="text-xs text-ink-muted mt-1">
                Fill out the details and click send. It will format your message so you can easily send it on WhatsApp or copy it.
              </p>
            </div>

            <form onSubmit={handleSendWhatsApp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-ink-muted mb-1.5">
                    Your Name <span className="text-terracotta-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Ananya Sen"
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink-muted mb-1.5">
                    Phone / WhatsApp or Email
                  </label>
                  <input
                    type="text"
                    value={form.contact}
                    onChange={(e) => setForm((prev) => ({ ...prev, contact: e.target.value }))}
                    placeholder="e.g. +91 98765 43210"
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-ink-muted mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    value={form.topic}
                    onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
                    className="input-field text-sm bg-white"
                  >
                    {INQUIRY_TOPICS.map((topic) => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink-muted mb-1.5">
                    Order ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.orderId}
                    onChange={(e) => setForm((prev) => ({ ...prev, orderId: e.target.value }))}
                    placeholder="e.g. CL-2026-104"
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-ink-muted mb-1.5">
                  Your Message <span className="text-terracotta-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="How can we help you? Feel free to ask about sizing, delivery dates, or special requests..."
                  className="input-field text-sm resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <FaWhatsapp size={17} />
                  <span>Send on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="py-3 px-5 rounded-xl border border-canvas-border hover:bg-canvas-subtle text-ink font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Copy size={13} />
                  <span>Copy Message</span>
                </button>
              </div>

              {submitted && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Thank you! WhatsApp is opened. We will get back to you shortly.</span>
                </div>
              )}
            </form>
          </div>

        </div>
      </section>

      {/* 4. Customer Care & FAQs Accordion */}
      <section className="py-16 bg-white border-t border-canvas-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-mono uppercase tracking-editorial text-terracotta-700">
              Frequently Asked Questions
            </p>
            <h2 className="font-editorial text-3xl font-bold text-ink mt-1">
              Help & Information
            </h2>
            <p className="text-xs text-ink-muted mt-2">
              Common questions about delivery, washing, and how our crochet works.
            </p>
          </div>

          <div className="space-y-3">
            {SHOP_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div 
                  key={idx}
                  className="rounded-xl border border-canvas-border overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-canvas-subtle/40 transition-colors"
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
        </div>
      </section>
    </div>
  )
}
