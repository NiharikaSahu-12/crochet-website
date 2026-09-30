import { useState, useEffect, useCallback } from 'react'
import productController from '../controllers/productController'

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  const filterKey = JSON.stringify(filters)

  useEffect(() => {
    // Cancelling on cleanup discards stale responses, so fast typing in search
    // boxes can no longer let an older request overwrite newer results.
    let cancelled = false
    setLoading(true)
    setError(null)
    productController
      .listProducts(filters)
      .then((data) => { if (!cancelled) setProducts(data) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [filterKey, reloadToken])

  const refetch = useCallback(() => setReloadToken((token) => token + 1), [])

  return { products, loading, error, refetch }
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productController.getFeaturedProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { products, loading }
}
