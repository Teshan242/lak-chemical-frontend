import { Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

export function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="bg-white border-2 border-gray-200 rounded-lg md:rounded-xl p-3 md:p-4 flex gap-3 md:gap-4 hover:border-purple-300 transition"
            >
              {/* Product Image */}
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.product.imageUrl ? (
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No image</span>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base line-clamp-2">{item.product.name}</h3>
                <p className="text-xs md:text-sm text-gray-600 mb-2">Rs. {item.product.price.toFixed(2)} each</p>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition"
                  >
                    <Minus size={14} className="md:hidden" />
                    <Minus size={16} className="hidden md:block" />
                  </button>
                  <span className="w-8 md:w-12 text-center font-medium text-sm md:text-base">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.quantityAvailable}
                    className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <Plus size={14} className="md:hidden" />
                    <Plus size={16} className="hidden md:block" />
                  </button>
                </div>
              </div>

              {/* Price and Remove */}
              <div className="flex flex-col items-end justify-between flex-shrink-0">
                <button
                  type="button"
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-600 hover:text-red-700 transition"
                >
                  <Trash2 size={18} className="md:hidden" />
                  <Trash2 size={20} className="hidden md:block" />
                </button>
                <div className="text-right">
                  <p className="text-base md:text-lg font-bold text-purple-700">
                    Rs. {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-gray-200 rounded-lg md:rounded-xl p-4 md:p-6 lg:sticky lg:top-24">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">Rs. {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Rs. 250.00</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg text-purple-700">Rs. {(total + 250).toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-2.5 md:py-3 bg-purple-700 text-white font-bold text-sm md:text-base rounded-lg hover:bg-purple-800 transition mb-3"
            >
              Proceed to Checkout
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2.5 md:py-3 bg-gray-100 text-gray-700 font-bold text-sm md:text-base rounded-lg hover:bg-gray-200 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
