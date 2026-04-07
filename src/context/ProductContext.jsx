import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { products as initialProducts, categories as initialCategories } from '../data/mockData';
import { getApiUrl } from '../config';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [heroData, setHeroData] = useState({
    heading: "Delicious Sweets Delivered to Your Door",
    subtext: "Experience the finest traditional Indian mithai, premium chocolates, and freshly baked cakes made with love and pure ingredients.",
    image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=1000"
  });
  const [aboutData, setAboutData] = useState({
    story: "Bringing traditional Indian flavors to your modern lifestyle with purity, passion, and precision since 1995.",
    heritageText: "Sweet Delight was founded with a single mission: to redefine the experience of traditional Indian sweets. Starting from a small kitchen in the heart of the city, we have grown into a beloved destination for dessert lovers.",
    heritageImage: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=1000",
    ownerImage: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=1000",
    ownerName: "Rajesh & Sunita Sharma",
    ownerQuote: "\"For us, sweets are more than just food; they are a celebration of life.\""
  });
  const [footerData, setFooterData] = useState({
    shopName: "New Shree Shyam Misthan Bhandar",
    description: "Bringing you the authentic taste of traditional Indian sweets made with pure desi ghee and love.",
    addresses: ["123 Sweet Lane, Jaipur, Rajasthan"],
    phoneNumbers: ["+91 9876543210"],
    email: "hello@newshreeshyam.com",
    hours: "Mon-Sun: 9:00 AM - 10:00 PM"
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSiteData = useCallback(async () => {
    try {
      const response = await fetch(getApiUrl('/api/site/data'));
      const data = await response.json();
      
      if (response.ok) {
        if (data.products?.length > 0) setProducts(data.products);
        if (data.categories?.length > 0) setCategories(data.categories);
        if (data.settings) {
          if (data.settings.hero) setHeroData(data.settings.hero);
          if (data.settings.about) setAboutData(data.settings.about);
          if (data.settings.footer) setFooterData(data.settings.footer);
        }
        
        // --- SEEDING LOGIC (One-time migration from LocalStorage to Cloud) ---
        const hasSeeded = localStorage.getItem('cloud_sync_done');
        if (!hasSeeded && (data.products?.length === 0 || !data.settings)) {
          console.log('📦 Starting first-run cloud synchronization...');
          const adminKey = 'NewShyamSecretKey2026';
          
          // Fetch legacy local data if it exists
          const localHero = localStorage.getItem('sweet_delight_hero');
          const localProducts = localStorage.getItem('sweet_delight_products');
          const localCategories = localStorage.getItem('sweet_delight_categories');

          if (localHero) {
            await fetch(getApiUrl('/api/site/settings'), {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
              body: localHero
            });
          }
          if (localProducts) {
            await fetch(getApiUrl('/api/site/products/sync'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
              body: JSON.stringify({ products: JSON.parse(localProducts) })
            });
          }
          if (localCategories) {
            await fetch(getApiUrl('/api/site/categories/sync'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
              body: JSON.stringify({ categories: JSON.parse(localCategories) })
            });
          }
          localStorage.setItem('cloud_sync_done', 'true');
          fetchSiteData(); // Refresh after seeding
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
    await fetch(getApiUrl('/api/site/settings'), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': 'NewShyamSecretKey2026' },
      body: JSON.stringify({ hero: data })
    });
  };

  const updateAbout = async (data) => {
    setAboutData(data);
    await fetch(getApiUrl('/api/site/settings'), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': 'NewShyamSecretKey2026' },
      body: JSON.stringify({ about: data })
    });
  };

  const updateFooter = async (data) => {
    setFooterData(data);
    await fetch(getApiUrl('/api/site/settings'), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': 'NewShyamSecretKey2026' },
      body: JSON.stringify({ footer: data })
    });
  };

  const addProduct = async (newProduct) => {
    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const productWithId = { ...newProduct, id, rating: 5.0, reviews: [] };
    setProducts(prev => [...prev, productWithId]);
    
    // Instead of a dedicated POST /products, we use the sync/patch logic for simplicity or we could add a dedicated route
    // For now, let's just push the whole array to keep it synced
    await fetch(getApiUrl('/api/site/products/sync'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': 'NewShyamSecretKey2026' },
      body: JSON.stringify({ products: [...products, productWithId] })
    });
  };

  const updateProduct = async (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    await fetch(getApiUrl(`/api/site/products/${updatedProduct.id}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': 'NewShyamSecretKey2026' },
      body: JSON.stringify(updatedProduct)
    });
  };

  const deleteProduct = async (productId) => {
    const remaining = products.filter(p => p.id !== productId);
    setProducts(remaining);
    await fetch(getApiUrl('/api/site/products/sync'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': 'NewShyamSecretKey2026' },
      body: JSON.stringify({ products: remaining })
    });
  };

  const addCategory = async (name) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    if (!categories.find(c => c.id === id)) {
      const newCats = [...categories, { id, name, icon: '🏷️' }];
      setCategories(newCats);
      await fetch(getApiUrl('/api/site/categories/sync'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': 'NewShyamSecretKey2026' },
        body: JSON.stringify({ categories: newCats })
      });
    }
  };

  const deleteCategory = async (categoryId) => {
    const newCats = categories.filter(c => c.id !== categoryId);
    setCategories(newCats);
    await fetch(getApiUrl('/api/site/categories/sync'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': 'NewShyamSecretKey2026' },
      body: JSON.stringify({ categories: newCats })
    });
  };

  const getProductById = (id) => products.find(p => p.id === parseInt(id));

  return (
    <ProductContext.Provider value={{ 
      products, 
      categories, 
      aboutData,
      heroData,
      footerData,
      isLoading,
      addProduct, 
      updateProduct, 
      deleteProduct, 
      getProductById,
      updateAbout,
      updateHero,
      updateFooter,
      addCategory,
      deleteCategory
    }}>
      {children}
    </ProductContext.Provider>
  );
};
