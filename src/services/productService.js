// services/productService.js — Supabase DB operations with local fallback
import supabase from './supabase'
import { createProductDTO, DEFAULT_PRODUCTS } from '../models/Product'

const TABLE = 'products'
const LOCAL_STORAGE_KEY = 'cozzyloops_local_products_v2'

function getLocalProducts() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(createProductDTO)
      }
    }
  } catch (err) {
    console.warn('Could not read local products:', err)
  }
  return DEFAULT_PRODUCTS.map(createProductDTO)
}

function saveLocalProducts(products) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products))
  } catch (err) {
    console.warn('Could not save local products:', err)
  }
}

export const productService = {
  async getAll(filters = {}) {
    try {
      let query = supabase.from(TABLE).select('*').order('created_at', { ascending: false })
      if (filters.category) query = query.eq('category', filters.category)
      if (filters.status) query = query.eq('status', filters.status)
      if (filters.featured) query = query.eq('is_featured', true)
      if (filters.search) query = query.ilike('name', `%${filters.search}%`)
      const { data, error } = await query
      if (error) throw error
      if (data && data.length > 0) {
        return data.map(createProductDTO)
      }
    } catch (err) {
      console.warn('Supabase products unavailable, using local products:', err.message)
    }

    // Fallback to local products
    let list = getLocalProducts()
    if (filters.category) list = list.filter(p => p.category === filters.category)
    if (filters.status) list = list.filter(p => p.status === filters.status)
    if (filters.featured) list = list.filter(p => Boolean(p.is_featured))
    if (filters.search) {
      const term = filters.search.toLowerCase()
      list = list.filter(p => p.name?.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term))
    }
    return list
  },

  async getById(id) {
    try {
      const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
      if (!error && data) return createProductDTO(data)
    } catch {
      // Fallback
    }

    const localList = getLocalProducts()
    const found = localList.find(p => String(p.id) === String(id))
    if (found) return found
    throw new Error('Product not found')
  },

  async create(product) {
    const { id, created_at, updated_at, ...productData } = product

    try {
      const { data, error } = await supabase
        .from(TABLE)
        .insert([
          {
            ...productData,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (!error && data) return createProductDTO(data)
    } catch (err) {
      console.warn('Supabase create failed, saving locally:', err.message)
    }

    // Local save
    const newProduct = createProductDTO({
      ...productData,
      id: `local-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    const list = [newProduct, ...getLocalProducts()]
    saveLocalProducts(list)
    return newProduct
  },

  async update(id, updates) {
    const { id: _id, created_at, updated_at, ...payload } = updates

    try {
      const { data, error } = await supabase
        .from(TABLE)
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (!error && data) return createProductDTO(data)
    } catch (err) {
      console.warn('Supabase update failed, updating locally:', err.message)
    }

    // Local update
    const list = getLocalProducts()
    const index = list.findIndex(p => String(p.id) === String(id))
    if (index !== -1) {
      list[index] = createProductDTO({ ...list[index], ...payload, updated_at: new Date().toISOString() })
      saveLocalProducts(list)
      return list[index]
    }
    throw new Error('Product not found')
  },

  async delete(id) {
    try {
      const { error } = await supabase.from(TABLE).delete().eq('id', id)
      if (!error) {
        const list = getLocalProducts().filter(p => String(p.id) !== String(id))
        saveLocalProducts(list)
        return true
      }
    } catch {
      // ignore
    }

    const list = getLocalProducts().filter(p => String(p.id) !== String(id))
    saveLocalProducts(list)
    return true
  },

  async getFeatured() {
    return this.getAll({ featured: true, status: 'active' })
  },

  async uploadImage(file, path) {
    try {
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (!error && data) {
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(data.path)
        return urlData.publicUrl
      }
    } catch (err) {
      console.warn('Supabase storage upload failed, using data URL fallback:', err.message)
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to read image file'))
      reader.readAsDataURL(file)
    })
  },

  async deleteImage(path) {
    try {
      const { error } = await supabase.storage.from('product-images').remove([path])
      if (error) throw error
    } catch {
      // ignore
    }
    return true
  },
}

export default productService
