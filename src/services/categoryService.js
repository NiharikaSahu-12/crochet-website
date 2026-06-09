import supabase from './supabase'
import { PRODUCT_CATEGORIES, createCategoryDTO } from '../models/Product'

const TABLE = 'categories'

function fallbackCategories() {
  return PRODUCT_CATEGORIES.map((category, index) =>
    createCategoryDTO({
      ...category,
      id: category.value,
      sort_order: category.sort_order ?? index + 1,
    })
  )
}

function toDatabasePayload(category) {
  const { id, created_at, updated_at, ...payload } = category
  return {
    ...payload,
  }
}

export const categoryService = {
  async getAll({ activeOnly = false } = {}) {
    let query = supabase.from(TABLE).select('*').order('sort_order', { ascending: true }).order('label', { ascending: true })
    if (activeOnly) query = query.eq('is_active', true)

    const { data, error } = await query
    if (error) {
      console.warn('categories table unavailable, using defaults:', error.message)
      return fallbackCategories().filter((category) => !activeOnly || category.is_active)
    }

    const categories = (data || []).map(createCategoryDTO)
    return categories.length ? categories : fallbackCategories()
  },

  async create(category) {
    const payload = toDatabasePayload(category)
    const { data, error } = await supabase.from(TABLE).insert([payload]).select().single()
    if (error) throw error
    return createCategoryDTO(data)
  },

  async update(id, updates) {
    const payload = toDatabasePayload(updates)
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return createCategoryDTO(data)
  },

  async delete(id) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
    return true
  },
}

export default categoryService
