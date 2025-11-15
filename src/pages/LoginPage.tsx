import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../api/services'

declare global {
  interface Window {
    google: any
  }
}

export function LoginPage() {
  const { setUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
      return
    }

    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        callback: handleGoogleResponse,
      })

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          width: 350,
          text: 'signin_with',
        }
      )
    }
  }, [isAuthenticated, navigate])

  const handleGoogleResponse = async (response: any) => {
    try {
      setLoading(true)
      setError(null)

      const authResponse = await authService.loginWithGoogle(response.credential)
      
      // Store tokens
      localStorage.setItem('accessToken', authResponse.accessToken)
      localStorage.setItem('refreshToken', authResponse.refreshToken)
      
      // Update auth context
      setUser(authResponse.user)
      
      // Redirect to home
      navigate('/')
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || 'Failed to login. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-purple-700 rounded-full flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Sign in to continue shopping</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-700 border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-4">Sign in with your Google account</p>
              </div>

              <div id="google-signin-button" className="flex justify-center mb-6"></div>

              <div className="text-center text-sm text-gray-500">
                <p>By signing in, you agree to our</p>
                <p className="mt-1">
                  <button type="button" className="text-purple-700 hover:text-purple-800 font-medium">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-purple-700 hover:text-purple-800 font-medium">
                    Privacy Policy
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-purple-700 hover:text-purple-800 font-medium text-sm"
          >
            ← Continue browsing as guest
          </button>
        </div>
      </div>
    </div>
  )
}
