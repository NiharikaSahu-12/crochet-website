// services/productService.js — all Supabase DB operations for products
import supabase from './supabase'
import { createProductDTO } from '../models/Product'

const TABLE = 'products'

export const productService = {
  async getAll(filters = {}) {
    let query = supabase.from(TABLE).select('*').order('created_at', { ascending: false })
    if (filters.category) query = query.eq('category', filters.category)
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.featured) query = query.eq('is_featured', true)
    if (filters.search) query = query.ilike('name', `%${filters.search}%`)
    const { data, error } = await query
    if (error) throw error
    return (data || []).map(createProductDTO)
  },

  async getById(id) {
    const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
    if (error) throw error
    return createProductDTO(data)
  },

  async create(product) {
  const { id, created_at, updated_at, ...productData } = product

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

    if (error) throw error
    return createProductDTO(data)
  },

  async update(id, updates) {
    const { id: _id, created_at, updated_at, ...payload } = updates
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return createProductDTO(data)
  },

  async delete(id) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
    return true
  },

  async getFeatured() {
    return this.getAll({ featured: true, status: 'active' })
  },

  async uploadImage(file, path) {
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (error) throw error
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(data.path)
    return urlData.publicUrl
  },

  async deleteImage(path) {
    const { error } = await supabase.storage.from('product-images').remove([path])
    if (error) throw error
    return true
  },
}

export default productService
