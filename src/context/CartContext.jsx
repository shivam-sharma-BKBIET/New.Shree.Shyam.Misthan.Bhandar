// eslint-disable-next-line react-refresh/only-export-components
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  // Generate a user-specific cart key
  const getCartKey = (u) => (u?.id || u?._id) ? `cart_${u.id || u._id}` : 'cart_guest';

  const loadCart = (key) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('CartContext error:', error);
      return [];
    }
  };

  const [cartItems, setCartItems] = useState(() => loadCart(getCartKey(user)));
  const [isCartOpen, setIsCartOpen] = useState(false);

  // When user changes (login/logout), merge guest cart with user cart
  useEffect(() => {
    const isLoggingIn = user && (user.id || user._id);
    const key = getCartKey(user);
    const savedUserCart = loadCart(key);
    
    if (isLoggingIn) {
      const guestCart = loadCart('cart_guest');
      if (guestCart.length > 0) {
        // Merge guest cart into user cart
        const mergedCart = [...savedUserCart];
        
        guestCart.forEach(guestItem => {
          const existingItem = mergedCart.find(item => item.id === guestItem.id);
          if (existingItem) {
            existingItem.quantity += guestItem.quantity;
          } else {
            mergedCart.push(guestItem);
          }
        });
        
        setCartItems(mergedCart);
        localStorage.removeItem('cart_guest'); // Clear guest cart after merge
      } else {
        setCartItems(savedUserCart);
      }
    } else {
      // Logging out or initializing as guest
      setCartItems(savedUserCart);
    }
    
    setIsCartOpen(false);
  }, [user?.id, user?._id]); // Only triggers when user ID changes

  // Save cart whenever items change
  useEffect(() => {
    const key = getCartKey(user);
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, user?.id, user?._id]);

  const addToCart = (product, quantity = 1, openDrawer = false) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      toggleCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
