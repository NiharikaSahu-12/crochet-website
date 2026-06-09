import { useEffect, useMemo, useState } from 'react'
import { Edit2, FolderPlus, Plus, Save, Search, Trash2, X } from 'lucide-react'
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
      [category.label, category.value, category.description].some((value) =>
        value?.toLowerCase().includes(term)
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
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await categoryController.updateCategory(editing, form)
        toast.success('Category updated')
      } else {
        await categoryController.createCategory(form)
        toast.success('Category added')
      }
      resetForm()
      refetch()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (category) => {
    if (!confirm(`Delete "${category.label}"? Existing products using this category will keep their category value.`)) return
    try {
      await categoryController.deleteCategory(category.id)
      toast.success('Category deleted')
      if (editing === category.id) resetForm()
      refetch()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const toggleActive = async (category) => {
    try {
      await categoryController.updateCategory(category.id, {
        ...category,
        is_active: !category.is_active,
      })
      toast.success(category.is_active ? 'Category hidden' : 'Category activated')
      refetch()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yarn-blush">Catalog setup</p>
          <h2 className="mt-2 font-display text-3xl text-yarn-dark">Categories</h2>
          <p className="mt-1 text-sm text-gray-500">Add and manage product categories used in product forms and filters.</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-yarn-blush to-yarn-gold px-5 py-4 text-white shadow-lg shadow-blush-200/60">
          <p className="text-3xl font-display font-semibold">{categories.length}</p>
          <p className="text-sm text-white/85">total categories</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form onSubmit={handleSubmit} className="rounded-[24px] border border-blush-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-blush-100 pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blush-50 text-yarn-blush">
              <FolderPlus size={21} aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display text-xl text-yarn-dark">{editing ? 'Edit category' : 'Add category'}</h3>
              <p className="text-xs text-gray-500">Create clean category names for products.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block text-sm font-semibold text-yarn-dark">
              Category name *
              <input
                value={form.label}
                onChange={(e) => set('label', e.target.value)}
                className="input-field mt-2"
                placeholder="Flower Bouquets"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-yarn-dark">
              Category value *
              <input
                value={form.value}
                onChange={(e) => set('value', categoryController.slugify(e.target.value))}
                className="input-field mt-2"
                placeholder="flower_bouquets"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-yarn-dark">
              Description
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className="input-field mt-2 min-h-24 resize-y"
                placeholder="Short note for this category..."
              />
            </label>

            <div className="grid grid-cols-[1fr_auto] gap-4">
              <label className="block text-sm font-semibold text-yarn-dark">
                Sort order
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => set('sort_order', e.target.value)}
                  className="input-field mt-2"
                  placeholder="10"
                />
              </label>
              <label className="flex min-w-28 cursor-pointer flex-col justify-end text-sm font-semibold text-yarn-dark">
                Active
                <button
                  type="button"
                  onClick={() => set('is_active', !form.is_active)}
                  className={`mt-2 h-12 rounded-2xl px-4 text-sm font-semibold transition ${
                    form.is_active ? 'bg-yarn-blush text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {form.is_active ? 'Yes' : 'No'}
                </button>
              </label>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary inline-flex flex-1 items-center justify-center gap-2 disabled:opacity-60">
              {saving ? (
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : editing ? (
                <Save size={16} aria-hidden="true" />
              ) : (
                <Plus size={16} aria-hidden="true" />
              )}
              {editing ? 'Save changes' : 'Add category'}
            </button>
            {editing && (
              <button type="button" onClick={resetForm} className="btn-outline inline-flex items-center justify-center gap-2 px-5">
                <X size={16} aria-hidden="true" />
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="rounded-[24px] border border-blush-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-blush-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-xl text-yarn-dark">Category list</h3>
              <p className="text-sm text-gray-500">Edit names, sort order, and active state.</p>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field py-2.5 pl-10 text-sm"
                placeholder="Search categories..."
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-display text-xl text-yarn-dark">No categories found</p>
              <p className="mt-1 text-sm text-gray-500">Try a different search or add a category.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredCategories.map((category) => (
                <div key={category.id} className="grid gap-4 p-5 transition hover:bg-blush-50/50 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-display text-lg text-yarn-dark">{category.label}</h4>
                      <span className="rounded-full bg-blush-50 px-2.5 py-1 text-xs font-medium text-yarn-blush">
                        {category.value}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        category.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {category.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{category.description || 'No description added.'}</p>
                    <p className="mt-2 text-xs text-gray-400">Sort order: {category.sort_order || 0}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleActive(category)}
                      className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-blush-100 hover:text-yarn-blush"
                    >
                      {category.is_active ? 'Hide' : 'Show'}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      className="rounded-xl bg-blue-50 p-2.5 text-blue-500 transition hover:bg-blue-100"
                      aria-label={`Edit ${category.label}`}
                    >
                      <Edit2 size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      className="rounded-xl bg-red-50 p-2.5 text-red-500 transition hover:bg-red-100"
                      aria-label={`Delete ${category.label}`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
