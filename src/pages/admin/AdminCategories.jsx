import { useEffect, useMemo, useState } from 'react'
import { 
  FolderTree, 
  Plus, 
  Save, 
  Search, 
  Trash2, 
  X, 
  Edit2, 
  Eye, 
  EyeOff, 
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react'
import categoryController from '../../controllers/categoryController'
import { useCategories } from '../../hooks/useCategories'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  label: '',
  value: '',
  description: '',
  sort_order: '',
  is_active: true,
}

export default function AdminCategories() {
  const { categories, loading, refetch } = useCategories()
  const [form, setForm] = useState(EMPTY_FORM)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return categories
    return categories.filter((category) =>
      [category.label, category.value, category.description].some((val) =>
        val?.toLowerCase().includes(term)
      )
    )
  }, [categories, search])

  useEffect(() => {
    if (editing || !form.label || form.value) return
    setForm((current) => ({ ...current, value: categoryController.slugify(current.label) }))
  }, [form.label, form.value, editing])

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditing(null)
  }

  const startEdit = (category) => {
    setEditing(category.id)
    setForm({
      label: category.label,
      value: category.value,
      description: category.description || '',
      sort_order: category.sort_order || '',
      is_active: category.is_active,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await categoryController.updateCategory(editing, form)
        toast.success('Category updated successfully')
      } else {
        await categoryController.createCategory(form)
        toast.success('New category added to catalog')
      }
      resetForm()
      refetch()
    } catch (err) {
      toast.error(err.message || 'Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete category "${category.label}"? Existing products using this tag will keep their assignment.`)) {
      return
    }
    try {
      await categoryController.deleteCategory(category.id)
      toast.success('Category deleted')
      if (editing === category.id) resetForm()
      refetch()
    } catch (err) {
      toast.error(err.message || 'Failed to delete category')
    }
  }

  const toggleActive = async (category) => {
    try {
      await categoryController.updateCategory(category.id, {
        ...category,
        is_active: !category.is_active,
      })
      toast.success(category.is_active ? 'Category hidden from filters' : 'Category made visible')
      refetch()
    } catch (err) {
      toast.error(err.message || 'Failed to toggle category')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-canvas-border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-editorial text-2xl lg:text-3xl font-semibold text-ink">Catalog Categories</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-canvas-subtle border border-canvas-border text-xs font-mono font-medium text-ink-muted">
              {categories.length} total
            </span>
          </div>
          <p className="text-xs text-ink-subtle mt-1">
            Organize products into collections like Bouquets, Potted Blooms, Bookmarks, and Accessories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-canvas-subtle border border-canvas-border text-xs text-ink-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{categories.filter(c => c.is_active).length} Active</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form on Left, List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Form (5 cols on lg) */}
        <div className="lg:col-span-5">
          <form 
            onSubmit={handleSubmit} 
            className="bg-white rounded-2xl border border-canvas-border p-6 shadow-xs space-y-5 sticky top-24"
          >
            <div className="flex items-center justify-between pb-3 border-b border-canvas-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-terracotta-50 text-terracotta-600 flex items-center justify-center">
                  <FolderTree size={17} />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-semibold text-ink">
                    {editing ? 'Edit Collection' : 'Create Collection'}
                  </h3>
                  <p className="text-[11px] text-ink-subtle">
                    {editing ? 'Updating existing category definition' : 'Add new classification for products'}
                  </p>
                </div>
              </div>

              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-ink-subtle hover:text-ink flex items-center gap-1"
                >
                  <X size={13} /> Reset
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                  Collection Name <span className="text-terracotta-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.label}
                  onChange={(e) => set('label', e.target.value)}
                  className="input-field text-xs"
                  placeholder="e.g. Flower Bouquets"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                  URL Slug Key <span className="text-terracotta-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.value}
                  onChange={(e) => set('value', categoryController.slugify(e.target.value))}
                  className="input-field text-xs font-mono"
                  placeholder="flower_bouquets"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  rows={3}
                  className="input-field text-xs resize-y"
                  placeholder="Brief note or shopper guide for this collection..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                    Sort Priority
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => set('sort_order', e.target.value)}
                    className="input-field text-xs font-mono"
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                    Visibility
                  </label>
                  <button
                    type="button"
                    onClick={() => set('is_active', !form.is_active)}
                    className={`w-full py-2.5 px-3 rounded-xl border text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                      form.is_active 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                    }`}
                  >
                    {form.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                    <span>{form.is_active ? 'Active' : 'Hidden'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 btn-primary py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-subtle disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : editing ? (
                  <>
                    <Save size={14} />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    <span>Add Category</span>
                  </>
                )}
              </button>

              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-outline px-4 py-2.5 text-xs"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Category List (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-canvas-border shadow-xs flex items-center gap-3">
            <Search size={16} className="text-ink-subtle ml-1" />
            <input
              type="text"
              placeholder="Search collections by label or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-ink placeholder:text-ink-subtle outline-none"
            />
            {search && (
              <button 
                type="button" 
                onClick={() => setSearch('')}
                className="text-ink-subtle hover:text-ink p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* List Card */}
          <div className="bg-white rounded-2xl border border-canvas-border shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-canvas-subtle rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="p-12 text-center">
                <FolderTree size={24} className="mx-auto text-ink-subtle mb-2" />
                <p className="font-editorial text-lg text-ink font-semibold">No categories found</p>
                <p className="text-xs text-ink-subtle mt-1">
                  {search ? 'Try adjusting your search query.' : 'Use the form to create your first collection.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-canvas-border">
                {filteredCategories.map((category) => (
                  <div 
                    key={category.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-canvas-subtle/40 transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-medium text-sm text-ink">{category.label}</h4>
                        <span className="px-2 py-0.5 rounded-md bg-canvas-subtle border border-canvas-border text-[11px] font-mono text-ink-muted">
                          {category.value}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                          category.is_active 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                        }`}>
                          {category.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                      {category.description && (
                        <p className="text-xs text-ink-subtle mt-1 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-ink-subtle">
                        <span>Sort Order: <strong className="font-mono text-ink">{category.sort_order || 0}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => toggleActive(category)}
                        className="p-2 rounded-xl text-ink-subtle hover:text-ink hover:bg-canvas-subtle transition-colors"
                        title={category.is_active ? 'Hide collection from store' : 'Activate collection in store'}
                      >
                        {category.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => startEdit(category)}
                        className="p-2 rounded-xl text-ink-subtle hover:text-ink hover:bg-canvas-subtle transition-colors"
                        title="Edit collection"
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        className="p-2 rounded-xl text-ink-subtle hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete collection"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
