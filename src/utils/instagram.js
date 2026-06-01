export const INSTAGRAM_HANDLE = import.meta.env.VITE_INSTAGRAM_HANDLE
export const INSTAGRAM_DM_URL = `https://ig.me/m/${INSTAGRAM_HANDLE}`
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER
export const EMAIL = import.meta.env.VITE_EMAIL

export const openInstagramDM = () => {
  window.open(INSTAGRAM_DM_URL, '_blank', 'noopener,noreferrer')
}

export const getWhatsAppOrderUrl = (product = null, whatsappNumber = '') => {
  const msg = product
    ? `Hi! I'd love to order: *${product.name}* (₹${product.price}). Please let me know the availability!`
    : `Hi! I'd like to place a custom crochet order.`
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`
}