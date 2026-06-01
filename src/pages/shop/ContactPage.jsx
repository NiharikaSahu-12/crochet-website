import { FaInstagram, FaHeart, FaEnvelope, FaWhatsapp } from 'react-icons/fa'
import { INSTAGRAM_DM_URL, INSTAGRAM_HANDLE, WHATSAPP_NUMBER, EMAIL, getWhatsAppOrderUrl } from '../../utils/instagram'

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="font-script text-yarn-blush text-2xl mb-2">Get in touch</p>
        <h1 className="font-display text-5xl text-yarn-dark mb-4">Contact Us</h1>
        <p className="text-gray-500 max-w-md mx-auto">Have a question, custom order request, or just want to say hi? Choose your preferred way to reach us!</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-12">
        <a
          href={`mailto:${EMAIL}`}
          className="group bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <FaEnvelope size={28} className="text-white" />
          </div>
          <h3 className="font-display text-xl text-yarn-dark mb-2">Email</h3>
          <p className="text-gray-500 text-sm mb-3">Send us an email</p>
          <span className="text-yellow-700 font-medium text-xs break-all">{EMAIL}</span>
        </a>

        <a
          href={INSTAGRAM_DM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <FaInstagram size={28} className="text-white" />
          </div>
          <h3 className="font-display text-xl text-yarn-dark mb-2">Instagram DM</h3>
          <p className="text-gray-500 text-sm mb-3">Fastest way to order!</p>
          <span className="text-purple-600 font-medium text-sm">@{INSTAGRAM_HANDLE}</span>
        </a>

        <a
          href={getWhatsAppOrderUrl(null, WHATSAPP_NUMBER)}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <FaWhatsapp size={28} className="text-white" />
          </div>
          <h3 className="font-display text-xl text-yarn-dark mb-2">WhatsApp</h3>
          <p className="text-gray-500 text-sm mb-3">Message us directly</p>
          <span className="text-green-700 font-medium text-sm">Chat now</span>
        </a>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-blush-100 text-center">
        <FaHeart size={32} className="text-yarn-blush mx-auto mb-4" style={{fill: 'rgba(205, 92, 92, 0.2)'}} />
        <h3 className="font-display text-2xl text-yarn-dark mb-3">Custom Orders Welcome!</h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          Want something made specifically for you? Reach out through any of the above methods with your ideas — colours, sizes, designs — and we'll bring your vision to life!
        </p>
      </div>
    </div>
  )
}
