import { ArrowUpRight, CheckCircle2, Clock, Mail, MapPin, MessageCircle, Send, Sparkles, Wand2 } from 'lucide-react'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import CustomOrderButton from '../../components/shop/CustomOrderButton'
import { INSTAGRAM_DM_URL, INSTAGRAM_HANDLE, WHATSAPP_NUMBER, EMAIL, getWhatsAppOrderUrl } from '../../utils/instagram'

const contactMethods = [
  {
    title: 'Instagram',
    value: `@${INSTAGRAM_HANDLE}`,
    href: INSTAGRAM_DM_URL,
    icon: FaInstagram,
    external: true,
    tone: 'bg-blush-50 text-yarn-blush border-blush-100',
  },
  {
    title: 'WhatsApp',
    value: 'Chat now',
    href: getWhatsAppOrderUrl(null, WHATSAPP_NUMBER),
    icon: FaWhatsapp,
    external: true,
    tone: 'bg-green-50 text-green-700 border-green-100',
  },
  {
    title: 'Email',
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    icon: Mail,
    external: false,
    tone: 'bg-[#fff4d8] text-yarn-dark border-yarn-gold/20',
  },
]

const checklist = [
  'Product name or reference idea',
  'Preferred colors and quantity',
  'Needed date or delivery city',
]

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-b from-[#fffaf6] via-white to-blush-50">
      <section className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-blush-200 bg-white px-4 py-2 text-sm font-semibold text-yarn-blush shadow-sm">
            <Send size={16} aria-hidden="true" />
            Contact
          </p>
          <h1 className="mt-5 font-display text-4xl leading-tight text-yarn-dark sm:text-5xl">
            Reach out for orders, questions, or custom crochet ideas.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#6b5551] sm:text-base">
            Pick one channel below. For custom work, use the form so every detail reaches us clearly.
          </p>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {contactMethods.map(({ title, value, href, icon: Icon, external, tone }) => (
            <a
              key={title}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className={`group flex items-center justify-between gap-4 rounded-2xl border ${tone} px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block font-display text-lg text-yarn-dark">{title}</span>
                  <span className="block truncate text-xs font-semibold opacity-75">{value}</span>
                </span>
              </span>
              <ArrowUpRight size={17} className="shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="grid overflow-hidden rounded-[30px] border border-blush-100 bg-white shadow-xl shadow-blush-100/70 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-gradient-to-br from-yarn-dark via-blush-900 to-yarn-blush p-6 text-white sm:p-8">
            <Sparkles size={28} className="text-blush-200" aria-hidden="true" />
            <h2 className="mt-5 font-display text-3xl sm:text-4xl">Custom orders</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-blush-100">
              For personalized pieces, send the important details first. It saves back-and-forth and helps us confirm faster.
            </p>
            <CustomOrderButton className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-yarn-dark transition hover:bg-blush-50">
              <Wand2 size={18} aria-hidden="true" />
              Open custom form
            </CustomOrderButton>
          </div>

          <div className="p-6 sm:p-8">
            <h3 className="font-display text-2xl text-yarn-dark">Before you message</h3>
            <div className="mt-5 space-y-3">
              {checklist.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-blush-50/70 px-4 py-3">
                  <CheckCircle2 size={18} className="shrink-0 text-green-600" aria-hidden="true" />
                  <p className="text-sm font-medium text-yarn-dark">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-blush-100 bg-white p-4">
                <Clock size={19} className="text-yarn-blush" aria-hidden="true" />
                <p className="mt-3 font-semibold text-yarn-dark">Reply time</p>
                <p className="mt-1 text-sm leading-6 text-gray-500">We reply fastest on Instagram or WhatsApp.</p>
              </div>
              <div className="rounded-2xl border border-blush-100 bg-white p-4">
                <MapPin size={19} className="text-yarn-blush" aria-hidden="true" />
                <p className="mt-3 font-semibold text-yarn-dark">Delivery note</p>
                <p className="mt-1 text-sm leading-6 text-gray-500">Mention your city and needed date for gifts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-blush-100 bg-gradient-to-r from-blush-50 via-white to-[#fff4d8] p-6 text-center">
          <MessageCircle size={24} className="mx-auto text-yarn-blush" aria-hidden="true" />
          <p className="mt-3 font-display text-2xl text-yarn-dark">Please send clear order details in one message.</p>
          <p className="mt-2 text-sm text-gray-500">That helps us identify who ordered and what they selected.</p>
        </div>
      </section>
    </div>
  )
}
