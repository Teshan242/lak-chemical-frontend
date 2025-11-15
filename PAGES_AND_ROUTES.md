# Frontend Pages & Routes - Complete Guide

## 📱 All Pages Created

### **Public Pages** (Accessible to Everyone)

1. **Home Page** (`/`)
   - Product listing with purple/yellow theme
   - Featured products grid (4 columns)
   - Add to cart functionality
   - Product cards with discount badges

2. **Login Page** (`/login`)
   - Google OAuth authentication
   - Error handling
   - Redirect to home after login

---

### **Shopping & Cart Pages**

3. **Cart Page** (`/cart`)
   - View cart items
   - Update quantities (+/-)
   - Remove items
   - See total with shipping
   - Proceed to checkout button

4. **Checkout Page** (`/checkout`) 🔒 Requires Auth
   - Shipping address form
   - Phone number input
   - Order summary
   - Payment method (Cash on Delivery)
   - Place order functionality

---

### **User Account Pages** 🔒 Requires Authentication

5. **Profile Page** (`/profile`)
   - User information display
   - Account details
   - Navigation to My Orders
   - Admin dashboard link (for admins)
   - Logout button

6. **My Orders Page** (`/orders`)
   - List of all user orders
   - Order status badges
   - Order date and shipping address
   - Total amount per order
   - Click to view details

7. **Order Detail Page** (`/orders/:id`)
   - Complete order information
   - List of ordered items
   - Shipping address
   - Order status
   - Order date
   - Total breakdown

---

### **Admin Pages** 👑 Requires ADMIN Role

8. **Admin Dashboard** (`/admin` or `/admin/dashboard`)
   - Total revenue card
   - Total orders count
   - Active customers count
   - Average order value
   - Low stock products list
   - Top customers list
   - Quick links to manage products/orders

9. **Admin Product Management** (`/admin/products`)
   - List all products in table
   - Search products
   - Add new product (modal form)
   - Edit existing product
   - Delete product
   - View stock levels
   - Product details (name, category, price, stock)

10. **Admin Order Management** (`/admin/orders`)
    - View all orders
    - Update order status dropdown
    - See shipping addresses
    - View order items
    - Total amount per order
    - Filter by status

---

## 🗺️ Complete Route Map

```
Public Routes (No Authentication Required):
├── /                    → HomePage
├── /shop                → HomePage
├── /hot-deals           → HomePage
├── /brands              → HomePage
└── /login               → LoginPage

Shopping Routes:
├── /cart                → CartPage
└── /checkout            → CheckoutPage (Auth Required)

User Routes (Authentication Required):
├── /profile             → ProfilePage
├── /orders              → MyOrdersPage
└── /orders/:id          → OrderDetailPage

Admin Routes (Admin Role Required):
├── /admin               → AdminDashboardPage
├── /admin/dashboard     → AdminDashboardPage
├── /admin/products      → AdminProductsPage
└── /admin/orders        → AdminOrdersPage
```

---

## 🔗 Navigation Flow

### **Customer Journey:**
1. Browse products → `/`
2. Add to cart → items stored in cart context
3. View cart → `/cart`
4. Login (if not authenticated) → `/login`
5. Checkout → `/checkout`
6. Place order → Redirected to `/orders/:id`
7. View all orders → `/orders`

### **Admin Journey:**
1. Login with admin email → `/login`
2. Go to profile → `/profile`
3. Click "Admin Dashboard" → `/admin`
4. Manage products → `/admin/products`
5. Manage orders → `/admin/orders`
6. View reports → `/admin/dashboard`

---

## 🎨 UI Features

### **Consistent Design Elements:**
- Purple (#6d28d9) primary color
- Yellow (#fbbf24) accent color
- White backgrounds
- Rounded corners (rounded-2xl)
- Shadow effects
- Hover transitions
- Loading spinners
- Error messages
- Success notifications

### **Product Cards:**
- Yellow border (4px)
- Purple discount badge (top-left)
- "MEMBER PRICE" tag (yellow, top-right)
- Product image
- Name and description
- Old/new price display
- Purple "ADD TO CART" button

### **Forms:**
- Input validation
- Error states
- Loading states
- Success feedback
- Disabled states

---

## 🔐 Authentication & Authorization

### **Auth Context Features:**
- `isAuthenticated` - Check if user logged in
- `isAdmin` - Check if user has admin role
- `user` - User profile data
- `setUser` - Update user data
- Automatic redirect for protected routes

### **Protected Routes:**
- `/checkout` - Requires authentication
- `/profile` - Requires authentication
- `/orders` - Requires authentication
- `/orders/:id` - Requires authentication
- `/admin/*` - Requires ADMIN role

---

## 🛠️ API Integration

All pages are connected to your Spring Boot backend:

### **Product APIs:**
- `GET /api/products` - List products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### **Order APIs:**
- `POST /api/orders` - Create order
- `GET /api/orders/my` - Get user orders
- `GET /api/orders/:id` - Get order details
- `GET /api/admin/orders` - List all orders (Admin)
- `PUT /api/admin/orders/:id/status` - Update status (Admin)

### **Auth APIs:**
- `POST /api/auth/google` - Google login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

### **Admin APIs:**
- `GET /api/admin/reports/dashboard` - Dashboard stats

---

## 📋 Page File Locations

```
frontend/src/pages/
├── HomePage.tsx
├── LoginPage.tsx
├── ProfilePage.tsx
├── CartPage.tsx
├── CheckoutPage.tsx
├── MyOrdersPage.tsx
├── OrderDetailPage.tsx
└── admin/
    ├── AdminDashboardPage.tsx
    ├── AdminProductsPage.tsx
    └── AdminOrdersPage.tsx
```

---

## ✅ Features Implemented

- [x] Google OAuth login
- [x] Shopping cart with localStorage
- [x] Product browsing and search
- [x] Checkout with address form
- [x] Order history
- [x] Order detail view
- [x] Admin dashboard with stats
- [x] Product management (CRUD)
- [x] Order status management
- [x] Role-based access control
- [x] Responsive design
- [x] Loading states
- [x] Error handling
- [x] Toast notifications
- [x] Modern purple/yellow theme

---

## 🚀 Next Steps

To use the complete application:

1. **Start Backend:** `mvn spring-boot:run` (port 8080)
2. **Start Frontend:** `npm run dev` (port 5173)
3. **Configure Google OAuth:** Add client ID to `.env`
4. **Test flows:**
   - Browse products
   - Add to cart
   - Login with Google
   - Complete checkout
   - View orders
   - Admin login
   - Manage products/orders

Your complete e-commerce application is ready! 🎉
