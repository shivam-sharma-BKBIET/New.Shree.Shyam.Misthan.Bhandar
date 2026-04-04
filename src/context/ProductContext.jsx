import React, { createContext, useState, useContext, useEffect } from 'react';
import { products as initialProducts, categories as initialCategories } from '../data/mockData';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('sweet_delight_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(p => {
          if (p.image && (p.image.includes('unsplash.com') || p.image.includes('placehold.co') || p.image.includes('800px-'))) {
            const initialMatch = initialProducts.find(ip => ip.id === p.id);
            if (initialMatch) {
              p.image = initialMatch.image;
            }
          }
          return p;
        });
      } catch (e) {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('sweet_delight_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialCategories;
      }
    }
    return initialCategories;
  });

  // NEW: About Us Content State
  const [aboutData, setAboutData] = useState(() => {
    const saved = localStorage.getItem('sweet_delight_about');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {
          story: "Bringing traditional Indian flavors to your modern lifestyle with purity, passion, and precision since 1995.",
          heritageText: "Sweet Delight was founded with a single mission: to redefine the experience of traditional Indian sweets. Starting from a small kitchen in the heart of the city, we have grown into a beloved destination for dessert lovers.",
          heritageImage: "file:///C:/Users/satish%20kumar/.gemini/antigravity/brain/e0580cba-ffdd-4e74-8e30-ebd49109e836/store_heritage_interior_1775148403652.png",
          ownerImage: "file:///C:/Users/satish%20kumar/.gemini/antigravity/brain/e0580cba-ffdd-4e74-8e30-ebd49109e836/shop_owners_portrait_1775148376053.png",
          ownerName: "Rajesh & Sunita Sharma",
          ownerQuote: "\"For us, sweets are more than just food; they are a celebration of life.\""
        };
      }
    }
    return {
      story: "Bringing traditional Indian flavors to your modern lifestyle with purity, passion, and precision since 1995.",
      heritageText: "Sweet Delight was founded with a single mission: to redefine the experience of traditional Indian sweets. Starting from a small kitchen in the heart of the city, we have grown into a beloved destination for dessert lovers.",
      heritageImage: "file:///C:/Users/satish%20kumar/.gemini/antigravity/brain/e0580cba-ffdd-4e74-8e30-ebd49109e836/store_heritage_interior_1775148403652.png",
      ownerImage: "file:///C:/Users/satish%20kumar/.gemini/antigravity/brain/e0580cba-ffdd-4e74-8e30-ebd49109e836/shop_owners_portrait_1775148376053.png",
      ownerName: "Rajesh & Sunita Sharma",
      ownerQuote: "\"For us, sweets are more than just food; they are a celebration of life.\""
    };
  });

  // NEW: Admin Auth Settings State
  const [adminAuth, setAdminAuth] = useState(() => {
    const saved = localStorage.getItem('sweet_delight_auth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return { username: 'admin', password: 'admin123' };
      }
    }
    return { username: 'admin', password: 'admin123' };
  });

  // NEW: Hero Section Content State
  const [heroData, setHeroData] = useState(() => {
    const saved = localStorage.getItem('sweet_delight_hero');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {
          heading: "Delicious Sweets Delivered to Your Door",
          subtext: "Experience the finest traditional Indian mithai, premium chocolates, and freshly baked cakes made with love and pure ingredients.",
          image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=1000"
        };
      }
    }
    return {
      heading: "Delicious Sweets Delivered to Your Door",
      subtext: "Experience the finest traditional Indian mithai, premium chocolates, and freshly baked cakes made with love and pure ingredients.",
      image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=1000"
    };
  });

  // NEW: Footer & Contact Settings State
  const [footerData, setFooterData] = useState(() => {
    const saved = localStorage.getItem('sweet_delight_footer');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Data Migration Layer for legacy string structures
        if (typeof parsed.address === 'string') {
          parsed.addresses = [parsed.address];
          delete parsed.address;
        }
        if (typeof parsed.phone === 'string') {
          parsed.phoneNumbers = [parsed.phone];
          delete parsed.phone;
        }
        return parsed;
      } catch (e) {
        // Drop down to default
      }
    }
    return {
      shopName: "New Shree Shyam Misthan Bhandar",
      description: "Bringing you the authentic taste of traditional Indian sweets made with pure desi ghee and love.",
      addresses: ["123 Sweet Lane, Jaipur, Rajasthan"],
      phoneNumbers: ["+91 9876543210"],
      email: "hello@newshreeshyam.com",
      hours: "Mon-Sun: 9:00 AM - 10:00 PM"
    };
  });

  useEffect(() => {
    localStorage.setItem('sweet_delight_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sweet_delight_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('sweet_delight_about', JSON.stringify(aboutData));
  }, [aboutData]);

  useEffect(() => {
    localStorage.setItem('sweet_delight_auth', JSON.stringify(adminAuth));
  }, [adminAuth]);

  useEffect(() => {
    localStorage.setItem('sweet_delight_hero', JSON.stringify(heroData));
  }, [heroData]);

  useEffect(() => {
    localStorage.setItem('sweet_delight_footer', JSON.stringify(footerData));
  }, [footerData]);

  const addCategory = (name) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    setCategories(prev => {
      if (!prev.find(c => c.id === id)) {
        return [...prev, { id, name, icon: '🏷️' }];
      }
      return prev;
    });
  };

  const updateCategory = (oldId, newName) => {
    const newId = newName.toLowerCase().replace(/\s+/g, '-');
    
    // Process Category Changes
    setCategories(prev => prev.map(c => {
      if (c.id === oldId) {
        return { ...c, id: newId, name: newName };
      }
      return c;
    }));

    // Perform mass product migration if the string root changed
    if (oldId !== newId) {
      setProducts(prev => prev.map(p => {
        if (p.category === oldId) {
          return { ...p, category: newId };
        }
        return p;
      }));
    }
  };

  const deleteCategory = (categoryId) => {
    setCategories(prev => {
      const filtered = prev.filter(c => c.id !== categoryId);
      // Auto-generate fallback taxonomy if orphaned products will exist and it's not already there
      const hasOrphans = products.some(p => p.category === categoryId);
      if (hasOrphans && !filtered.find(c => c.id === 'uncategorized')) {
        filtered.push({ id: 'uncategorized', name: 'Uncategorized', icon: '📦' });
      }
      return filtered;
    });
    setProducts(prev => prev.map(p => {
      if (p.category === categoryId) {
        return { ...p, category: 'uncategorized' };
      }
      return p;
    }));
  };

  const addProduct = (newProduct) => {
    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts(prev => [...prev, { ...newProduct, id, rating: 5.0, reviews: [] }]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addReview = (productId, review) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const reviews = p.reviews || [];
        const newReviews = [...reviews, { ...review, id: Date.now(), date: new Date().toISOString() }];
        // Recalculate rating
        const avgRating = newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length;
        return { ...p, reviews: newReviews, rating: parseFloat(avgRating.toFixed(1)) };
      }
      return p;
    }));
  };

  const getProductById = (id) => {
    return products.find(p => p.id === parseInt(id));
  };

  const updateAbout = (data) => setAboutData(data);
  const updateAuth = (creds) => setAdminAuth(creds);
  const updateHero = (data) => setHeroData(data);
  const updateFooter = (data) => setFooterData(data);

  return (
    <ProductContext.Provider value={{ 
      products, 
      categories, 
      aboutData,
      adminAuth,
      heroData,
      footerData,
      addProduct, 
      updateProduct, 
      deleteProduct, 
      addReview,
      getProductById,
      updateAbout,
      updateAuth,
      updateHero,
      updateFooter,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </ProductContext.Provider>
  );
};
