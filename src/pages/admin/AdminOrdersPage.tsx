import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, MapPin } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { apiClient } from '../../api/client'
import type { Order, ApiResponse, Page } from '../../types'

export function AdminOrdersPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

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
      const { data } = await apiClient.get<ApiResponse<Page<Order>>>('/admin/orders', {
        params: { page: 0, size: 50 }
      })
      setOrders(data.data.content)
    } catch (err) {
      console.error('Failed to load orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await apiClient.put(`/admin/orders/${orderId}/status`, { status })
      loadOrders()
    } catch (err: any) {
      console.error('Failed to update order status:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update order status'
      alert(`Failed to update order status: ${errorMsg}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'SHIPPED': return 'bg-purple-100 text-purple-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-700 border-t-transparent"></div>
    </div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Management</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Package size={20} />
                  Order #{order.id}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)} border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="PENDING">PENDING</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-start gap-2 text-sm">
                <MapPin size={16} className="mt-0.5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Shipping Address:</p>
                  <p className="text-gray-600">{order.shippingAddress}</p>
                </div>
              </div>
              
              <div className="text-sm">
                <p className="font-medium text-gray-900">Items:</p>
                <ul className="text-gray-600">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.productName} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t pt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
              </span>
              <span className="text-xl font-bold text-purple-700">
                Rs. {(order.totalAmount ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}
