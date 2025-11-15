import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, ShoppingBag, MapPin, Phone, Mail, Edit2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authService, profileService } from '../api/services'
import type { UserProfile } from '../types'

export function ProfilePage() {
  const { user, setUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(user)
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      loadProfile()
    }
  }, [isAuthenticated])

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile()
      setProfile(data)
    } catch (err) {
      console.error('Failed to load profile:', err)
    }
  }

  if (!isAuthenticated || !user) {
    navigate('/login')
    return null
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      setUser(null)
      navigate('/')
    } catch (err) {
      console.error('Logout error:', err)
      // Still logout locally even if API call fails
      setUser(null)
      navigate('/')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="h-24 w-24 bg-purple-700 rounded-full flex items-center justify-center mb-4">
                <User size={48} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <span className="mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full uppercase">
                {user.role}
              </span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 text-left bg-purple-50 text-purple-700 font-medium rounded-lg hover:bg-purple-100 transition"
              >
                <User size={20} />
                My Profile
              </button>
              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                <ShoppingBag size={20} />
                My Orders
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="w-full flex items-center gap-3 px-4 py-3 text-left bg-orange-50 text-orange-700 font-medium rounded-lg hover:bg-orange-100 transition border-t"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Admin Dashboard {user.role !== 'ADMIN' && '(Demo)'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 font-medium rounded-lg hover:bg-red-50 transition"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Mail size={24} className="text-purple-700 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="font-semibold text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <User size={24} className="text-purple-700 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-semibold text-gray-900">
                    {profile?.firstName || profile?.lastName 
                      ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
                      : user?.name || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Phone size={24} className="text-purple-700 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-semibold text-gray-900">{profile?.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <MapPin size={24} className="text-purple-700 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold text-gray-900">{profile?.address || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="mt-6 px-6 py-3 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800 transition flex items-center gap-2"
            >
              <Edit2 size={20} />
              Edit Profile
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-700 to-purple-900 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Need Help?</h3>
            <p className="text-purple-100 mb-4">
              Contact our customer support team for assistance
            </p>
            <button
              type="button"
              className="px-6 py-2 bg-white text-purple-700 font-bold rounded-lg hover:bg-purple-50 transition"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {showEditModal && profile && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={async (updates) => {
            try {
              setLoading(true)
              const updated = await profileService.updateProfile(updates)
              setProfile(updated)
              setUser(updated)
              setShowEditModal(false)
              loadProfile()
            } catch (err) {
              alert('Failed to update profile')
            } finally {
              setLoading(false)
            }
          }}
          loading={loading}
        />
      )}
    </div>
  )
}

function EditProfileModal({ profile, onClose, onSave, loading }: {
  profile: UserProfile
  onClose: () => void
  onSave: (updates: any) => Promise<void>
  loading: boolean
}) {
  const [formData, setFormData] = useState({
    username: profile.username || '',
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    phone: profile.phone || '',
    address: profile.address || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter username"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="First name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your address"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800 transition disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition disabled:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
