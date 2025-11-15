import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, Calendar, MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../api/services'
import type { Order } from '../types'

export function MyOrdersPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadOrders()
  }, [isAuthenticated, navigate])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const page = await orderService.getMyOrders(0, 20)
      setOrders(page.content)
    } catch (err) {
      setError('Failed to load orders')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'ACCEPTED':
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800'
      case 'DELIVERED':
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-700 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-md">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const total = order.totalAmount ?? order.total ?? 0
            const itemCount = order.items?.length ?? 0
            return (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6 hover:border-purple-300 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Calendar size={16} />
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="flex items-start gap-2 text-sm text-gray-700 mb-4">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>{order.shippingAddress}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </span>
                  <span className="text-lg font-bold text-purple-700">
                    Rs. {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </Link>
          )})}
        </div>
      )}
    </div>
  )
}
