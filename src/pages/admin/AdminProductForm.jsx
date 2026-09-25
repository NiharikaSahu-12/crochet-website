import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Package,
  Plus,
  Save,
  Sparkles,
  Tag,
  Trash2,
  UploadCloud,
  X,
  ExternalLink,
  Wand2,
  Layers,
  Info,
  DollarSign
} from 'lucide-react'
import productController from '../../controllers/productController'
import { PRODUCT_STATUS, createProductDTO } from '../../models/Product'
import { useCategories } from '../../hooks/useCategories'
import toast from 'react-hot-toast'

const EMPTY_FORM = createProductDTO({
  name: '',
  description: '',
  price: '',
  compare_price: '',
  category: '',
  images: [],
  stock_qty: 1,
  status: PRODUCT_STATUS.ACTIVE,
  is_featured: false,
  is_custom: false,
  yarn_type: '',
  color_options: [],
  care_instructions: '',
  tags: [],
})

function Field({ label, required, children, helper }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
        {label} {required && <span className="text-terracotta-600">*</span>}
      </label>
      {children}
      {helper && <p className="text-[11px] text-ink-subtle">{helper}</p>}
    </div>
  )
}

function TagInput({ label, values = [], onChange, placeholder }) {
  const [input, setInput] = useState('')

  const add = () => {
    const value = input.trim()
    if (value && !values.includes(value)) {
      onChange([...values, value])
    }
    setInput('')
  }

  return (
    <Field label={label}>
      <div className="flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-xl border border-canvas-border bg-white p-2 focus-within:border-ink transition-colors">
        {values.map((value) => (
          <span 
            key={value} 
            className="inline-flex items-center gap-1 rounded-lg bg-canvas-subtle border border-canvas-border px-2.5 py-1 text-xs font-medium text-ink"
          >
            <span>{value}</span>
            <button 
              type="button" 
              onClick={() => onChange(values.filter((item) => item !== value))} 
              className="text-ink-subtle hover:text-rose-600 transition-colors"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <div className="flex-1 flex items-center min-w-[140px]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                add()
              }
            }}
            className="w-full bg-transparent px-2 py-1 text-xs outline-none placeholder:text-ink-subtle"
            placeholder={placeholder}
          />
          <button 
            type="button" 
            onClick={add} 
            className="shrink-0 text-xs font-medium px-2 py-1 rounded bg-canvas-subtle hover:bg-canvas text-ink-muted transition-colors border border-canvas-border"
          >
            Add
          </button>
        </div>
      </div>
    </Field>
  )
}

function ImageStudio({ images = [], onChange, productId }) {
  const [urlInput, setUrlInput] = useState('')
  const [uploading, setUploading] = useState(false)

  const addUrl = () => {
    const url = urlInput.trim()
    if (url && !images.includes(url)) {
      onChange([...images, url])
    }
    setUrlInput('')
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await productController.uploadProductImage(file, productId || 'new-products')
      onChange([...images, url])
      toast.success('Creation image uploaded')
    } catch (err) {
      toast.error('Upload failed: ' + (err.message || 'Error uploading image'))
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-canvas-border p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-canvas-border">
        <div>
          <h3 className="font-editorial text-lg font-semibold text-ink">Visual Gallery</h3>
          <p className="text-xs text-ink-subtle">First image will serve as the primary storefront cover.</p>
        </div>
        <ImagePlus size={18} className="text-terracotta-600" />
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-2 gap-3">
        {images.map((img, index) => (
          <div 
            key={`${img}-${index}`} 
            className="group relative aspect-square rounded-xl overflow-hidden border border-canvas-border bg-canvas-subtle"
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
            
            {index === 0 && (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-ink/80 text-white text-[10px] font-mono tracking-wider backdrop-blur-xs">
                Cover
              </span>
            )}

            <button
              type="button"
              onClick={() => onChange(images.filter((_, i) => i !== index))}
              className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
              title="Remove image"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        {/* Upload Trigger Box */}
        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-canvas-border hover:border-terracotta-500 bg-canvas-subtle/50 text-center transition-colors p-3">
          {uploading ? (
            <div className="w-6 h-6 border-2 border-terracotta-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <div className="w-9 h-9 rounded-xl bg-white border border-canvas-border flex items-center justify-center text-terracotta-600 shadow-xs mb-2">
                <UploadCloud size={18} />
              </div>
              <span className="text-xs font-semibold text-ink">Upload photo</span>
              <span className="text-[10px] text-ink-subtle mt-0.5">JPG, PNG, WebP</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      {/* Paste URL Input */}
      <div className="pt-2">
        <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-muted mb-1.5">
          Or Add Photo by Online URL
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addUrl()
              }
            }}
            className="input-field py-2 text-xs flex-1"
            placeholder="https://images.unsplash.com/..."
          />
          <button 
            type="button" 
            onClick={addUrl} 
            className="btn-outline px-3 py-2 text-xs shrink-0 inline-flex items-center gap-1"
          >
            <Plus size={13} /> Add
          </button>
        </div>
      </div>
    </div>
  )
}

function ToggleOption({ title, desc, icon: Icon, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full flex items-start justify-between gap-3 p-4 rounded-xl border text-left transition-all ${
        checked 
          ? 'border-terracotta-500 bg-terracotta-50/50 shadow-xs' 
          : 'border-canvas-border bg-white hover:border-zinc-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
          checked ? 'bg-terracotta-600 text-white' : 'bg-canvas-subtle text-ink-muted'
        }`}>
          <Icon size={16} />
        </div>
        <div>
          <p className="text-xs font-semibold text-ink">{title}</p>
          <p className="text-[11px] text-ink-subtle mt-0.5 leading-relaxed">{desc}</p>
        </div>
      </div>
      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
        checked ? 'bg-terracotta-600 border-terracotta-600 text-white' : 'border-zinc-300 bg-white'
      }`}>
        {checked && <Check size={12} strokeWidth={3} />}
      </div>
    </button>
  )
}

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const { categories, loading: categoriesLoading } = useCategories({ activeOnly: true })

  const activeCategories = useMemo(() => categories.filter((c) => c.is_active), [categories])

  useEffect(() => {
    if (!isEditing) return
    productController.getProduct(id)
      .then((product) => setForm({ 
        ...product, 
        price: product.price || '', 
        compare_price: product.compare_price || '' 
      }))
      .catch(() => {
        toast.error('Product not found in catalog')
        navigate('/admin/products')
      })
      .finally(() => setLoading(false))
  }, [id, isEditing, navigate])

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
        stock_qty: parseInt(form.stock_qty, 10) || 0,
      }

      if (isEditing) {
        await productController.updateProduct(id, payload)
        toast.success('Creation updated successfully')
      } else {
        const created = await productController.createProduct(payload)
        toast.success('New creation added to atelier')
        navigate(`/admin/products/${created.id}/edit`)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28">
        <div className="w-9 h-9 rounded-full border-2 border-terracotta-600 border-t-transparent animate-spin mb-3" />
        <p className="text-xs text-ink-subtle font-mono uppercase tracking-wider">Loading atelier creation...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-canvas-border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Link
            to="/admin/products"
            className="w-10 h-10 rounded-xl bg-canvas-subtle hover:bg-canvas flex items-center justify-center text-ink-muted hover:text-ink transition-colors border border-canvas-border shrink-0"
            title="Return to products"
          >
            <ArrowLeft size={17} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-terracotta-600 font-semibold">
                {isEditing ? 'Curator Edit' : 'New Workshop Piece'}
              </span>
            </div>
            <h1 className="font-editorial text-2xl font-semibold text-ink mt-0.5">
              {isEditing ? form.name || 'Edit Product' : 'Create New Product'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing && (
            <Link
              to={`/shop/${id}`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline text-xs px-3.5 py-2 inline-flex items-center gap-1.5"
            >
              <ExternalLink size={13} />
              <span>Preview Live</span>
            </Link>
          )}
          <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
            form.status === 'active' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : form.status === 'draft' 
              ? 'bg-zinc-100 text-zinc-600 border border-zinc-200' 
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {form.status}
          </span>
        </div>
      </div>

      {/* Main 2-Column Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Product Info (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-2xl border border-canvas-border p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-canvas-border">
              <div className="w-8 h-8 rounded-lg bg-terracotta-50 text-terracotta-600 flex items-center justify-center">
                <Package size={17} />
              </div>
              <div>
                <h3 className="font-editorial text-lg font-semibold text-ink">Essential Details</h3>
                <p className="text-xs text-ink-subtle">Core identity of this handcrafted piece</p>
              </div>
            </div>

            <Field label="Creation Name" required helper="e.g., Everlasting Pastel Tulip & Daisy Bouquet">
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="input-field text-sm"
                placeholder="Name your crochet creation..."
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Category" required helper="Select the relevant atelier collection">
                <select
                  required
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className="input-field text-xs capitalize"
                >
                  <option value="">{categoriesLoading ? 'Loading...' : 'Select Category'}</option>
                  {activeCategories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Status" helper="Controls visibility in customer store">
                <select
                  value={form.status}
                  onChange={(e) => set('status', e.target.value)}
                  className="input-field text-xs capitalize"
                >
                  <option value={PRODUCT_STATUS.ACTIVE}>Active (Visible to Shoppers)</option>
                  <option value={PRODUCT_STATUS.DRAFT}>Draft (Internal Workshop Only)</option>
                  <option value={PRODUCT_STATUS.OUT_OF_STOCK}>Out of Stock</option>
                </select>
              </Field>
            </div>

            <Field label="Description" helper="Describe size, hand-stitched textures, symbolism, and presentation">
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={4}
                className="input-field text-xs resize-y"
                placeholder="Handcrafted with 100% premium milk cotton yarn, featuring delicate scalloped petals and a satin ribbon..."
              />
            </Field>
          </div>

          {/* Pricing & Inventory Card */}
          <div className="bg-white rounded-2xl border border-canvas-border p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-canvas-border">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign size={17} />
              </div>
              <div>
                <h3 className="font-editorial text-lg font-semibold text-ink">Pricing & Inventory</h3>
                <p className="text-xs text-ink-subtle">Set retail prices, discounts, and ready-to-ship quantities</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Retail Price (INR)" required helper="Amount charged to customer">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink-muted">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    className="input-field pl-8 text-xs font-medium"
                    placeholder="899"
                  />
                </div>
              </Field>

              <Field label="Compare At Price (INR)" helper="Original price before discount">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink-muted">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.compare_price || ''}
                    onChange={(e) => set('compare_price', e.target.value)}
                    className="input-field pl-8 text-xs font-medium"
                    placeholder="1099"
                  />
                </div>
              </Field>

              <Field label="Stock Quantity" helper="Available stock count">
                <input
                  type="number"
                  min="0"
                  value={form.stock_qty}
                  onChange={(e) => set('stock_qty', e.target.value)}
                  className="input-field text-xs font-medium"
                  placeholder="5"
                />
              </Field>
            </div>
          </div>

          {/* Artisan Craft Specifications Card */}
          <div className="bg-white rounded-2xl border border-canvas-border p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-canvas-border">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Layers size={17} />
              </div>
              <div>
                <h3 className="font-editorial text-lg font-semibold text-ink">Artisan Specifications</h3>
                <p className="text-xs text-ink-subtle">Handmade yarn materials, care guide, and available palettes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Yarn Type / Material" helper="e.g. 100% Milk Cotton, Cozy Chenille">
                <input
                  type="text"
                  value={form.yarn_type}
                  onChange={(e) => set('yarn_type', e.target.value)}
                  className="input-field text-xs"
                  placeholder="Soft Milk Cotton Yarn"
                />
              </Field>

              <Field label="Care Instructions" helper="Washing and handling advice">
                <input
                  type="text"
                  value={form.care_instructions}
                  onChange={(e) => set('care_instructions', e.target.value)}
                  className="input-field text-xs"
                  placeholder="Spot clean with damp cloth, air dry in shade"
                />
              </Field>
            </div>

            <TagInput
              label="Color Palette Options"
              values={form.color_options}
              onChange={(val) => set('color_options', val)}
              placeholder="Type color (e.g. Peach Pink) & press Enter"
            />

            <TagInput
              label="Discovery Tags"
              values={form.tags}
              onChange={(val) => set('tags', val)}
              placeholder="Type tag (e.g. bouquet, gift, bestseller) & press Enter"
            />
          </div>
        </div>

        {/* Right Column: Visuals & Actions (1 span) */}
        <div className="space-y-6">
          {/* Visual Gallery Studio */}
          <ImageStudio
            images={form.images}
            onChange={(imgs) => set('images', imgs)}
            productId={id}
          />

          {/* Curation & Homepage Highlights */}
          <div className="bg-white rounded-2xl border border-canvas-border p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-canvas-border">
              <h3 className="font-editorial text-lg font-semibold text-ink">Storefront Curation</h3>
              <p className="text-xs text-ink-subtle">Promote in featured carousel and custom studios</p>
            </div>

            <div className="space-y-3">
              <ToggleOption
                title="Featured Atelier Piece"
                desc="Showcase in homepage top picks and hero highlight sections."
                icon={Sparkles}
                checked={form.is_featured}
                onChange={(val) => set('is_featured', val)}
              />

              <ToggleOption
                title="Customizable Studio Item"
                desc="Flag as open for customer color, flower, or sizing customizations."
                icon={Wand2}
                checked={form.is_custom}
                onChange={(val) => set('is_custom', val)}
              />
            </div>
          </div>

          {/* Sticky Save / Cancel Action Bar */}
          <div className="sticky bottom-6 bg-white/95 backdrop-blur-md rounded-2xl border border-canvas-border p-4 shadow-lifted space-y-2.5">
            <button
              type="submit"
              disabled={saving}
              className="w-full btn-primary py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-subtle disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>{isEditing ? 'Save Updates' : 'Publish Creation'}</span>
                </>
              )}
            </button>

            <Link
              to="/admin/products"
              className="w-full btn-outline py-2.5 text-xs text-center block"
            >
              Cancel & Return
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
