import { useEffect, useState } from 'react'
import { X, Wand2 } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { WHATSAPP_NUMBER } from '../../utils/instagram'

const initialForm = {
  name: '',
  contact: '',
  item: '',
  colors: '',
  deadline: '',
  details: '',
}

function buildWhatsAppUrl(form) {
  const message = [
    'Hi! I want to place a custom crochet order.',
    '',
    `Name: ${form.name || '-'}`,
    `Contact: ${form.contact || '-'}`,
    `Item: ${form.item || '-'}`,
    `Colors: ${form.colors || '-'}`,
    `Needed by: ${form.deadline || '-'}`,
    `Details: ${form.details || '-'}`,
  ].join('\n')

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

function CustomOrderModal({ open, onClose }) {
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const submitOrder = (event) => {
    event.preventDefault()
    window.open(buildWhatsAppUrl(form), '_blank', 'noopener,noreferrer')
    setForm(initialForm)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        className="absolute inset-0 bg-yarn-dark/70 backdrop-blur-sm"
        aria-label="Close custom order form"
        onClick={onClose}
      />

      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-white bg-gradient-to-br from-white via-blush-50 to-[#fff4d8] p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-yarn-blush shadow-sm">
              <Wand2 size={16} aria-hidden="true" />
              Custom order form
            </p>
            <h2 className="mt-4 font-display text-3xl text-yarn-dark sm:text-4xl">Tell us what to make</h2>
            <p className="mt-2 text-sm leading-6 text-[#75625d]">
              Fill this out and submit it through WhatsApp so we receive all the details together.
            </p>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-yarn-dark shadow-sm transition hover:bg-blush-100"
            aria-label="Close custom order form"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={submitOrder} className="mt-6 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-yarn-dark">
              Name
              <input
                value={form.name}
                onChange={updateField('name')}
                className="mt-2 w-full rounded-2xl border border-blush-200 bg-white px-4 py-3 text-sm text-yarn-dark outline-none transition focus:border-yarn-blush focus:ring-2 focus:ring-blush-100"
                placeholder="Your name"
                required
              />
            </label>
            <label className="text-sm font-semibold text-yarn-dark">
              Phone or Instagram
              <input
                value={form.contact}
                onChange={updateField('contact')}
                className="mt-2 w-full rounded-2xl border border-blush-200 bg-white px-4 py-3 text-sm text-yarn-dark outline-none transition focus:border-yarn-blush focus:ring-2 focus:ring-blush-100"
                placeholder="@username or phone"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-yarn-dark">
              What do you want?
              <input
                value={form.item}
                onChange={updateField('item')}
                className="mt-2 w-full rounded-2xl border border-blush-200 bg-white px-4 py-3 text-sm text-yarn-dark outline-none transition focus:border-yarn-blush focus:ring-2 focus:ring-blush-100"
                placeholder="Keychain, bookmark, flowers..."
                required
              />
            </label>
            <label className="text-sm font-semibold text-yarn-dark">
              Preferred colors
              <input
                value={form.colors}
                onChange={updateField('colors')}
                className="mt-2 w-full rounded-2xl border border-blush-200 bg-white px-4 py-3 text-sm text-yarn-dark outline-none transition focus:border-yarn-blush focus:ring-2 focus:ring-blush-100"
                placeholder="Pink, cream, yellow..."
              />
            </label>
          </div>

          <label className="text-sm font-semibold text-yarn-dark">
            Needed by
            <input
              value={form.deadline}
              onChange={updateField('deadline')}
              className="mt-2 w-full rounded-2xl border border-blush-200 bg-white px-4 py-3 text-sm text-yarn-dark outline-none transition focus:border-yarn-blush focus:ring-2 focus:ring-blush-100"
              placeholder="Date or occasion"
            />
          </label>

          <label className="text-sm font-semibold text-yarn-dark">
            Design details
            <textarea
              value={form.details}
              onChange={updateField('details')}
              className="mt-2 min-h-32 w-full resize-y rounded-2xl border border-blush-200 bg-white px-4 py-3 text-sm text-yarn-dark outline-none transition focus:border-yarn-blush focus:ring-2 focus:ring-blush-100"
              placeholder="Size, theme, reference idea, gift message, quantity..."
              required
            />
          </label>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-yarn-blush to-yarn-gold px-7 py-4 font-semibold text-white shadow-lg shadow-blush-200/70 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <FaWhatsapp size={18} aria-hidden="true" />
            Submit on WhatsApp
          </button>
        </form>
      </div>
    </div>
  )
}

export default function CustomOrderButton({ children = 'Custom order', className = '' }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      <CustomOrderModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
