import { useState, useEffect, useCallback } from 'react'
import productController from '../controllers/productController'

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filterKey = JSON.stringify(filters)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await productController.listProducts(filters)
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filterKey])

  useEffect(() => { load() }, [load])

  return { products, loading, error, refetch: load }
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
