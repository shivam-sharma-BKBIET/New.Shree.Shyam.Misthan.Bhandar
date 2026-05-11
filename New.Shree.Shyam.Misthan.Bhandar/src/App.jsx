import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import Contact from './pages/Contact';
import About from './pages/About';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import WhatsAppButton from './components/WhatsAppButton';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

// Admin Protected Route
const AdminProtectedRoute = ({ children }) => {
  const { user, token } = useAuth();
  const isAdmin = user?.isAdmin || sessionStorage.getItem('isAdminAuthenticated') === 'true';
  return isAdmin ? children : <Navigate to="/admin-login" />;
};

// User Protected Route for Checkout
const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <GoogleOAuthProvider clientId="803081894518-bgrvtqksj3pvbh4q4mlec88p73b75qph.apps.googleusercontent.com">
      <ProductProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <ScrollToTop />
              <div className="app-wrapper">
                <Navbar />
                <CartDrawer />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/track-order" element={<TrackOrder />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    
                    {/* User Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/profile" element={<UserProtectedRoute><Profile /></UserProtectedRoute>} />
                    
                    {/* Protected Checkout */}
                    <Route 
                      path="/checkout" 
                      element={
                        <UserProtectedRoute>
                          <Checkout />
                        </UserProtectedRoute>
                      } 
                    />
                    
                    {/* Admin Routes */}
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route 
                      path="/admin" 
                      element={
                        <AdminProtectedRoute>
                          <Admin />
                        </AdminProtectedRoute>
                      } 
                    />
                  </Routes>
                </main>
                <WhatsAppButton />
                <Footer />
              </div>
              </Router>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ProductProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
