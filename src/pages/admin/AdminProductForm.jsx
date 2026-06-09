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

function Field({ label, children, helper }) {
  return (
    <label className="block text-sm font-semibold text-yarn-dark">
      {label}
      <div className="mt-2">{children}</div>
      {helper && <p className="mt-1.5 text-xs font-normal text-gray-400">{helper}</p>}
    </label>
  )
}

function TagInput({ label, values, onChange, placeholder }) {
  const [input, setInput] = useState('')

  const add = () => {
    const value = input.trim()
    if (value && !values.includes(value)) onChange([...values, value])
    setInput('')
  }

  return (
    <Field label={label}>
      <div className="flex min-h-11 flex-wrap gap-2 rounded-2xl border border-blush-200 bg-white p-2">
        {values.map((value) => (
          <span key={value} className="inline-flex items-center gap-1.5 rounded-full bg-blush-50 px-3 py-1.5 text-sm font-medium text-yarn-blush">
            {value}
            <button type="button" onClick={() => onChange(values.filter((item) => item !== value))} className="hover:text-red-500">
              <X size={13} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              add()
            }
          }}
          className="min-w-36 flex-1 bg-transparent px-2 py-1.5 text-sm outline-none"
          placeholder={placeholder}
        />
        <button type="button" onClick={add} className="rounded-full bg-blush-100 px-3 py-1.5 text-sm font-semibold text-yarn-blush transition hover:bg-blush-200">
          Add
        </button>
      </div>
    </Field>
  )
}

function ImageManager({ images = [], onChange, productId }) {
  const [urlInput, setUrlInput] = useState('')
  const [uploading, setUploading] = useState(false)

  const addUrl = () => {
    const url = urlInput.trim()
    if (url && !images.includes(url)) onChange([...images, url])
    setUrlInput('')
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await productController.uploadProductImage(file, productId || 'new-products')
      onChange([...images, url])
      toast.success('Image uploaded')
    } catch (err) {
      toast.error('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="rounded-[24px] border border-blush-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-blush-100 pb-4">
        <div>
          <h3 className="font-display text-xl text-yarn-dark">Product images</h3>
          <p className="text-sm text-gray-500">First image becomes the main product image.</p>
        </div>
        <ImagePlus className="text-yarn-blush" size={22} aria-hidden="true" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {images.map((image, index) => (
          <div key={`${image}-${index}`} className="group relative aspect-square overflow-hidden rounded-2xl bg-blush-50">
            <img src={image} alt="" className="h-full w-full object-cover" />
            {index === 0 && (
              <span className="absolute bottom-2 left-2 rounded-full bg-yarn-dark/75 px-2.5 py-1 text-xs font-semibold text-white">Main</span>
            )}
            <button
              type="button"
              onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index))}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
              aria-label="Remove image"
            >
              <Trash2 size={14} aria-hidden="true" />
            </button>
          </div>
        ))}

        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blush-200 bg-gradient-to-br from-blush-50 to-[#fff4d8] text-center transition hover:border-yarn-blush">
          {uploading ? (
            <span className="h-7 w-7 rounded-full border-2 border-yarn-blush border-t-transparent animate-spin" />
          ) : (
            <>
              <UploadCloud size={26} className="text-yarn-blush" aria-hidden="true" />
              <span className="mt-2 text-sm font-semibold text-yarn-blush">Upload</span>
              <span className="mt-1 text-xs text-gray-400">JPG or PNG</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      <div className="mt-5 flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(event) => setUrlInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              addUrl()
            }
          }}
          className="input-field py-2.5 text-sm"
          placeholder="Paste image URL..."
        />
        <button type="button" onClick={addUrl} className="rounded-2xl bg-blush-100 px-4 text-yarn-blush transition hover:bg-blush-200">
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

function ToggleCard({ title, desc, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition ${
        checked ? 'border-yarn-blush bg-blush-50' : 'border-gray-100 bg-white hover:bg-gray-50'
      }`}
    >
      <div>
        <p className="font-semibold text-yarn-dark">{title}</p>
        <p className="mt-1 text-sm text-gray-500">{desc}</p>
      </div>
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${checked ? 'bg-yarn-blush text-white' : 'bg-gray-100 text-gray-400'}`}>
        {checked && <Check size={15} aria-hidden="true" />}
      </span>
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

  const activeCategories = useMemo(() => categories.filter((category) => category.is_active), [categories])

  useEffect(() => {
    if (!isEditing) return
    productController.getProduct(id)
      .then((product) => setForm({ ...product, price: product.price || '', compare_price: product.compare_price || '' }))
      .catch(() => {
        toast.error('Product not found')
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
        toast.success('Product updated')
      } else {
        const created = await productController.createProduct(payload)
        toast.success('Product created')
        navigate(`/admin/products/${created.id}/edit`)
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-9 w-9 rounded-full border-4 border-yarn-blush border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] bg-gradient-to-br from-yarn-dark via-blush-900 to-yarn-blush p-6 text-white shadow-xl shadow-blush-200/60 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <Link to="/admin/products" className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25">
            <ArrowLeft size={19} aria-hidden="true" />
          </Link>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blush-100">Product editor</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">{isEditing ? 'Edit product' : 'Add new product'}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-blush-100">
              Add product details, images, category, inventory, and homepage visibility from one place.
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-white/12 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.16em] text-blush-100">Status</p>
          <p className="mt-1 font-semibold capitalize">{form.status?.replace(/_/g, ' ')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-[24px] border border-blush-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-blush-100 pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blush-50 text-yarn-blush">
                <Package size={21} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-xl text-yarn-dark">Basic information</h3>
                <p className="text-sm text-gray-500">Name, category, description, and visibility.</p>
              </div>
            </div>

            <div className="grid gap-5">
              <Field label="Product name *">
                <input
                  value={form.name}
                  onChange={(event) => set('name', event.target.value)}
                  className="input-field"
                  placeholder="Daisy flower keychain"
                  required
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(event) => set('description', event.target.value)}
                  className="input-field min-h-32 resize-y"
                  placeholder="Describe the product, size, materials, use, and gifting details..."
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Category *">
                  <select
                    value={form.category}
                    onChange={(event) => set('category', event.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">{categoriesLoading ? 'Loading categories...' : 'Select category'}</option>
                    {activeCategories.map((category) => (
                      <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Status">
                  <select value={form.status} onChange={(event) => set('status', event.target.value)} className="input-field">
                    <option value={PRODUCT_STATUS.ACTIVE}>Active (visible)</option>
                    <option value={PRODUCT_STATUS.DRAFT}>Draft (hidden)</option>
                    <option value={PRODUCT_STATUS.OUT_OF_STOCK}>Out of stock</option>
                  </select>
                </Field>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-blush-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-blush-100 pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff4d8] text-yarn-blush">
                <Tag size={21} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-xl text-yarn-dark">Pricing and details</h3>
                <p className="text-sm text-gray-500">Set prices, stock, yarn, care, colors, and tags.</p>
              </div>
            </div>

            <div className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Price (INR) *">
                  <input
                    type="number"
                    value={form.price}
                    onChange={(event) => set('price', event.target.value)}
                    className="input-field"
                    min="0"
                    step="0.01"
                    placeholder="499"
                    required
                  />
                </Field>

                <Field label="Compare at (INR)">
                  <input
                    type="number"
                    value={form.compare_price || ''}
                    onChange={(event) => set('compare_price', event.target.value)}
                    className="input-field"
                    min="0"
                    step="0.01"
                    placeholder="699"
                  />
                </Field>

                <Field label="Stock quantity">
                  <input
                    type="number"
                    value={form.stock_qty}
                    onChange={(event) => set('stock_qty', event.target.value)}
                    className="input-field"
                    min="0"
                  />
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Yarn type">
                  <input
                    value={form.yarn_type}
                    onChange={(event) => set('yarn_type', event.target.value)}
                    className="input-field"
                    placeholder="Cotton, acrylic, wool..."
                  />
                </Field>

                <Field label="Care instructions">
                  <input
                    value={form.care_instructions}
                    onChange={(event) => set('care_instructions', event.target.value)}
                    className="input-field"
                    placeholder="Hand wash cold, air dry..."
                  />
                </Field>
              </div>

              <TagInput
                label="Color options"
                values={form.color_options}
                onChange={(value) => set('color_options', value)}
                placeholder="Add color"
              />

              <TagInput
                label="Tags"
                values={form.tags}
                onChange={(value) => set('tags', value)}
                placeholder="Add tag"
              />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <ImageManager images={form.images} onChange={(value) => set('images', value)} productId={id} />

          <section className="rounded-[24px] border border-blush-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3 border-b border-blush-100 pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blush-50 text-yarn-blush">
                <Sparkles size={21} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-xl text-yarn-dark">Product options</h3>
                <p className="text-sm text-gray-500">Homepage and custom settings.</p>
              </div>
            </div>

            <div className="space-y-3">
              <ToggleCard
                title="Featured product"
                desc="Show this product in featured homepage sections."
                checked={form.is_featured}
                onChange={(value) => set('is_featured', value)}
              />
              <ToggleCard
                title="Customizable"
                desc="Mark this as available for custom variations."
                checked={form.is_custom}
                onChange={(value) => set('is_custom', value)}
              />
            </div>
          </section>

          <div className="sticky bottom-4 rounded-[24px] border border-blush-100 bg-white/95 p-4 shadow-xl shadow-gray-200/70 backdrop-blur">
            <button type="submit" disabled={saving} className="btn-primary inline-flex w-full items-center justify-center gap-2 py-3.5 disabled:opacity-60">
              {saving ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} aria-hidden="true" />
                  {isEditing ? 'Update product' : 'Create product'}
                </>
              )}
            </button>
            <Link to="/admin/products" className="btn-outline mt-3 inline-flex w-full items-center justify-center py-3.5">
              Cancel
            </Link>
          </div>
        </aside>
      </form>
    </div>
  )
}
