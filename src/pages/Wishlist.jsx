import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page empty-wishlist section">
        <div className="container text-center">
          <div className="empty-wishlist-icon">
            <Heart size={64} color="var(--primary)" />
          </div>
          <h2>Your Wishlist is Empty</h2>
          <p className="text-muted">Save your favorite sweets and treats here to buy them later.</p>
          <Link to="/products" className="btn btn-primary mt-6 inline-flex">
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page section">
      <div className="container">
        <div className="wishlist-header">
          <div>
            <Link to="/products" className="back-link">
              <ArrowLeft size={18} /> Back to Products
            </Link>
            <h1 className="section-title" style={{ marginTop: '1rem', textAlign: 'left' }}>Your <span>Favorites</span></h1>
          </div>
          <button className="btn btn-outline" onClick={clearWishlist}>
            Clear All
          </button>
        </div>

        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-card">
              <Link to={`/product/${item.id}`} className="wishlist-card-img-wrapper">
                <img src={item.image} alt={item.name} className="wishlist-card-img" />
              </Link>
              
              <div className="wishlist-card-content">
                <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 className="wishlist-item-name">{item.name}</h3>
                </Link>
                <div className="wishlist-item-category">{item.category}</div>
                <div className="wishlist-item-price">₹{item.price} <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>/ {item.unit || '1 kg'}</span></div>
                
                <div className="wishlist-card-actions">
                  <button 
                    className="btn btn-primary flex-1"
                    onClick={() => {
                      addToCart(item);
                      removeFromWishlist(item.id);
                    }}
                  >
                    <ShoppingBag size={18} /> Move to Cart
                  </button>
                  <button 
                    className="btn btn-outline icon-only delete-btn"
                    onClick={() => removeFromWishlist(item.id)}
                    aria-label="Remove from Wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
