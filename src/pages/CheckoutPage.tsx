import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CreditCard, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../api/services'

export function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.address.trim() || !formData.phone.trim()) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const orderRequest = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingAddress: formData.address,
      }

      const order = await orderService.createOrder(orderRequest)
      
      clearCart()
      navigate(`/orders/${order.id}`, { state: { orderPlaced: true } })
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const shippingCost = 250
  const grandTotal = total + shippingCost

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Shipping Information */}
            <div className="bg-white rounded-lg md:rounded-2xl shadow-md border-2 border-gray-100 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="md:hidden text-purple-700" />
                <MapPin size={24} className="hidden md:block text-purple-700" />
                Shipping Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your complete delivery address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="07XXXXXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg md:rounded-2xl shadow-md border-2 border-gray-100 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="md:hidden text-purple-700" />
                <CreditCard size={24} className="hidden md:block text-purple-700" />
                Payment Method
              </h2>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Cash on Delivery</span> - Pay when you receive your order
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 md:py-4 bg-purple-700 text-white font-bold text-base md:text-lg rounded-lg hover:bg-purple-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Placing Order...' : `Place Order - Rs. ${grandTotal.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg md:rounded-2xl shadow-md border-2 border-gray-100 p-4 md:p-6 lg:sticky lg:top-24">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag size={20} className="md:hidden text-purple-700" />
              <ShoppingBag size={24} className="hidden md:block text-purple-700" />
              Order Summary
            </h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="font-medium">
                    Rs. {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">Rs. {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Rs. {shippingCost.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg text-purple-700">
                  Rs. {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
