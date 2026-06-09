import categoryService from '../services/categoryService'

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function validateCategory(data) {
  const errors = []
  if (!data.label?.trim()) errors.push('Category name is required')
  if (!data.value?.trim()) errors.push('Category value is required')
  return errors
}

export const categoryController = {
  slugify,

  async listCategories(filters = {}) {
    return categoryService.getAll(filters)
  },

  async createCategory(formData) {
    const payload = {
      ...formData,
      value: slugify(formData.value || formData.label || ''),
      label: formData.label?.trim() || '',
      description: formData.description?.trim() || '',
      sort_order: parseInt(formData.sort_order, 10) || 0,
      is_active: formData.is_active ?? true,
    }
    const errors = validateCategory(payload)
    if (errors.length) throw new Error(errors.join(', '))
    return categoryService.create(payload)
  },

  async updateCategory(id, formData) {
    const payload = {
      ...formData,
      value: slugify(formData.value || formData.label || ''),
      label: formData.label?.trim() || '',
      description: formData.description?.trim() || '',
      sort_order: parseInt(formData.sort_order, 10) || 0,
      is_active: formData.is_active ?? true,
    }
    const errors = validateCategory(payload)
    if (errors.length) throw new Error(errors.join(', '))
    return categoryService.update(id, payload)
  },

  async deleteCategory(id) {
    return categoryService.delete(id)
  },
}

export default categoryController
