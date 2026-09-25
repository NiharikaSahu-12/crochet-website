import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const ShopContext = createContext(null)

const CART_STORAGE_KEY = 'thecozzyloops_cart_items_v2'
const WISHLIST_STORAGE_KEY = 'thecozzyloops_wishlist_ids_v2'

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [quickLookProduct, setQuickLookProduct] = useState(null)
  const [isCustomStudioOpen, setIsCustomStudioOpen] = useState(false)
  const [customStudioDefaults, setCustomStudioDefaults] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (err) {
      console.warn('Failed to save cart to storage', err)
    }
  }, [cart])

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist))
    } catch (err) {
      console.warn('Failed to save wishlist to storage', err)
    }
  }, [wishlist])

  const addToCart = (product, { quantity = 1, selectedColor = '', customNote = '' } = {}) => {
    setCart((prev) => {
      const colorKey = selectedColor || 'standard'
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && (item.selectedColor || 'standard') === colorKey
      )

      if (existingIndex > -1) {
        const next = [...prev]
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          customNote: customNote || next[existingIndex].customNote,
        }
        return next
      }

      return [
        ...prev,
        {
          cartItemId: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          product,
          quantity,
          selectedColor,
          customNote,
          addedAt: new Date().toISOString(),
        },
      ]
    })

    toast.success(`Added ${product.name} to your bag`, {
      style: {
        borderRadius: '9999px',
        background: '#1C1917',
        color: '#FAF8F5',
        fontSize: '13px',
        fontWeight: '500',
        padding: '10px 18px',
      },
      icon: '🧶',
    })
  }

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId))
  }

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId)
      return
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId)
      if (exists) {
        toast('Removed from saved pieces', {
          icon: '🤍',
          style: {
            borderRadius: '9999px',
            background: '#1C1917',
            color: '#FAF8F5',
            fontSize: '13px',
          },
        })
        return prev.filter((id) => id !== productId)
      } else {
        toast('Saved to your favorites', {
          icon: '🤎',
          style: {
            borderRadius: '9999px',
            background: '#1C1917',
            color: '#FAF8F5',
            fontSize: '13px',
          },
        })
        return [...prev, productId]
      }
    })
  }

  const isInWishlist = (productId) => wishlist.includes(productId)

  const openQuickLook = (product) => {
    setQuickLookProduct(product)
  }

  const closeQuickLook = () => {
    setQuickLookProduct(null)
  }

  const openCustomStudio = (defaults = null) => {
    setCustomStudioDefaults(defaults)
    setIsCustomStudioOpen(true)
  }

  const closeCustomStudio = () => {
    setIsCustomStudioOpen(false)
    setCustomStudioDefaults(null)
  }

  const cartTotal = cart.reduce(
    (sum, item) => sum + (Number(item.product?.price) || 0) * (item.quantity || 1),
    0
  )

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)

  return (
    <ShopContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        quickLookProduct,
        openQuickLook,
        closeQuickLook,
        isCustomStudioOpen,
        customStudioDefaults,
        openCustomStudio,
        closeCustomStudio,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider')
  }
  return context
}
