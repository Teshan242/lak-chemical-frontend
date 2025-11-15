import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Package, MapPin, Calendar, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../api/services'
import type { Order } from '../types'

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const orderPlaced = location.state?.orderPlaced

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (id) {
      loadOrder(parseInt(id))
    }
  }, [id, isAuthenticated, navigate])

  const loadOrder = async (orderId: number) => {
    try {
      setLoading(true)
      const orderData = await orderService.getOrderById(orderId)
      setOrder(orderData)
    } catch (err) {
      setError('Failed to load order details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'SHIPPED': return 'bg-purple-100 text-purple-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-700 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Order not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {orderPlaced && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <CheckCircle size={32} className="text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-green-900">Order Placed Successfully!</h2>
              <p className="text-green-700">Thank you for your purchase. We'll process your order soon.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={24} className="text-purple-700" />
              Order Items
            </h2>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-0">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-700">
                      Rs. {((item.priceAtPurchase ?? item.price ?? 0) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Rs. {(item.priceAtPurchase ?? item.price ?? 0).toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4 pb-4 border-b">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">Rs. {(order.totalAmount ?? order.total ?? 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg text-purple-700">
                Rs. {(order.totalAmount ?? order.total ?? 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={24} className="text-purple-700" />
              Order Date
            </h2>
            <p className="text-gray-700">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={24} className="text-purple-700" />
              Shipping Address
            </h2>
            <p className="text-gray-700 whitespace-pre-line">{order.shippingAddress}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={() => navigate('/orders')}
          className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition"
        >
          Back to Orders
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}
