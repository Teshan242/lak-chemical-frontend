# Lak Chemical & Hardware - Frontend

Modern e-commerce frontend for Sri Lankan hardware store built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- ✅ Modern purple/yellow/white themed UI
- ✅ Product browsing with 4-column grid
- ✅ Shopping cart with quantity controls
- ✅ Google OAuth authentication
- ✅ User profile management
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Real-time cart updates
- ✅ Local storage persistence

## 🛠️ Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v6
- **API Client:** Axios
- **Icons:** Lucide React
- **Authentication:** Google OAuth 2.0

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Google OAuth** (required for login):
   - See [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for detailed instructions
   - Update `client_id` in `src/pages/LoginPage.tsx`

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access the app:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080 (must be running)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── client.ts          # Axios instance with auth interceptors
│   │   └── services.ts        # API service functions
│   ├── components/
│   │   ├── Header.tsx         # Three-tier header component
│   │   └── ProductCard.tsx    # Product display card
│   ├── context/
│   │   ├── AuthContext.tsx    # Authentication state
│   │   └── CartContext.tsx    # Shopping cart state
│   ├── pages/
│   │   ├── HomePage.tsx       # Product listing
│   │   ├── CartPage.tsx       # Shopping cart
│   │   ├── LoginPage.tsx      # Google OAuth login
│   │   └── ProfilePage.tsx    # User profile
│   ├── types.ts               # TypeScript interfaces
│   ├── App.tsx                # Main app with routing
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## 🎨 Color Theme

- **Primary Purple:** `#6d28d9`
- **Purple Hover:** `#5b21b6`
- **Yellow Accent:** `#fbbf24`
- **Yellow Light:** `#fde68a`
- **Background:** `#f9fafb`

## 🔌 API Integration

The frontend connects to the Spring Boot backend via Vite proxy:

- Development: `/api` → `http://localhost:8080/api`
- All API calls go through `src/api/client.ts`
- Automatic JWT token refresh on 401 errors
- Token storage in localStorage

### Available API Endpoints:

- `GET /api/products` - List products
- `POST /api/orders` - Create order
- `GET /api/orders/my` - User's orders
- `POST /api/auth/google` - Google login
- `POST /api/auth/logout` - Logout
- `GET /api/categories` - List categories

## 🔐 Authentication Flow

1. User clicks "LOGIN / REGISTER" in header
2. Redirected to `/login` page
3. Clicks Google Sign-In button
4. Google OAuth popup appears
5. User authorizes the app
6. JWT tokens stored in localStorage
7. User context updated
8. Redirected to homepage

## 🛒 Shopping Cart

- Add/remove products
- Adjust quantities
- Real-time total calculation
- Persists in localStorage
- Badge shows item count
- Checkout flow ready

## 📱 Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Environment Variables

Create `.env` file if needed:
```env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

## 🐛 Troubleshooting

**Products not loading:**
- Ensure backend is running on port 8080
- Check browser console for CORS errors
- Verify API proxy in vite.config.ts

**Login not working:**
- Configure Google OAuth credentials
- Check client_id in LoginPage.tsx
- Ensure Google API script loads (check Network tab)

**Buttons not responding:**
- Hard refresh browser (Ctrl+F5)
- Clear localStorage
- Check browser console for errors

## 📄 License

Private project for Lak Chemical & Hardware

## 👨‍💻 Support

For issues or questions, contact the development team.
