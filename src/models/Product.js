// models/Product.js — defines the Product schema shape and helpers

export const PRODUCT_CATEGORIES = [
  { value: 'bags', label: 'Bags & Totes' },
  { value: 'home_decor', label: 'Home Décor' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'baby', label: 'Baby & Kids' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'custom', label: 'Custom Orders' },
]

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  DRAFT: 'draft',
  OUT_OF_STOCK: 'out_of_stock',
}

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
