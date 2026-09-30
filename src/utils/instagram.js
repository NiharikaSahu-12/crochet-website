export const INSTAGRAM_HANDLE = import.meta.env.VITE_INSTAGRAM_HANDLE || 'thecozzyloops'
export const INSTAGRAM_DM_URL = `https://ig.me/m/${INSTAGRAM_HANDLE}`
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'
export const EMAIL = import.meta.env.VITE_EMAIL || 'thecozzyloops@gmail.com'

// Human-friendly version of the WhatsApp number for display, kept in sync
// with WHATSAPP_NUMBER so the UI never shows a different number than the
// one the chat buttons actually open.
export const WHATSAPP_DISPLAY = (() => {
  const digits = String(WHATSAPP_NUMBER).replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`
  }
  return `+${digits}`
})()

export const openInstagramDM = () => {
  window.open(INSTAGRAM_DM_URL, '_blank', 'noopener,noreferrer')
}

export const buildProductOrderMessage = (product = null, details = {}) => {
  if (!product) return `Hi! I'd like to place a custom crochet order.`

  const productUrl = typeof window !== 'undefined' ? window.location.href : ''
  const lines = [
    'Hi! I want to order this crochet product.',
    '',
    `Product: ${product.name}`,
    `Price: Rs ${Number(product.price || 0).toLocaleString()}`,
    `Category: ${product.category || '-'}`,
    `Product ID: ${product.id || '-'}`,
    productUrl ? `Product link: ${productUrl}` : '',
    '',
    'Customer details:',
    `Name: ${details.name || '-'}`,
    `Phone/Instagram: ${details.contact || '-'}`,
    `Quantity: ${details.quantity || 1}`,
    `Preferred color: ${details.color || '-'}`,
    product.is_custom ? `Customization: ${details.customization || '-'}` : '',
    `Delivery note: ${details.delivery || '-'}`,
  ]

  return lines.filter(Boolean).join('\n')
}

export const getWhatsAppOrderUrl = (product = null, whatsappNumber = '', details = {}) => {
  const msg = product
    ? buildProductOrderMessage(product, details)
    : `Hi! I'd like to place a custom crochet order.`

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`
}
