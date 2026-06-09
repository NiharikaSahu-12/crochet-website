// models/Product.js - defines product and category schema shapes and helpers

export const PRODUCT_CATEGORIES = [
  { value: 'flowers', label: 'Crochet Flowers', description: 'Single crochet stems and floral keepsakes.', sort_order: 1, is_active: true },
  { value: 'bouquets', label: 'Crochet Bouquets', description: 'Gift-ready handmade bouquets.', sort_order: 2, is_active: true },
  { value: 'keychains', label: 'Crochet Keychains', description: 'Small charms and everyday accessories.', sort_order: 3, is_active: true },
  { value: 'scrunchies', label: 'Crochet Scrunchies', description: 'Soft handmade hair accessories.', sort_order: 4, is_active: true },
  { value: 'gifts', label: 'Handmade Gifts', description: 'Personalized crochet gifts.', sort_order: 5, is_active: true },
  { value: 'custom', label: 'Custom Orders', description: 'Made-to-order crochet requests.', sort_order: 6, is_active: true },
]

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  DRAFT: 'draft',
  OUT_OF_STOCK: 'out_of_stock',
}

export const createCategoryDTO = (raw = {}) => ({
  id: raw.id || null,
  value: raw.value || raw.slug || '',
  label: raw.label || raw.name || '',
  description: raw.description || '',
  sort_order: raw.sort_order ?? 0,
  is_active: raw.is_active ?? true,
  created_at: raw.created_at || null,
  updated_at: raw.updated_at || null,
})

export const createProductDTO = (raw = {}) => ({
  id: raw.id || null,
  name: raw.name || '',
  description: raw.description || '',
  price: raw.price || 0,
  compare_price: raw.compare_price || null,
  category: raw.category || '',
  images: raw.images || [],
  stock_qty: raw.stock_qty ?? 1,
  status: raw.status || PRODUCT_STATUS.ACTIVE,
  is_featured: raw.is_featured || false,
  is_custom: raw.is_custom || false,
  yarn_type: raw.yarn_type || '',
  color_options: raw.color_options || [],
  care_instructions: raw.care_instructions || '',
  tags: raw.tags || [],
  created_at: raw.created_at || null,
  updated_at: raw.updated_at || null,
})

export const isOnSale = (product) =>
  product.compare_price && product.compare_price > product.price

export const discountPercent = (product) => {
  if (!isOnSale(product)) return 0
  return Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
}
