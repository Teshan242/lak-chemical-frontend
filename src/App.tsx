import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { Header } from './components/Header'
import { HomePage } from './pages/HomePage'
import { CartPage } from './pages/CartPage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { CheckoutPage } from './pages/CheckoutPage'
import { MyOrdersPage } from './pages/MyOrdersPage'
import { OrderDetailPage } from './pages/OrderDetailPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage'
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<HomePage />} />
                <Route path="/hot-deals" element={<HomePage />} />
                <Route path="/brands" element={<HomePage />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Cart & Checkout */}
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                
                {/* User Routes */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/orders" element={<MyOrdersPage />} />
                <Route path="/orders/:id" element={<OrderDetailPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/products" element={<AdminProductsPage />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
                <Route path="/admin/categories" element={<AdminCategoriesPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                
                {/* Fallback */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
