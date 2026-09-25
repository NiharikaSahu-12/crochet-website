import supabase from './supabase'
import { PRODUCT_CATEGORIES, createCategoryDTO } from '../models/Product'

const TABLE = 'categories'
const LOCAL_STORAGE_KEY = 'cozzyloops_local_categories'

function fallbackCategories() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(createCategoryDTO)
      }
    }
  } catch (err) {
    console.warn('Could not read local categories:', err)
  }

  return PRODUCT_CATEGORIES.map((category, index) =>
    createCategoryDTO({
      ...category,
      id: category.value,
      sort_order: category.sort_order ?? index + 1,
    })
  )
}

function saveLocalCategories(cats) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cats))
  } catch (err) {
    console.warn('Could not save local categories:', err)
  }
}

function toDatabasePayload(category) {
  const { id, created_at, updated_at, ...payload } = category
  return {
    ...payload,
  }
}

export const categoryService = {
  async getAll({ activeOnly = false } = {}) {
    try {
      let query = supabase.from(TABLE).select('*').order('sort_order', { ascending: true }).order('label', { ascending: true })
      if (activeOnly) query = query.eq('is_active', true)

      const { data, error } = await query
      if (!error && data && data.length > 0) {
        return data.map(createCategoryDTO)
      }
    } catch (err) {
      console.warn('categories table unavailable, using defaults:', err.message)
    }

    const categories = fallbackCategories()
    return categories.filter((category) => !activeOnly || category.is_active)
  },

  async create(category) {
    const payload = toDatabasePayload(category)
    try {
      const { data, error } = await supabase.from(TABLE).insert([payload]).select().single()
      if (!error && data) return createCategoryDTO(data)
    } catch {
      // Fallback
    }

    const newCat = createCategoryDTO({
      ...payload,
      id: payload.value || `cat-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    const list = [...fallbackCategories(), newCat]
    saveLocalCategories(list)
    return newCat
  },

  async update(id, updates) {
    const payload = toDatabasePayload(updates)
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (!error && data) return createCategoryDTO(data)
    } catch {
      // Fallback
    }

    const list = fallbackCategories()
    const index = list.findIndex(c => String(c.id) === String(id) || c.value === id)
    if (index !== -1) {
      list[index] = createCategoryDTO({ ...list[index], ...payload, updated_at: new Date().toISOString() })
      saveLocalCategories(list)
      return list[index]
    }
    return createCategoryDTO(payload)
  },

  async delete(id) {
    try {
      const { error } = await supabase.from(TABLE).delete().eq('id', id)
      if (!error) {
        const list = fallbackCategories().filter(c => String(c.id) !== String(id) && c.value !== id)
        saveLocalCategories(list)
        return true
      }
    } catch {
      // Fallback
    }

    const list = fallbackCategories().filter(c => String(c.id) !== String(id) && c.value !== id)
    saveLocalCategories(list)
    return true
  },
}

export default categoryService
