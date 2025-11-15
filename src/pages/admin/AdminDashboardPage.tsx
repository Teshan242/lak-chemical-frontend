import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, BarChart3 } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { apiClient } from '../../api/client'
import type { ApiResponse } from '../../types'

interface DashboardStats {
  totalOrders: number
  completedOrders: number
  totalRevenue: number
  activeCustomers: number
  lowStockProducts: any[]
  topCustomers: any[]
  ordersPerMonth: Array<{ month: string; count: number }>
  topProducts: Array<{ name: string; quantitySold: number }>
}

export function AdminDashboardPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadDashboard()
  }, [isAuthenticated, navigate])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const { data } = await apiClient.get<ApiResponse<DashboardStats>>('/admin/reports/dashboard')
      setStats(data.data)
    } catch (err) {
      console.error('Failed to load dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-700 border-t-transparent"></div>
    </div>
  }

  if (!stats) {
    return <div className="max-w-7xl mx-auto px-4 py-8">
      <p className="text-red-600">Failed to load dashboard data</p>
    </div>
  }

  const averageOrderValue = stats.completedOrders > 0 
    ? stats.totalRevenue / stats.completedOrders 
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <DollarSign size={24} className="text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">Rs. {stats.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
            <ShoppingBag size={24} className="text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
          <p className="text-sm text-gray-500 mt-1">{stats.completedOrders} completed</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Active Customers</h3>
            <Users size={24} className="text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.activeCustomers}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg Order Value</h3>
            <TrendingUp size={24} className="text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">Rs. {averageOrderValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Orders Per Month Chart */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 size={24} className="text-blue-600" />
            Orders Per Month
          </h2>
          {stats.ordersPerMonth && stats.ordersPerMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.ordersPerMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-16">No order data available</p>
          )}
        </div>

        {/* Top Products Chart */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={24} className="text-green-600" />
            Top Selling Products
          </h2>
          {stats.topProducts && stats.topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantitySold" fill="#10b981" name="Quantity Sold" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-16">No product sales data available</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Low Stock Products */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package size={24} className="text-red-600" />
            Low Stock Products
          </h2>
          {stats.lowStockProducts.length === 0 ? (
            <p className="text-gray-500">No low stock products</p>
          ) : (
            <div className="space-y-2">
              {stats.lowStockProducts.map((product: any) => (
                <div key={product.productId} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="font-medium text-gray-900">{product.name}</span>
                  <span className="text-sm text-red-600 font-semibold">
                    {product.quantityAvailable} / {product.lowStockThreshold}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link
            to="/admin/products"
            className="mt-4 block text-center py-2 bg-purple-100 text-purple-700 font-semibold rounded-lg hover:bg-purple-200 transition"
          >
            Manage Products
          </Link>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users size={24} className="text-green-600" />
            Top Customers
          </h2>
          {stats.topCustomers.length === 0 ? (
            <p className="text-gray-500">No customer data yet</p>
          ) : (
            <div className="space-y-2">
              {stats.topCustomers.map((customer: any) => (
                <div key={customer.userId} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="font-medium text-gray-900">{customer.email}</span>
                  <span className="text-sm text-gray-600">{customer.ordersCount} orders</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/products"
          className="block bg-purple-700 text-white p-6 rounded-2xl hover:bg-purple-800 transition"
        >
          <h3 className="text-xl font-bold mb-2">Manage Products</h3>
          <p className="text-purple-100">Add, edit, or delete products</p>
        </Link>
        <Link
          to="/admin/orders"
          className="block bg-blue-700 text-white p-6 rounded-2xl hover:bg-blue-800 transition"
        >
          <h3 className="text-xl font-bold mb-2">Manage Orders</h3>
          <p className="text-blue-100">View and update order status</p>
        </Link>
        <Link
          to="/admin/categories"
          className="block bg-green-700 text-white p-6 rounded-2xl hover:bg-green-800 transition"
        >
          <h3 className="text-xl font-bold mb-2">Manage Categories</h3>
          <p className="text-green-100">Organize product categories</p>
        </Link>
        <Link
          to="/admin/users"
          className="block bg-orange-700 text-white p-6 rounded-2xl hover:bg-orange-800 transition"
        >
          <h3 className="text-xl font-bold mb-2">Manage Users</h3>
          <p className="text-orange-100">Create admins & view users</p>
        </Link>
      </div>
    </div>
  )
}
