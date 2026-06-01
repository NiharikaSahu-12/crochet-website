// controllers/productController.js — business logic between UI and service
import productService from '../services/productService'
import { PRODUCT_STATUS } from '../models/Product'

export const productController = {
  async listProducts(filters = {}) {
    try {
      return await productService.getAll(filters)
    } catch (err) {
      console.error('listProducts error:', err)
      throw new Error('Failed to load products')
    }
  },

  async getProduct(id) {
    try {
      return await productService.getById(id)
    } catch (err) {
      throw new Error('Product not found')
    }
  },

  async createProduct(formData) {
    const errors = validateProductForm(formData)
    if (errors.length) throw new Error(errors.join(', '))
    return productService.create(formData)
  },

  async updateProduct(id, formData) {
    const errors = validateProductForm(formData)
    if (errors.length) throw new Error(errors.join(', '))
    return productService.update(id, formData)
  },

  async deleteProduct(id) {
    return productService.delete(id)
  },

  async toggleFeatured(id, currentValue) {
    return productService.update(id, { is_featured: !currentValue })
  },

  async toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === PRODUCT_STATUS.ACTIVE
      ? PRODUCT_STATUS.DRAFT
      : PRODUCT_STATUS.ACTIVE
    return productService.update(id, { status: newStatus })
  },

  async uploadProductImage(file, productId) {
    const ext = file.name.split('.').pop()
    const path = `${productId}/${Date.now()}.${ext}`
    return productService.uploadImage(file, path)
  },

  async getFeaturedProducts() {
    return productService.getFeatured()
  },
}

function validateProductForm(data) {
  const errors = []
  if (!data.name?.trim()) errors.push('Product name is required')
  if (!data.price || isNaN(data.price) || data.price <= 0) errors.push('Valid price is required')
  if (!data.category) errors.push('Category is required')
  return errors
}

export default productController
