import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './context/AuthContext'
import { ShopProvider } from './context/ShopContext'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/shop/HomePage'
import ShopPage from './pages/shop/ShopPage'
import ProductDetailPage from './pages/shop/ProductDetailPage'
import AboutPage from './pages/shop/AboutPage'
import ContactPage from './pages/shop/ContactPage'
import CustomOrdersPage from './pages/shop/CustomOrdersPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminCategories from './pages/admin/AdminCategories'
import ShopLayout from './components/layout/ShopLayout'
import AdminLayout from './components/layout/AdminLayout'

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-terracotta-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return session ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <ShopProvider>
      <ScrollToTop />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3200,
          style: {
            background: '#1C1917',
            color: '#FAF8F5',
            borderRadius: '9999px',
            fontSize: '13px',
            padding: '10px 18px',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
          },
        }}
      />
      <Routes>
        <Route element={<ShopLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/custom-orders" element={<CustomOrdersPage />} />
          <Route path="/custom" element={<Navigate to="/custom-orders" replace />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ShopProvider>
  )
}
