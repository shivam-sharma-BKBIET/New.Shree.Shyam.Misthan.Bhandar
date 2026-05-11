import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  // Generate a user-specific wishlist key
  const getWishlistKey = (u) => u?.id ? `wishlist_${u.id}` : 'wishlist_guest';

  const loadWishlist = (key) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const [wishlistItems, setWishlistItems] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Wait for auth to finish loading FIRST, then load correct wishlist
  useEffect(() => {
    if (authLoading) return; // Block until auth is fully settled
    const key = getWishlistKey(user);
    setWishlistItems(loadWishlist(key));
    setInitialized(true);
  }, [authLoading, user?.id]);

  // Save wishlist ONLY after it has been initialized (prevents overwriting with empty data)
  useEffect(() => {
    if (!initialized) return;
    const key = getWishlistKey(user);
    localStorage.setItem(key, JSON.stringify(wishlistItems));
  }, [wishlistItems, user?.id, initialized]);

  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev; // Already in wishlist
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  };

  const toggleWishlist = (product) => {
    setWishlistItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const clearWishlist = () => setWishlistItems([]);

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      wishlistCount
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
