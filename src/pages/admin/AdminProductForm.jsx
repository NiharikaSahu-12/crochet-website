import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { MdArrowBack, MdFileUpload, MdClose, MdAdd, MdDelete, MdImage } from 'react-icons/md'
import productController from '../../controllers/productController'
import { PRODUCT_CATEGORIES, PRODUCT_STATUS, createProductDTO } from '../../models/Product'
import toast from 'react-hot-toast'

const EMPTY_FORM = createProductDTO({
  name: '', description: '', price: '', compare_price: '',
  category: '', images: [], stock_qty: 1, status: PRODUCT_STATUS.ACTIVE,
  is_featured: false, is_custom: false, yarn_type: '',
  color_options: [], care_instructions: '', tags: [],
})

function TagInput({ label, values, onChange, placeholder }) {
  const [input, setInput] = useState('')
  const add = () => {
    const v = input.trim()
    if (v && !values.includes(v)) {
      onChange([...values, v])
    }
    setInput('')
  }
  return (
    <div>
      <label className="block text-sm font-medium text-yarn-dark mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map(v => (
          <span key={v} className="flex items-center gap-1 bg-blush-100 text-yarn-blush text-sm px-3 py-1.5 rounded-full">
            {v}
            <button type="button" onClick={() => onChange(values.filter(x => x !== v))} className="hover:text-red-500 ml-0.5">
              <MdClose size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() }}}
          className="input-field flex-1 py-2.5 text-sm"
          placeholder={placeholder}
        />
        <button type="button" onClick={add} className="px-4 py-2.5 bg-blush-100 text-yarn-blush rounded-xl text-sm font-medium hover:bg-blush-200 transition-colors">
          Add
        </button>
      </div>
    </div>
  )
}

function ImageUrlInput({ images = [], onChange, onUpload, productId }) {
  const [urlInput, setUrlInput] = useState('')
  const [uploading, setUploading] = useState(false)

  const addUrl = () => {
    const url = urlInput.trim()
    if (url && !images.includes(url)) onChange([...images, url])
    setUrlInput('')
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) {
      toast.error('Select a file to upload')
      return
    }
    setUploading(true)
    try {
      const url = await productController.uploadProductImage(file, productId)
      onChange([...images, url])
      toast.success('Image uploaded!')
    } catch (err) {
      toast.error('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-yarn-dark mb-1.5">Product Images</label>

      {/* Image previews */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {images.map((img, i) => (
          <div key={i} className="relative aspect-square bg-blush-50 rounded-xl overflow-hidden group">
            <img src={img} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, j) => j !== i))}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MdClose size={12} />
            </button>
            {i === 0 && <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">Main</span>}
          </div>
        ))}
        {images.length < 6 && (
          <label className="aspect-square bg-blush-50 border-2 border-dashed border-blush-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-yarn-blush hover:bg-blush-100 transition-all">
            {uploading
              ? <div className="w-6 h-6 border-2 border-yarn-blush border-t-transparent rounded-full animate-spin" />
              : <><MdFileUpload size={20} className="text-blush-300 mb-1" /><span className="text-xs text-blush-300">Upload</span></>}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        )}
      </div>

      {/* URL input */}
      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl() }}}
          className="input-field flex-1 py-2.5 text-sm"
          placeholder="Or paste an image URL..."
        />
        <button type="button" onClick={addUrl} className="px-4 py-2.5 bg-blush-100 text-yarn-blush rounded-xl text-sm font-medium hover:bg-blush-200 transition-colors">
          <MdAdd size={16} />
        </button>
      </div>
    </div>
  )
}

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEditing) return
    productController.getProduct(id)
      .then(p => setForm({ ...p, price: p.price || '', compare_price: p.compare_price || '' }))
      .catch(() => { toast.error('Product not found'); navigate('/admin/products') })
      .finally(() => setLoading(false))
  }, [id])

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
        stock_qty: parseInt(form.stock_qty) || 0,
      }
      if (isEditing) {
        await productController.updateProduct(id, payload)
        toast.success('Product updated!')
      } else {
        const created = await productController.createProduct(payload)
        toast.success('Product created!')
        navigate(`/admin/products/${created.id}/edit`)
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-yarn-blush border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/products" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-display text-2xl text-yarn-dark">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          <p className="text-gray-400 text-sm">Fill in all details for your crochet item</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-display text-lg text-yarn-dark border-b border-gray-100 pb-3">Basic Information</h3>

          <div>
            <label className="block text-sm font-medium text-yarn-dark mb-1.5">Product Name *</label>
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
              className="input-field" placeholder="e.g. Rustic Crochet Market Bag" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-yarn-dark mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
              className="input-field resize-none" rows={4} placeholder="Describe the product, its feel, dimensions, use..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-yarn-dark mb-1.5">Category *</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}
                className="input-field" required>
                <option value="">Select category</option>
                {PRODUCT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-yarn-dark mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className="input-field">
                <option value="active">Active (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-display text-lg text-yarn-dark border-b border-gray-100 pb-3">Pricing & Inventory</h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-yarn-dark mb-1.5">Price (₹) *</label>
              <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)}
                className="input-field" placeholder="999" min="0" step="0.01" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-yarn-dark mb-1.5">Compare at (₹)</label>
              <input type="number" value={form.compare_price || ''} onChange={(e) => set('compare_price', e.target.value)}
                className="input-field" placeholder="1299" min="0" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-yarn-dark mb-1.5">Stock Qty</label>
              <input type="number" value={form.stock_qty} onChange={(e) => set('stock_qty', e.target.value)}
                className="input-field" min="0" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-display text-lg text-yarn-dark border-b border-gray-100 pb-3 mb-4">Images</h3>
          <ImageUrlInput images={form.images} onChange={(v) => set('images', v)} productId={id} />
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-display text-lg text-yarn-dark border-b border-gray-100 pb-3">Product Details</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-yarn-dark mb-1.5">Yarn Type</label>
              <input type="text" value={form.yarn_type} onChange={(e) => set('yarn_type', e.target.value)}
                className="input-field" placeholder="e.g. Cotton, Wool, Acrylic" />
            </div>
            <div>
              <label className="block text-sm font-medium text-yarn-dark mb-1.5">Care Instructions</label>
              <input type="text" value={form.care_instructions} onChange={(e) => set('care_instructions', e.target.value)}
                className="input-field" placeholder="e.g. Hand wash cold" />
            </div>
          </div>

          <TagInput
            label="Color Options"
            values={form.color_options}
            onChange={(v) => set('color_options', v)}
            placeholder="e.g. Dusty Rose, Sage Green..."
          />

          <TagInput
            label="Tags"
            values={form.tags}
            onChange={(v) => set('tags', v)}
            placeholder="e.g. gift, summer, boho..."
          />
        </div>

        {/* Toggles */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-display text-lg text-yarn-dark border-b border-gray-100 pb-3">Options</h3>

          {[
            { key: 'is_featured', label: 'Featured Product', desc: 'Show on homepage featured section' },
            { key: 'is_custom', label: 'Customizable', desc: 'Allow customers to request custom variations' },
          ].map(({ key, label, desc }) => (
            <label key={key} className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-yarn-dark text-sm">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <div
                onClick={() => set(key, !form[key])}
                className={`w-12 h-6 rounded-full transition-colors relative ${form[key] ? 'bg-yarn-blush' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? 'translate-x-7' : 'translate-x-1'}`} />
              </div>
            </label>
          ))}
        </div>

        {/* Submit */}
        <div className="flex gap-3 pb-8">
          <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3.5 disabled:opacity-60">
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
            ) : (isEditing ? 'Update Product' : 'Create Product')}
          </button>
          <Link to="/admin/products" className="btn-outline px-8 py-3.5">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
