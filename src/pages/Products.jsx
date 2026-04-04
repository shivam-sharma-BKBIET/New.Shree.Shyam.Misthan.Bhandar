import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { fuzzyMatch } from '../utils/searchUtils';
import './Products.css';

const Products = () => {
  const { products, categories } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'All');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val) {
      searchParams.set('search', val);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams, { replace: true });
  };

  useEffect(() => {
    let result = products;
    
    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    
    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const matched = result.map(p => {
        const nameMatch = fuzzyMatch(searchQuery, p.name);
        const descMatch = fuzzyMatch(searchQuery, p.description);
        return {
          product: p,
          isMatch: nameMatch.isMatch || descMatch.isMatch,
          score: Math.max(nameMatch.score || 0, descMatch.score || 0)
        };
      }).filter(item => item.isMatch);

      matched.sort((a, b) => b.score - a.score);
      result = matched.map(item => item.product);
    }
    
    setFilteredProducts(result);
  }, [activeCategory, searchQuery, products]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    if (catId === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="products-page section">
      <div className="container">
        <h1 className="section-title">Our <span>Full Menu</span></h1>
        
        <div className="filter-bar">
          {/* Search Box */}
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search for sweets, cakes, namkin..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          {/* Categories Pills */}
          <div className="category-filters">
            <button 
              className={`filter-pill ${activeCategory === 'All' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('All')}
            >
              All Delights
            </button>
            {categories.map((cat) => (
              <button 
                key={cat.id}
                className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="results-header">
          <p>Showing {filteredProducts.length} items {activeCategory !== 'All' ? `in ${activeCategory}` : ''}</p>
        </div>

        {/* Dynamic Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No sweet treats found.</h3>
            <p>Try a different search term or category to find what you're craving.</p>
            <button className="btn btn-outline mt-4" onClick={() => {setSearchQuery(''); handleCategoryChange('All');}}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
