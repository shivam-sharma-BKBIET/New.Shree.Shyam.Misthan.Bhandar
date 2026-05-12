// eslint-disable-next-line react-refresh/only-export-components
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { products as initialProducts, categories as initialCategories } from '../data/mockData';
import { getApiUrl } from '../config';

const ProductContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [categories, _setCategories] = useState(initialCategories);
  const [heroData, setHeroData] = useState({
    heading: "Delicious Sweets Delivered to Your Door",
    subtext: "Experience the finest traditional Indian mithai, premium chocolates, and freshly baked cakes made with love and pure ingredients.",
    image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=1000"
  });
  const [aboutData, setAboutData] = useState({
    story: "Bringing traditional Indian flavors to your modern lifestyle with purity, passion, and precision since 1995.",
    heroBadge: "SINCE 1999",
    heroTitle: "Crafting Sweet Memories for Generations",
    heritageTitle: "A Tradition of Purity & Taste",
    heritageText: "Sweet Delight was founded with a single mission: to redefine the experience of traditional Indian sweets. Starting from a small kitchen in the heart of the city, we have grown into a beloved destination for dessert lovers.",
    heritageImage: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=1000",
    ownerImage: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=1000",
    ownerName: "Rajesh & Sunita Sharma",
    ownerQuote: "\"For us, sweets are more than just food; they are a celebration of life.\"",
    valuesTitle: "The Pillars of Our Excellence",
    valuesSubtitle: "What makes every bite of our sweets special.",
    experienceYears: "25+"
  });
  const [footerData, setFooterData] = useState({
    shopName: "New Shree Shyam Misthan Bhandar",
    description: "Bringing you the authentic taste of traditional Indian sweets made with pure desi ghee and love.",
    addresses: ["Shree Shyam Mishthan Bhandar, Sultana"],
    phoneNumbers: ["+91 9928432235", "+91 9928349207"],
    email: "New.shree.shyam.misthan.bhandar@gmail.com",
    hours: "Mon-Sun: 9:00 AM - 10:00 PM"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [deliverySettings, setDeliverySettings] = useState({
    perKmCharge: 10,
    minDeliveryCharge: 20,
    maxDeliveryDistance: 30,
    shopLat: 27.7,
    shopLng: 75.0
  });

  // Load from cache on mount
  useEffect(() => {
    const cachedData = localStorage.getItem('site_data_cache');
    if (cachedData) {
      try {
        const data = JSON.parse(cachedData);
        if (data.products) setProducts(data.products);
        if (data.categories) _setCategories(data.categories);
        if (data.settings) {
          if (data.settings.hero) setHeroData(data.settings.hero);
          if (data.settings.about) setAboutData(data.settings.about);
          if (data.settings.footer) setFooterData(data.settings.footer);
          if (data.settings.deliveryCharge !== undefined) setDeliveryCharge(data.settings.deliveryCharge);
          setDeliverySettings(prev => ({ ...prev, ...data.settings }));
        }
        setIsLoading(false); // Immediate activation if cache exists
      } catch (e) {
        console.error('Cache load error:', e);
      }
    }
  }, []);

  const fetchSiteData = useCallback(async () => {
    try {
      const response = await fetch(getApiUrl('/api/site/data'));
      const data = await response.json();
      
      if (response.ok) {
        // Update state
        if (data.products?.length > 0) setProducts(data.products);
        if (data.categories?.length > 0) _setCategories(data.categories);
        if (data.settings) {
          if (data.settings.hero) setHeroData(data.settings.hero);
          if (data.settings.about) setAboutData(data.settings.about);
          if (data.settings.footer) setFooterData(data.settings.footer);
          if (data.settings.deliveryCharge !== undefined) setDeliveryCharge(data.settings.deliveryCharge);
          setDeliverySettings(prev => ({
            perKmCharge:         data.settings.perKmCharge         ?? prev.perKmCharge,
            minDeliveryCharge:   data.settings.minDeliveryCharge   ?? prev.minDeliveryCharge,
            maxDeliveryDistance: data.settings.maxDeliveryDistance ?? prev.maxDeliveryDistance,
            shopLat:             data.settings.shopLat             ?? prev.shopLat,
            shopLng:             data.settings.shopLng             ?? prev.shopLng,
          }));
        }

        // Update Cache
        localStorage.setItem('site_data_cache', JSON.stringify(data));
        
        // --- SEEDING LOGIC (One-time migration from LocalStorage to Cloud) ---
        const hasSeeded = localStorage.getItem('cloud_sync_done_v3');
        if (!hasSeeded && (data.products?.length === 0 || !data.settings)) {
          console.log('📦 Starting first-run cloud synchronization...');
          localStorage.setItem('cloud_sync_done_v3', 'true');
          fetchSiteData(); // Refresh
        }
      }
    } catch (error) {
      console.error('Failed to sync with cloud:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSiteData();
  }, [fetchSiteData]);

  // Admin Actions (Synced with Backend)
  const updateHero = async (data) => {
    setHeroData(data);
    try {
      await fetch(getApiUrl('/api/site/settings'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': import.meta.env.VITE_ADMIN_KEY },
        body: JSON.stringify({ hero: data })
      });
    } catch (error) {
      console.error('ProductContext error:', error);
    }
  };

  const updateAbout = async (data) => {
    setAboutData(data);
    try {
      await fetch(getApiUrl('/api/site/settings'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': import.meta.env.VITE_ADMIN_KEY },
        body: JSON.stringify({ about: data })
      });
    } catch (error) {
      console.error('ProductContext error:', error);
    }
  };

  const updateFooter = async (data) => {
    setFooterData(data);
    try {
      await fetch(getApiUrl('/api/site/settings'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': import.meta.env.VITE_ADMIN_KEY },
        body: JSON.stringify({ footer: data })
      });
    } catch (error) {
      console.error('ProductContext error:', error);
    }
  };

  const updateDeliveryCharge = async (charge) => {
    const val = parseFloat(charge) || 0;
    setDeliveryCharge(val);
    try {
      await fetch(getApiUrl('/api/site/settings'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': import.meta.env.VITE_ADMIN_KEY },
        body: JSON.stringify({ deliveryCharge: val })
      });
    } catch (error) {
      console.error('ProductContext error:', error);
    }
  };

  const updateDeliverySettings = async (settings) => {
    setDeliverySettings(settings);
    try {
      await fetch(getApiUrl('/api/site/settings'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': import.meta.env.VITE_ADMIN_KEY },
        body: JSON.stringify(settings)
      });
    } catch (error) {
      console.error('ProductContext error:', error);
    }
  };

  const addProduct = async (newProduct) => {
    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const productWithId = { ...newProduct, id, rating: 5.0, reviews: [] };
    setProducts(prev => [...prev, productWithId]);
    
    try {
      await fetch(getApiUrl('/api/site/products'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': import.meta.env.VITE_ADMIN_KEY },
        body: JSON.stringify(productWithId)
      });
    } catch (error) {
      console.error('ProductContext error:', error);
    }
  };

  const updateProduct = async (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    try {
      await fetch(getApiUrl(`/api/site/products/${updatedProduct.id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': import.meta.env.VITE_ADMIN_KEY },
        body: JSON.stringify(updatedProduct)
      });
    } catch (error) {
      console.error('ProductContext error:', error);
    }
  };

  const deleteProduct = async (productId) => {
    const remaining = products.filter(p => p.id !== productId);
    setProducts(remaining);
    try {
      await fetch(getApiUrl(`/api/site/products/${productId}`), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': import.meta.env.VITE_ADMIN_KEY }
      });
    } catch (error) {
      console.error('ProductContext error:', error);
    }
  };

  const addCategory = async (name) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    if (!categories.find(c => c.id === id)) {
      const newCats = [...categories, { id, name, icon: '🏷️' }];
      _setCategories(newCats);
      try {
        await fetch(getApiUrl('/api/site/categories'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-key': import.meta.env.VITE_ADMIN_KEY },
          body: JSON.stringify({ id, name, icon: '🏷️' })
        });
      } catch (error) {
        console.error('ProductContext error:', error);
      }
    }
  };

  const deleteCategory = async (categoryId) => {
    const newCats = categories.filter(c => c.id !== categoryId);
    _setCategories(newCats);
    try {
      await fetch(getApiUrl(`/api/site/categories/${categoryId}`), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': import.meta.env.VITE_ADMIN_KEY }
      });
    } catch (error) {
      console.error('ProductContext error:', error);
    }
  };

  const updateCategory = async (categoryId, newName) => {
    const updatedCats = categories.map(c => c.id === categoryId ? { ...c, name: newName } : c);
    _setCategories(updatedCats);
    try {
      await fetch(getApiUrl(`/api/site/categories/${categoryId}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': import.meta.env.VITE_ADMIN_KEY },
        body: JSON.stringify({ name: newName })
      });
    } catch (error) {
      console.error('ProductContext error:', error);
    }
  };

  const getProductById = (id) => products.find(p => p.id === parseInt(id));

  const addReview = async (productId, reviewData) => {
    const newReview = {
      id: Date.now(),
      ...reviewData,
      date: new Date().toISOString()
    };
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        const updatedReviews = [...(p.reviews || []), newReview];
        const avgRating = (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1);
        return { ...p, reviews: updatedReviews, rating: parseFloat(avgRating) };
      }
      return p;
    });
    setProducts(updatedProducts);

    const updatedProduct = updatedProducts.find(p => p.id === productId);
    if (updatedProduct) {
      try {
        await fetch(getApiUrl(`/api/site/products/${productId}`), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'x-admin-key': import.meta.env.VITE_ADMIN_KEY },
          body: JSON.stringify(updatedProduct)
        });
      } catch (error) {
        console.error('ProductContext error:', error);
      }
    }
  };

  const deleteReview = async (productId, reviewId, token) => {
    // Determine headers based on whether we have a token or an admin session
    const headers = { 'Content-Type': 'application/json' };
    const adminKey = localStorage.getItem('adminKey'); // Check for admin session

    if (adminKey) {
      headers['x-admin-key'] = adminKey;
    } else if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(getApiUrl(`/api/site/products/${productId}/reviews/${reviewId}`), {
        method: 'DELETE',
        headers: headers
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('ProductContext error:', error);
      throw error;
    }

    // Update local context state optimistically
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedReviews = (p.reviews || []).filter(r => r.id !== reviewId);
        const avgRating = updatedReviews.length > 0
          ? (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
          : p.rating;
        return { ...p, reviews: updatedReviews, rating: parseFloat(avgRating) };
      }
      return p;
    }));
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      categories, 
      aboutData,
      heroData,
      footerData,
      deliveryCharge,
      deliverySettings,
      isLoading,
      addProduct, 
      updateProduct, 
      deleteProduct, 
      getProductById,
      addReview,
      deleteReview,
      updateAbout,
      updateHero,
      updateFooter,
      updateDeliveryCharge,
      updateDeliverySettings,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </ProductContext.Provider>
  );
};
