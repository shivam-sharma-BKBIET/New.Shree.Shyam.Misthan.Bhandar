import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Star, Plus, Minus, CheckCircle, Calendar, PenLine, X, User, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user, token } = useAuth();
  const { getProductById, addReview, deleteReview } = useProducts();
  
  // Replace useState + useEffect with useMemo to derive product directly
  const product = useMemo(() => getProductById(id), [id, getProductById]);
  
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  
  const isWishlisted = product ? isInWishlist(product.id) : false;
  
  // Review Form State - pre-fill name from logged-in user
  const [reviewForm, setReviewForm] = useState({
    username: user?.name || '',
    rating: 5,
    comment: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);

  // Pre-fill username when user auth loads
  useEffect(() => {
    if (user?.name && !reviewForm.username) {
      setReviewForm(prev => ({ ...prev, username: user.name }));
    }
  }, [user]);

  // Handle fallback navigation and scroll to top
  useEffect(() => {
    if (!product) {
      navigate('/products');
    } else {
      window.scrollTo(0, 0);
    }
  }, [product, navigate]);

  if (!product) return <div className="loading">Loading...</div>;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.username || !reviewForm.comment) return;
    
    const reviewData = {
      ...reviewForm,
      userId: user?.id || user?._id || null
    };
    await addReview(product.id, reviewData);
    setReviewForm({ username: user?.name || '', rating: 5, comment: '' });
    setShowReviewForm(false);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await deleteReview(product.id, reviewId, token);
    } catch (err) {
      alert(err.message || 'Could not delete review.');
    }
  };

  return (
    <div className="product-details-page section">
      <div className="container">
        
        <Link to="/products" className="back-link">
          <ArrowLeft size={20} /> Back to Products
        </Link>
        
        <div className="product-details-grid">
          {/* Image section */}
          <div className="product-image-section">
            <div className="main-image-wrapper">
              <img 
                src={product.image} 
                alt={product.name} 
                className="main-image" 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = '/logoo.png';
                }}
              />
            </div>
          </div>
          
          {/* Info section */}
          <div className="product-info-section">
            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
              <div className="product-badge">{product.category}</div>
              {product.inStock === false && (
                <div style={{background: '#ff7675', color: 'white', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'}}>
                  Out of Stock
                </div>
              )}
            </div>
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating-box">
              <Star fill="#ffca28" color="#ffca28" size={20} />
              <span className="rating-value">{product.rating}</span>
              <span className="rating-count">({product.reviews?.length || 0} Reviews)</span>
            </div>
            
            <p className="product-price-large">
              ₹{product.price} <span style={{fontSize: '1.2rem', color: 'var(--text-muted)'}}>/ {product.unit || '1 kg'}</span>
            </p>
            
            <div className="product-description">
              <h3>About this delight</h3>
              <p>{product.description}</p>
            </div>
            
            <div className="purchase-actions">
              <div className="quantity-selector">
                <span className="qty-label">Quantity:</span>
                <div className="qty-controls-large">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(prev => prev + 1)}>
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className={`btn ${isAdded ? 'btn-success' : 'btn-primary'} btn-large ${product.inStock === false ? 'disabled' : ''}`}
                  style={{ flex: 1, ...(product.inStock === false ? { background: '#ccc', borderColor: '#ccc', cursor: 'not-allowed' } : {}) }}
                  onClick={handleAddToCart}
                  disabled={product.inStock === false}
                >
                  {product.inStock === false ? (
                    <><X size={22} /> Out of Stock</>
                  ) : isAdded ? (
                    <><CheckCircle size={22} /> Added to Cart</>
                  ) : (
                    <><ShoppingBag size={22} /> Add to Cart - ₹{product.price * quantity}</>
                  )}
                </button>
                
                <button 
                  className={`btn btn-outline wishlist-detail-btn ${isWishlisted ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product)}
                  aria-label="Toggle Wishlist"
                  title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  style={{ width: 'auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Heart size={24} fill={isWishlisted ? "var(--primary)" : "none"} color={isWishlisted ? "var(--primary)" : "currentColor"} />
                </button>
              </div>
            </div>
            
            <div className="delivery-info">
              <div className="info-block">
                <strong>Delivery Time:</strong> 45-60 Minutes
              </div>
              <div className="info-block">
                <strong>Availability:</strong> {product.inStock === false ? <span style={{color: '#e74c3c'}}>Out of Stock ❌</span> : <span>In Stock ✨</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section mt-12">
          <div className="reviews-header">
            <h2>Customer Reviews ({product.reviews?.length || 0})</h2>
            <button 
              className={`btn-write-review ${showReviewForm ? 'cancel' : ''}`}
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm 
                ? <><X size={16}/> Cancel</> 
                : <><PenLine size={16}/> Write a Review</>
              }
            </button>
          </div>

          {reviewSubmitted && (
            <div className="review-success">
              <CheckCircle size={20} />
              Thank you! Your review has been submitted successfully.
            </div>
          )}

          {showReviewForm && (
            <div className="review-form-container">
              <h3 className="review-form-title">Share Your Experience 🍬</h3>
              <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="form-group">
                  <label>Your Name</label>
                  <input 
                    type="text" 
                    value={reviewForm.username}
                    onChange={(e) => setReviewForm({...reviewForm, username: e.target.value})}
                    required
                    placeholder="Enter your name"
                  />
                </div>
                <div className="form-group">
                  <label>Your Rating</label>
                  <div className="star-rating-selector">
                    {[1,2,3,4,5].map(num => (
                      <button
                        key={num}
                        type="button"
                        className="star-btn"
                        onMouseEnter={() => setHoverStar(num)}
                        onMouseLeave={() => setHoverStar(0)}
                        onClick={() => setReviewForm({...reviewForm, rating: num})}
                      >
                        <Star
                          size={32}
                          fill={(hoverStar || reviewForm.rating) >= num ? "#ffca28" : "none"}
                          color={(hoverStar || reviewForm.rating) >= num ? "#ffca28" : "#ccc"}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                    <span style={{marginLeft:'10px', color:'var(--text-muted)', fontSize:'0.9rem', alignSelf:'center'}}>
                      {['','Poor','Fair','Good','Very Good','Excellent!'][hoverStar || reviewForm.rating]}
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Your Experience</label>
                  <textarea 
                    rows="4"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    required
                    placeholder="What did you think of this delight? 😋"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={18}/> Submit Review
                </button>
              </form>
            </div>
          )}

          <div className="reviews-list mt-8">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.slice().reverse().map(review => {
                const isOwner = user && (user.id === review.userId || user._id === review.userId);
                return (
                <div key={review.id} className="review-card">
                  <div className="review-user">
                    <div className="user-icon">
                      {review.username
                        ? review.username.charAt(0).toUpperCase()
                        : <User size={20} />}
                    </div>
                    <div className="user-info">
                      <h4 className="user-name">{review.username || 'Anonymous'}</h4>
                      <div className="review-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={15} 
                            fill={i < review.rating ? "#ffca28" : "none"} 
                            color={i < review.rating ? "#ffca28" : "#ddd"} 
                            strokeWidth={1.5}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="review-date">
                      <Calendar size={13} /> {new Date(review.date).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}
                    </span>
                    {isOwner && (
                      <button
                        className="review-delete-btn"
                        onClick={() => handleDeleteReview(review.id)}
                        title="Delete your review"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                  <p className="review-comment">"{review.comment}"</p>
                </div>
                );
              })
            ) : (
              <div className="no-reviews">
                <div className="no-reviews-icon">⭐</div>
                <h4>No Reviews Yet</h4>
                <p>Be the first to share your experience with this delight!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
