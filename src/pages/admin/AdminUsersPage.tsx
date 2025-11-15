import { useState, useEffect } from 'react'
import { UserPlus, Shield, User as UserIcon, Mail, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../../api/client'
import type { ApiResponse, UserProfile } from '../../types'

export function AdminUsersPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadUsers()
  }, [isAuthenticated, navigate])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const { data } = await apiClient.get<ApiResponse<UserProfile[]>>('/admin/users')
      setUsers(data.data)
    } catch (err) {
      console.error('Failed to load users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMakeAdmin = async (userId: number) => {
    if (!confirm('Are you sure you want to make this user an admin?')) return
    
    try {
      await apiClient.post(`/admin/users/${userId}/make-admin`)
      loadUsers()
    } catch (err) {
      alert('Failed to update user role')
    }
  }

  const handleRemoveAdmin = async (userId: number) => {
    if (!confirm('Are you sure you want to remove admin privileges?')) return
    
    try {
      await apiClient.post(`/admin/users/${userId}/remove-admin`)
      loadUsers()
    } catch (err) {
      alert('Failed to update user role')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-700 border-t-transparent"></div>
    </div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800 transition"
        >
          <UserPlus size={20} />
          Create Admin Account
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <UserIcon size={20} className="text-purple-700" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {[user.firstName, user.lastName].filter(Boolean).join(' ') || user.email}
                      </div>
                      <div className="text-sm text-gray-500">{user.username || 'No username'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail size={16} />
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.role === 'ADMIN' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      <Shield size={14} />
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      <UserIcon size={14} />
                      Customer
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {user.profileCompleted ? (
                    <span className="text-green-600 text-sm font-medium">Active</span>
                  ) : (
                    <span className="text-yellow-600 text-sm font-medium">Incomplete Profile</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {user.role === 'CUSTOMER' ? (
                    <button
                      type="button"
                      onClick={() => handleMakeAdmin(user.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
                    >
                      <Shield size={16} />
                      Make Admin
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRemoveAdmin(user.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    >
                      <Trash2 size={16} />
                      Remove Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <CreateAdminModal
          onClose={() => setShowModal(false)}
          onSuccess={loadUsers}
        />
      )}
    </div>
  )
}

function CreateAdminModal({ onClose, onSuccess }: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    username: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      setSaving(true)
      await apiClient.post('/admin/users/create-admin', formData)
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create admin account')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Shield className="text-purple-700" />
          Create Admin Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="admin@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            <strong>Note:</strong> The new admin will need to login via Google OAuth with this email address.
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800 transition disabled:bg-gray-400"
            >
              {saving ? 'Creating...' : 'Create Admin'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
