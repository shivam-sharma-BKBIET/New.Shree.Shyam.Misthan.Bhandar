import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Star, Plus, Minus, CheckCircle, User, Calendar } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { getProductById, addReview } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  
  // Review Form State
  const [reviewForm, setReviewForm] = useState({
    username: '',
    rating: 5,
    comment: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const found = getProductById(id);
    if (found) {
      setProduct(found);
    } else {
      navigate('/products');
    }
    window.scrollTo(0, 0);
  }, [id, navigate, getProductById]);

  if (!product) return <div className="loading">Loading...</div>;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.username || !reviewForm.comment) return;
    
    addReview(product.id, reviewForm);
    setReviewForm({ username: '', rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  return (
    <div className="product-details-page section">
      <div className="container">
        
        <Link to="/products" className="back-link">
          <ArrowLeft size={20} /> Back to Products
        </Link>
        
        <div className="product-details-grid">
          {/* Image Gallery section */}
          <div className="product-image-section">
            <div className="main-image-wrapper">
              <img src={product.image} alt={product.name} className="main-image" />
            </div>
          </div>
          
          {/* Info section */}
          <div className="product-info-section">
            <div className="product-badge">{product.category}</div>
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating-box">
              <Star fill="#ffca28" color="#ffca28" size={20} />
              <span className="rating-value">{product.rating}</span>
              <span className="rating-count">({product.reviews?.length || 0} Reviews)</span>
            </div>
            
            <p className="product-price-large">₹{product.price}</p>
            
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
              
              <button 
                className={`btn ${isAdded ? 'btn-success' : 'btn-primary'} btn-large w-100`}
                onClick={handleAddToCart}
              >
                {isAdded ? (
                  <><CheckCircle size={22} /> Added to Cart</>
                ) : (
                  <><ShoppingBag size={22} /> Add to Cart - ₹{product.price * quantity}</>
                )}
              </button>
            </div>
            
            <div className="delivery-info">
              <div className="info-block">
                <strong>Delivery Time:</strong> 45-60 Minutes
              </div>
              <div className="info-block">
                <strong>Availability:</strong> In Stock ✨
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section mt-12">
          <div className="reviews-header">
            <h2>Customer Reviews ({product.reviews?.length || 0})</h2>
            <button 
              className="btn btn-outline" 
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>

          {showReviewForm && (
            <div className="review-form-container">
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
                  <label>Rating</label>
                  <select 
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
                  >
                    {[5,4,3,2,1].map(num => (
                      <option key={num} value={num}>{num} Stars</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Your Experience</label>
                  <textarea 
                    rows="3"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    required
                    placeholder="What did you think of this delight?"
                  />
                </div>
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </form>
            </div>
          )}

          <div className="reviews-list mt-8">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.slice().reverse().map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-user">
                    <div className="user-icon"><User size={20} /></div>
                    <div>
                      <h4 className="user-name">{review.username}</h4>
                      <div className="review-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            fill={i < review.rating ? "#ffca28" : "none"} 
                            color="#ffca28" 
                          />
                        ))}
                      </div>
                    </div>
                    <span className="review-date">
                      <Calendar size={14} /> {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="no-reviews">Be the first to review this product!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
