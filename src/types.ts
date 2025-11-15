// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// Pagination
export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

// Product
export interface Product {
  id: number
  name: string
  imageUrl: string | null
  price: number
  discountPercentage: number | null
  description: string | null
  categoryId: number | null
  categoryName: string | null
  quantityAvailable: number
  lowStockThreshold: number
}

// Category
export interface Category {
  id: number
  name: string
  description: string | null
}

// Auth
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: UserProfile
}

export interface UserProfile {
  id: number
  email: string
  name: string
  firstName?: string | null
  lastName?: string | null
  username?: string | null
  phone?: string | null
  address?: string | null
  role: 'CUSTOMER' | 'ADMIN'
  profileCompleted?: boolean
}

// Order
export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'

export interface Order {
  id: number
  status: OrderStatus
  totalAmount?: number
  total?: number
  shippingAddress: string
  phone?: string | null
  createdAt: string
  items: OrderItem[]
}

export interface OrderItem {
  id?: number
  productId: number | null
  productName: string
  quantity: number
  price?: number
  priceAtPurchase?: number
  lineTotal?: number
}

export interface CreateOrderRequest {
  items: { productId: number; quantity: number }[]
  shippingAddress: string
}

// Cart Item (local state)
export interface CartItem {
  product: Product
  quantity: number
}
