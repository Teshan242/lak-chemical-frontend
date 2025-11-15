import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Search, Menu, Facebook, Instagram, Linkedin, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { categoryService } from '../api/services'
import type { Category } from '../types'

export function Header() {
  const { user, isAuthenticated } = useAuth()
  const { itemCount, total } = useCart()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>([])
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories()
      setCategories(data || [])
    } catch (err) {
      console.error('Failed to load categories:', err)
      setCategories([])
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}${selectedCategory ? `&category=${selectedCategory}` : ''}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-purple-700 text-white text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-yellow-300 font-medium uppercase transition">
              HOME
            </Link>
            <Link to="/newsroom" className="hover:text-yellow-300 font-medium uppercase transition">
              NEWSROOM
            </Link>
            <Link to="/faqs" className="hover:text-yellow-300 font-medium uppercase transition">
              FAQS
            </Link>
            <Link to="/contact" className="hover:text-yellow-300 font-medium uppercase transition">
              CONTACT US
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Facebook size={14} className="cursor-pointer hover:text-yellow-300 transition" />
            <Instagram size={14} className="cursor-pointer hover:text-yellow-300 transition" />
            <Linkedin size={14} className="cursor-pointer hover:text-yellow-300 transition" />
            <span className="hidden sm:inline text-yellow-300 font-semibold ml-2">
              Islandwide Delivery
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-2 md:gap-4">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 md:gap-2">
            <div className="text-xl md:text-2xl font-bold text-purple-700">LAK</div>
            <div className="text-[10px] md:text-xs text-gray-600">
              <div className="font-bold">CHEMICAL</div>
              <div className="font-bold">& HARDWARE</div>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-l-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products..."
                className="w-full border-y border-r border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-700">
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Toggle search"
          >
            <Search size={20} />
          </button>

          {/* Auth & Cart */}
          <div className="flex items-center gap-2 md:gap-4">
            {isAuthenticated ? (
              <Link to="/profile" className="flex items-center gap-2 hover:text-purple-700 transition">
                <User size={20} />
                <span className="hidden lg:inline text-sm font-medium">{user?.name}</span>
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-2 hover:text-purple-700 transition">
                <User size={20} />
                <span className="hidden lg:inline text-sm font-medium">LOGIN</span>
              </Link>
            )}

            <Link to="/cart" className="relative flex items-center gap-2 hover:text-purple-700 transition">
              <div className="relative">
                <ShoppingCart size={24} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-purple-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <div className="hidden lg:block text-sm">
                <div className="text-gray-500 text-xs">Cart Total</div>
                <div className="font-bold text-purple-700">Rs. {total.toFixed(2)}</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
          <form onSubmit={handleSearch} className="flex flex-col gap-2">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-700">
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Desktop Navigation Bar */}
      <div className="hidden md:block bg-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-6 relative overflow-x-auto">
          <div className="relative">
            <button 
              type="button" 
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="flex items-center gap-2 bg-purple-800 hover:bg-purple-900 px-4 py-2 rounded transition"
            >
              <Menu size={18} />
              <span className="text-sm font-semibold uppercase">Browse Categories</span>
            </button>
            
            {showCategoryMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white text-gray-900 rounded-lg shadow-lg min-w-[250px] py-2 z-50">
                {categories.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">No categories available</div>
                ) : (
                  categories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/?category=${cat.id}`}
                      onClick={() => setShowCategoryMenu(false)}
                      className="block px-4 py-2 text-sm hover:bg-purple-50 hover:text-purple-700 transition"
                    >
                      {cat.name}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
          <Link to="/shop" className="text-sm font-semibold uppercase hover:text-yellow-300 transition whitespace-nowrap">
            SHOP
          </Link>
          <Link to="/hot-deals" className="text-sm font-semibold uppercase hover:text-yellow-300 transition whitespace-nowrap">
            HOT DEALS
          </Link>
          <Link to="/brands" className="text-sm font-semibold uppercase hover:text-yellow-300 transition whitespace-nowrap">
            FIND BY BRAND
          </Link>
          <Link to="/mix-colour" className="text-sm font-semibold uppercase hover:text-yellow-300 transition whitespace-nowrap">
            MIX YOUR COLOUR
          </Link>
          <Link to="/quote" className="text-sm font-semibold uppercase hover:text-yellow-300 transition whitespace-nowrap">
            GET QUOTE
          </Link>
          <Link to="/delivery" className="text-sm font-semibold uppercase hover:text-yellow-300 transition whitespace-nowrap">
            DELIVERY OPTIONS
          </Link>
          <Link to="/payment" className="text-sm font-semibold uppercase hover:text-yellow-300 transition whitespace-nowrap">
            PAYMENT OPTIONS
          </Link>
          <Link to="/careers" className="text-sm font-semibold uppercase hover:text-yellow-300 transition whitespace-nowrap">
            CAREERS
          </Link>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-4 space-y-3">
            {/* Categories Dropdown */}
            <div>
              <button
                type="button"
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="w-full flex items-center justify-between gap-2 bg-purple-700 text-white px-4 py-3 rounded-lg hover:bg-purple-800 transition"
              >
                <div className="flex items-center gap-2">
                  <Menu size={18} />
                  <span className="text-sm font-semibold">Browse Categories</span>
                </div>
              </button>
              {showCategoryMenu && (
                <div className="mt-2 bg-gray-50 rounded-lg py-2">
                  {categories.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">No categories available</div>
                  ) : (
                    categories.map(cat => (
                      <Link
                        key={cat.id}
                        to={`/?category=${cat.id}`}
                        onClick={() => { setShowCategoryMenu(false); setShowMobileMenu(false); }}
                        className="block px-4 py-2 text-sm hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        {cat.name}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
            
            {/* Main Navigation Links */}
            <div className="space-y-2">
              <Link to="/" onClick={() => setShowMobileMenu(false)} className="block px-4 py-2 text-sm font-medium hover:bg-purple-50 hover:text-purple-700 rounded transition">
                HOME
              </Link>
              <Link to="/shop" onClick={() => setShowMobileMenu(false)} className="block px-4 py-2 text-sm font-medium hover:bg-purple-50 hover:text-purple-700 rounded transition">
                SHOP
              </Link>
              <Link to="/hot-deals" onClick={() => setShowMobileMenu(false)} className="block px-4 py-2 text-sm font-medium hover:bg-purple-50 hover:text-purple-700 rounded transition">
                HOT DEALS
              </Link>
              <Link to="/brands" onClick={() => setShowMobileMenu(false)} className="block px-4 py-2 text-sm font-medium hover:bg-purple-50 hover:text-purple-700 rounded transition">
                FIND BY BRAND
              </Link>
              <Link to="/mix-colour" onClick={() => setShowMobileMenu(false)} className="block px-4 py-2 text-sm font-medium hover:bg-purple-50 hover:text-purple-700 rounded transition">
                MIX YOUR COLOUR
              </Link>
              <Link to="/quote" onClick={() => setShowMobileMenu(false)} className="block px-4 py-2 text-sm font-medium hover:bg-purple-50 hover:text-purple-700 rounded transition">
                GET QUOTE
              </Link>
              <Link to="/newsroom" onClick={() => setShowMobileMenu(false)} className="block px-4 py-2 text-sm font-medium hover:bg-purple-50 hover:text-purple-700 rounded transition">
                NEWSROOM
              </Link>
              <Link to="/faqs" onClick={() => setShowMobileMenu(false)} className="block px-4 py-2 text-sm font-medium hover:bg-purple-50 hover:text-purple-700 rounded transition">
                FAQS
              </Link>
              <Link to="/contact" onClick={() => setShowMobileMenu(false)} className="block px-4 py-2 text-sm font-medium hover:bg-purple-50 hover:text-purple-700 rounded transition">
                CONTACT US
              </Link>
              <Link to="/careers" onClick={() => setShowMobileMenu(false)} className="block px-4 py-2 text-sm font-medium hover:bg-purple-50 hover:text-purple-700 rounded transition">
                CAREERS
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
