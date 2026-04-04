import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating if wrapped in a link
    addToCart(product);
  };
  
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        <div className="product-category-tag">{product.category}</div>
      </div>
      
      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-rating">
            <Star size={16} fill="var(--primary)" color="var(--primary)" />
            <span>{Number(product.rating).toFixed(1)}</span>
          </div>
        </div>
        
        <p className="product-price">₹{product.price}</p>
        
        <button className="btn btn-primary add-to-cart-btn" onClick={handleAddToCart}>
          <ShoppingBag size={18} /> Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
