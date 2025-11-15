import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { productService } from '../api/services'
import type { Product } from '../types'

export function HomePage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchTerm = searchParams.get('search') || undefined
  const categoryId = searchParams.get('category') || undefined

  useEffect(() => {
    loadProducts()
  }, [searchTerm, categoryId])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const page = await productService.getProducts({ 
        page: 0, 
        size: 12,
        search: searchTerm,
        categoryId: categoryId ? parseInt(categoryId) : undefined
      })
      setProducts(page?.content || [])
    } catch (err) {
      setError('Failed to load products. Please try again.')
      console.error(err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-700 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={loadProducts}
            className="mt-4 px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 rounded-xl md:rounded-2xl p-4 md:p-8 mb-4 md:mb-8 text-white">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">Welcome to Lak Chemical & Hardware</h1>
        <p className="text-sm md:text-lg text-purple-100">Your one-stop shop for quality tools, paints, and hardware supplies</p>
        <div className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-3 md:gap-4">
          <button type="button" className="px-6 py-2.5 md:py-3 bg-yellow-400 text-purple-900 font-bold rounded-lg hover:bg-yellow-300 transition text-sm md:text-base">
            Shop Now
          </button>
          <button type="button" className="px-6 py-2.5 md:py-3 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition backdrop-blur text-sm md:text-base">
            Learn More
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
        <p className="text-sm md:text-base text-gray-600">Discover our latest and most popular hardware and chemical products</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="col-span-full text-center py-8 md:py-12">
          <p className="text-sm md:text-base text-gray-500">No products available at the moment.</p>
        </div>
      )}
    </div>
  )
}
