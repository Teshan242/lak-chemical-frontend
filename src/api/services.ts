import { apiClient } from './client'
import type { ApiResponse, Page, Product, Category, AuthResponse, Order, CreateOrderRequest, UserProfile } from '../types'

// Auth Services
export const authService = {
  loginWithGoogle: async (credential: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/google', {
      idToken: credential,
    })
    return data.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  },
}

// Product Services
export const productService = {
  getProducts: async (params?: { categoryId?: number; search?: string; page?: number; size?: number }): Promise<Page<Product>> => {
    const { data } = await apiClient.get<ApiResponse<Page<Product>>>('/products', { params })
    return data.data
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const { data } = await apiClient.post<ApiResponse<Product>>('/products', product)
    return data.data
  },

  updateProduct: async (id: number, product: Partial<Product>): Promise<Product> => {
    const { data } = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, product)
    return data.data
  },

  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`)
  },
}

// Category Services
export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories')
    return data.data
  },

  createCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    const { data } = await apiClient.post<ApiResponse<Category>>('/categories', category)
    return data.data
  },

  updateCategory: async (id: number, category: Partial<Category>): Promise<Category> => {
    const { data } = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, category)
    return data.data
  },

  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/categories/${id}`)
  },
}

// Order Services
export const orderService = {
  createOrder: async (request: CreateOrderRequest): Promise<Order> => {
    const { data } = await apiClient.post<ApiResponse<Order>>('/orders', request)
    return data.data
  },

  getMyOrders: async (page = 0, size = 10): Promise<Page<Order>> => {
    const { data } = await apiClient.get<ApiResponse<Page<Order>>>('/orders/my', {
      params: { page, size },
    })
    return data.data
  },

  getOrderById: async (id: number): Promise<Order> => {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`)
    return data.data
  },
}

// Profile Service
export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    const { data} = await apiClient.get<ApiResponse<UserProfile>>('/profile')
    return data.data
  },
  
  updateProfile: async (updates: {
    username?: string
    firstName?: string
    lastName?: string
    address?: string
    phone?: string
  }): Promise<UserProfile> => {
    const { data } = await apiClient.put<ApiResponse<UserProfile>>('/profile', updates)
    return data.data
  },
}

// File Upload Service
export const fileService = {
  uploadImage: async (file: File): Promise<{ filename: string; url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const { data } = await apiClient.post<ApiResponse<{ filename: string; url: string }>>(
      '/files/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return data.data
  },
  
  deleteImage: async (filename: string): Promise<void> => {
    await apiClient.delete(`/files/${filename}`)
  },
}
