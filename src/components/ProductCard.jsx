import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const isWishlisted = isInWishlist(product.id);
  const cartItem = cartItems.find(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating if wrapped in a link
    addToCart(product, 1, false);
  };
  
  const handleToggleWishlist = (e) => {
    e.preventDefault(); // Prevent navigating
    toggleWishlist(product);
  };
  
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image-wrapper">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`product-image ${product.inStock === false ? 'out-of-stock-img' : ''}`} 
          loading="lazy" 
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = '/logoo.png'; // Fallback to site logo if image fails
          }}
        />
        <div className="product-category-tag">{product.category}</div>
        {product.inStock === false && (
          <div className="out-of-stock-overlay">Out of Stock</div>
        )}
        <button 
          className={`wishlist-toggle-btn ${isWishlisted ? 'active' : ''}`} 
          onClick={handleToggleWishlist}
          aria-label="Toggle Wishlist"
        >
          <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2} />
        </button>
      </div>
      
      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-rating">
            <Star size={16} fill="var(--primary)" color="var(--primary)" />
            <span>{Number(product.rating).toFixed(1)}</span>
          </div>
        </div>
        
        <p className="product-price">₹{product.price} <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>/ {product.unit || '1 kg'}</span></p>
        
        {cartItem ? (
          <div className="cart-item-qty-controls" onClick={(e) => e.preventDefault()}>
            <button 
              className="qty-action-btn"
              onClick={(e) => { e.preventDefault(); updateQuantity(product.id, cartItem.quantity - 1); }}
            >
              <Minus size={16} />
            </button>
            <span className="qty-count-val">{cartItem.quantity}</span>
            <button 
              className="qty-action-btn"
              onClick={(e) => { e.preventDefault(); updateQuantity(product.id, cartItem.quantity + 1); }}
            >
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <button 
            className={`btn btn-primary add-to-cart-btn ${product.inStock === false ? 'disabled' : ''}`} 
            onClick={handleAddToCart}
            disabled={product.inStock === false}
            style={product.inStock === false ? { background: '#ccc', borderColor: '#ccc', cursor: 'not-allowed' } : {}}
          >
            <ShoppingBag size={18} /> {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
