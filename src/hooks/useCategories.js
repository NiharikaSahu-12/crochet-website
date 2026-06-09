import { useCallback, useEffect, useState } from 'react'
import categoryController from '../controllers/categoryController'

export function useCategories(filters = {}) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filterKey = JSON.stringify(filters)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await categoryController.listCategories(filters)
      setCategories(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filterKey])

  useEffect(() => {
    load()
  }, [load])

  return { categories, loading, error, refetch: load }
}
