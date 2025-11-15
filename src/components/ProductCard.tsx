import { ShoppingCart } from 'lucide-react'
import type { Product } from '../types'
import { useCart } from '../context/CartContext'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  
  // Calculate prices based on discount
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0
  const discountPercent = product.discountPercentage || 0
  const oldPrice = hasDiscount ? product.price / (1 - discountPercent / 100) : product.price * 1.2
  const finalPrice = product.price

  return (
    <div className="relative bg-white border-2 md:border-4 border-yellow-400 rounded-lg md:rounded-xl p-2 md:p-4 flex flex-col gap-2 md:gap-3 shadow-md hover:shadow-xl transition-all duration-300 group">
      {/* Discount Badge */}
      {(hasDiscount || !product.discountPercentage) && (
        <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-purple-700 text-white text-[10px] md:text-xs font-bold rounded-full h-8 w-8 md:h-10 md:w-10 flex items-center justify-center shadow-lg z-10">
          -{hasDiscount ? discountPercent : Math.round(((oldPrice - finalPrice) / oldPrice) * 100)}%
        </div>
      )}

      {/* Member Price Tag */}
      <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-yellow-400 text-purple-900 text-[8px] md:text-[9px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded shadow z-10">
        MEMBER
      </div>

      {/* Product Image */}
      <div className="h-28 md:h-40 w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg flex items-center justify-center overflow-hidden mt-6 md:mt-8 group-hover:scale-105 transition-transform">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center text-slate-400 text-[10px] md:text-xs">
            <ShoppingCart size={24} className="md:hidden mx-auto mb-1 opacity-30" />
            <ShoppingCart size={32} className="hidden md:block mx-auto mb-2 opacity-30" />
            <span className="hidden md:inline">No image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-h-[40px] md:min-h-[50px]">
        <h3 className="font-semibold text-slate-900 mb-0.5 md:mb-1 line-clamp-2 text-xs md:text-sm leading-tight">
          {product.name}
        </h3>
        {product.description && (
          <p className="hidden md:block text-[10px] text-slate-500 line-clamp-1">{product.description}</p>
        )}
      </div>

      {/* Stock Info */}
      <div className="text-[9px] md:text-[10px] text-slate-500">
        {product.quantityAvailable > 0 ? (
          <span className="text-green-600 font-medium">In Stock<span className="hidden md:inline"> ({product.quantityAvailable})</span></span>
        ) : (
          <span className="text-red-600 font-medium">Out of Stock</span>
        )}
      </div>

      {/* Price */}
      <div className="flex items-center gap-1 md:gap-2">
        <span className="text-[10px] md:text-xs text-slate-400 line-through">Rs. {oldPrice.toFixed(0)}</span>
        <span className="text-sm md:text-base font-bold text-purple-700">Rs. {finalPrice.toFixed(0)}</span>
      </div>

      {/* Add to Cart Button */}
      <button
        type="button"
        onClick={() => addItem(product)}
        disabled={product.quantityAvailable <= 0}
        className="w-full inline-flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-2.5 rounded-lg bg-purple-700 text-white text-[10px] md:text-xs font-bold uppercase shadow-md hover:bg-purple-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <ShoppingCart size={14} className="md:hidden" />
        <ShoppingCart size={16} className="hidden md:block" />
        <span className="hidden sm:inline">Add to Cart</span>
        <span className="sm:hidden">Add</span>
      </button>
    </div>
  )
}
