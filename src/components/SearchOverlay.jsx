import React, { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { fuzzyMatch } from '../utils/searchUtils';
import ProductCard from './ProductCard';
import './SearchOverlay.css';
import { useNavigate } from 'react-router-dom';

const HighlightedText = ({ text, indices }) => {
  if (!indices || indices.length === 0) return <span>{text}</span>;
  
  return (
    <span>
      {text.split('').map((char, index) => {
        const isHighlighted = indices.includes(index);
        return isHighlighted ? <mark key={index} className="search-highlight">{char}</mark> : <span key={index}>{char}</span>;
      })}
    </span>
  );
};

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { products } = useProducts();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
        document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const matched = products.map(product => {
      const nameMatch = fuzzyMatch(query, product.name);
      return {
        product,
        matchData: nameMatch
      };
    }).filter(item => item.matchData.isMatch);

    matched.sort((a, b) => b.matchData.score - a.matchData.score);
    
    setResults(matched);
  }, [query, products]);

  if (!isOpen) return null;

  const handleSuggestionClick = (product) => {
     onClose();
     navigate(`/product/${product.id}`);
  };

  return (
    <div className="search-overlay">
      <div className="search-overlay-backdrop" onClick={onClose}></div>
      <div className="search-overlay-content container">
        
        {/* Header Section */}
        <div className="search-overlay-header">
          <div className="search-input-wrapper">
             <Search className="search-icon-large" size={28} />
             <input
               ref={inputRef}
               type="text"
               className="overlay-search-input"
               placeholder="What are you craving?"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
             />
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close search">
            <X size={36} />
          </button>
        </div>

        {/* Results Section */}
        {query.trim() && (
          <div className="search-overlay-body fade-in">
             {results.length > 0 ? (
               <div className="search-results-grid">
                  
                  {/* Suggestions List */}
                  <div className="search-suggestions">
                    <h3 className="search-section-title">Suggestions</h3>
                    <ul className="suggestions-list">
                       {results.slice(0, 6).map(({ product, matchData }) => (
                         <li key={`sugg-${product.id}`} onClick={() => handleSuggestionClick(product)}>
                            <Search size={16} className="sugg-icon" />
                            <HighlightedText text={product.name} indices={matchData.indices} />
                         </li>
                       ))}
                    </ul>
                  </div>

                  {/* Products Grid */}
                  <div className="search-products-showcase">
                     <h3 className="search-section-title">Products</h3>
                     <div className="compact-product-grid">
                        {results.slice(0, 4).map(({ product }) => (
                           <div key={`prod-${product.id}`} className="search-card-wrapper" onClick={onClose}>
                             <ProductCard product={product} />
                           </div>
                        ))}
                     </div>
                  </div>

               </div>
             ) : (
               <div className="search-no-results">
                 <h3>Oops, we couldn't find anything for "{query}" 😔</h3>
                 <p className="search-hint">Try searching for sweets, namkin, or your favorite dessert.</p>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
