import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, CreditCard, DollarSign, Check, ShieldCheck, Loader2, Lock } from 'lucide-react';
import { getApiUrl } from '../config';
import './Checkout.css';


const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderStatus, setOrderStatus] = useState('IDLE'); // IDLE, AWAITING_APPROVAL, SUCCESS, REJECTED
  const [placedOrderId, setPlacedOrderId] = useState(null);
  
  // Accordion Step State (1: Login, 2: Address, 3: Summary, 4: Payment)
  const [currentStep, setCurrentStep] = useState(1);

  // Form states - initialized with user data
  const [userDetails, setUserDetails] = useState({ 
    name: user?.name || '', 
    phone: user?.phone || '' 
  });
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
  const [orderRef] = useState(`SSP-${Math.floor(100000 + Math.random() * 900000)}`);
  const [hasDeepLinked, setHasDeepLinked] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState(false);

  const verificationMessages = [
    "Connecting to UPI Secure Gateway...",
    "Awaiting confirmation from your bank...",
    "Verifying transaction authenticity...",
    "Finalizing order details..."
  ];

  // Auto-verify triggered only if they returned from app
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && hasDeepLinked && !isSuccess && !isVerifying) {
        // We wait for them to click "I have paid" or we can auto-start
        // Let's auto-start verification when they return to make it seamless
        startVerification();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [hasDeepLinked, isSuccess, isVerifying]);

  const startVerification = () => {
    if (orderStatus === 'AWAITING_APPROVAL') return;
    completePayment();
  };

  const completePayment = async () => {
    try {
      // 1. Safe extraction logic handling all edge cases
      const extractedUserId = user?.id || user?._id || user?.userId;

      // 2. Strict Frontend Check before API Call
      if (!extractedUserId || extractedUserId === '') {
        console.error("Verification Error: Missing userId. Cannot process payment.");
        setError("User verification failed. Please login again to complete your order.");
        setIsVerifying(false);
        return;
      }

      setError('');
      setIsVerifying(true);
      const orderData = {
        userId: extractedUserId,
        items: cartItems,
        totalAmount: cartTotal,
        address,
        phone: userDetails.phone,
        orderRef
      };

      const response = await fetch(getApiUrl('/api/orders'), {

        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to save order');

      // Async Flow: Clear cart and redirect instantly to Tracking page
      clearCart();
      setIsVerifying(false);
      navigate(`/track-order?query=${orderRef}`);
    } catch (err) {
      setIsVerifying(false);
      setError(err.message === 'Failed to fetch' 
        ? 'Backend server is unreachable. Please ensure it is running.' 
        : (err.message || 'Connection lost. Please try again or contact support.'));
      console.error(err);
    }
  };


  // Redundant polling removed as per new async flow requirements


  // Timer logic for UPI payment
  useEffect(() => {
    let interval = null;
    if (currentStep === 4 && paymentMethod === 'upi' && !isSuccess && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [currentStep, paymentMethod, isSuccess, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateUPILink = () => {
    const pa = "paytmqr5clwt0@ptys";
    const pn = encodeURIComponent("New Shree Shyam Misthan Bhandar");
    const am = cartTotal.toFixed(2);
    const cu = "INR";
    const tr = orderRef; // Transaction Reference
    const tn = encodeURIComponent(`Order ${orderRef}`); // Transaction Note
    return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}&tr=${tr}&tn=${tn}`;
  };

  const handleStepSubmit = (step, e) => {
    e?.preventDefault();
    if (step === 1) {
      if (userDetails.name && userDetails.phone.length === 10) {
        setPhoneError(false);
        setCurrentStep(2);
      } else if (userDetails.phone.length !== 10) {
        setPhoneError(true);
      }
    } else if (step === 2 && address) {
      setCurrentStep(3);
    } else if (step === 3) {
      setCurrentStep(4);
    }
  };

  const placeOrder = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'upi') {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Action A: Mobile Redirect
        setHasDeepLinked(true);
        setIsPaymentInitiated(true);
        window.location.href = generateUPILink();
        return;
      }

      // Action B: Desktop flow - Show that payment is initiated
      setIsPaymentInitiated(true);
      return;
    }

    // Success flow for other methods
    setIsSuccess(true);
    setTimeout(() => {
      clearCart();
    }, 1500);
  };

  if (orderStatus === 'POST_CHECKOUT_POPUP') {
    return (
      <div className="section checkout-waiting" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <div className="waiting-card" style={{ background: 'white', padding: '3rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <CheckCircle size={80} color="#e65100" style={{ margin: '0 auto 1.5rem' }} />
            <h2 style={{ color: '#2d3436', marginBottom: '1rem' }}>Order Received!</h2>
            <p style={{ color: '#636e72', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Your payment is being verified by our team. You can track your status anytime on the Home page.
            </p>
            <div className="order-details-mini mt-4 p-3" style={{ background: '#fff8f0', borderRadius: '12px', border: '1px dashed #e65100', display: 'inline-block', minWidth: '250px' }}>
              <p style={{ margin: '0 0 5px 0' }}><strong>Order Ref:</strong> {orderRef}</p>
              <p style={{ margin: '0' }}><strong>Amount:</strong> ₹{cartTotal}</p>
            </div>
            <p className="mt-4 text-muted">Redirecting to Homepage...</p>
          </div>
        </div>
      </div>
    );
  }

  if (orderStatus === 'REJECTED') {
    return (
      <div className="section checkout-rejected">
        <div className="container text-center">
          <div className="error-icon mb-4" style={{ color: '#ff4d4d' }}>❌</div>
          <h1 style={{ color: '#d63031' }}>Payment Verification Failed</h1>
          <p className="mt-3">Sorry, we couldn't verify your payment. Your order has been cancelled.</p>
          <p className="text-muted">If you believe this is an error, please contact support with Ref: {orderRef}</p>
          <Link to="/" className="btn btn-primary mt-4">Back to Shop</Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="section checkout-success">
        <div className="container" style={{ textAlign: 'center' }}>
          <CheckCircle size={80} color="#27ae60" style={{ margin: '0 auto 2rem' }} />
          <h1>Order Placed Successfully!</h1>
          <p>Your payment has been verified by our admin. Your sweets are being prepared!</p>
          <div className="order-ref-pill mt-3">Ref ID: {orderRef}</div>
          <Link to="/" className="btn btn-primary mt-4" style={{ display: 'inline-flex' }}>Return to Home</Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="section text-center">
        <h2>Your Cart is Empty</h2>
        <p>Please add items to your cart before proceeding to checkout.</p>
        <Link to="/products" className="btn btn-primary mt-4" style={{ display: 'inline-flex' }}>Browse Sweets</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page section bg-light-gray">
      <div className="container">
        <div className="checkout-layout">
          
          {/* Main Accordion Flow (Left side on desktop) */}
          <div className="checkout-accordion">
            
            {/* STEP 1: LOGIN / DETAILS */}
            <div className={`accordion-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="accordion-header">
                <div className="step-title">
                  <span className="step-number">{currentStep > 1 ? <Check size={16} /> : '1'}</span>
                  <h3>USER DETAILS</h3>
                  {currentStep > 1 && <span className="step-summary-text">{userDetails.name} • {userDetails.phone}</span>}
                </div>
                {currentStep > 1 && (
                  <button className="change-btn" onClick={() => setCurrentStep(1)}>CHANGE</button>
                )}
              </div>
              
              {currentStep === 1 && (
                <div className="accordion-body">
                  <form onSubmit={(e) => handleStepSubmit(1, e)}>
                    <div className="form-row">
                      <div className="form-group w-100">
                        <label>Full Name</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          required 
                          value={userDetails.name} 
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                            setUserDetails({...userDetails, name: val});
                          }} 
                          placeholder="Enter your name" 
                        />
                      </div>
                      <div className="form-group w-100">
                        <label>Phone Number</label>
                        <input 
                          type="tel" 
                          className="input-field" 
                          required 
                          maxLength={10}
                          value={userDetails.phone} 
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setUserDetails({...userDetails, phone: val});
                            if (val.length === 10) setPhoneError(false);
                          }} 
                          placeholder="10-digit mobile number" 
                        />
                        {phoneError && <p className="error-text-small mt-1" style={{ color: '#ff4d4d', fontSize: '0.8rem', fontWeight: '500' }}>Please enter a valid 10-digit mobile number.</p>}
                      </div>
                    </div>
                    <p className="login-disclaimer">By continuing, you agree to our Terms of Use and Privacy Policy.</p>

                    <button type="submit" className="btn btn-orange action-btn">CONTINUE</button>
                  </form>
                </div>
              )}
            </div>

            {/* STEP 2: DELIVERY ADDRESS */}
            <div className={`accordion-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="accordion-header">
                <div className="step-title">
                  <span className="step-number">{currentStep > 2 ? <Check size={16} /> : '2'}</span>
                  <h3>DELIVERY ADDRESS</h3>
                  {currentStep > 2 && <span className="step-summary-text truncate">{address}</span>}
                </div>
                {currentStep > 2 && (
                  <button className="change-btn" onClick={() => setCurrentStep(2)}>CHANGE</button>
                )}
              </div>
              
              {currentStep === 2 && (
                <div className="accordion-body bg-light-blue">
                  <form onSubmit={(e) => handleStepSubmit(2, e)}>
                    <div className="form-group">
                      <label>Complete Address</label>
                      <textarea className="input-field" required rows="3" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Flat, House no., Building, Company, Apartment"></textarea>
                    </div>
                    <button type="submit" className="btn btn-orange action-btn">DELIVER HERE</button>
                  </form>
                </div>
              )}
            </div>

            {/* STEP 3: ORDER SUMMARY */}
            <div className={`accordion-item ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
              <div className="accordion-header">
                <div className="step-title">
                  <span className="step-number">{currentStep > 3 ? <Check size={16} /> : '3'}</span>
                  <h3>ORDER SUMMARY</h3>
                  {currentStep > 3 && <span className="step-summary-text">{cartItems.length} Item(s)</span>}
                </div>
                {currentStep > 3 && (
                  <button className="change-btn" onClick={() => setCurrentStep(3)}>CHANGE</button>
                )}
              </div>
              
              {currentStep === 3 && (
                <div className="accordion-body">
                  <div className="cart-items-review">
                    {cartItems.map((item) => (
                      <div key={item.id} className="review-item">
                        <div className="review-item-main">
                          <h4>{item.name}</h4>
                          <p className="text-muted">Quantity: {item.quantity}</p>
                        </div>
                        <div className="review-item-price">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="summary-confirmation-section">
                    <p>Order confirmation email will be sent to your registered contact.</p>
                    <button type="button" onClick={(e) => handleStepSubmit(3, e)} className="btn btn-orange action-btn">CONTINUE</button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 4: PAYMENT OPTIONS */}
            <div className={`accordion-item ${currentStep === 4 ? 'active' : ''}`}>
              <div className="accordion-header">
                <div className="step-title">
                  <span className="step-number">4</span>
                  <h3>PAYMENT OPTIONS</h3>
                </div>
              </div>
              
              {currentStep === 4 && (
                <div className="accordion-body form-body-padding">
                  <form onSubmit={placeOrder}>
                    <div className="payment-options-list">
                      
                      <label className={`payment-method-row ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                        <div className="radio-wrapper">
                          <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                        </div>
                        <div className="method-details">
                          <span className="method-name">UPI (QR / PhonePe / GPay)</span>
                          {paymentMethod === 'upi' && (
                            <div className="upi-expanded-content">
                              {!isVerifying ? (
                                <>
                                  <p className="upi-desc">Scan QR or use one-click pay to open apps like Google Pay / PhonePe.</p>
                                  
                                  <div className="payment-timer-wrapper">
                                    <div className={`timer-display ${timer < 60 ? 'timer-low' : ''}`}>
                                      QR valid for: <span>{formatTime(timer)}</span>
                                    </div>
                                  </div>

                                  <div className="paytm-qr-placard">
                                    <div className="placard-header">
                                      <span className="paytm-logo-text">paytm</span>
                                      <span className="accepted-here">Accepted Here</span>
                                    </div>
                                    <div className="placard-body">
                                      <div className="scan-pay-text">Scan & Pay</div>
                                      <div className="qr-image-wrapper">
                                        <img 
                                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generateUPILink())}`} 
                                          alt="UPI QR Code" 
                                          className="payment-qr" 
                                        />
                                      </div>
                                      <div className="upi-id-display">
                                        UPI ID: <span>paytmqr5clwt0@ptys</span>
                                      </div>
                                      <div className="order-ref-badge mt-2">
                                        Order ID: #{orderRef}
                                      </div>
                                    </div>
                                    <div className="placard-footer">
                                      <div className="bhim-upi-logos">
                                        <span className="bhim-logo">BHIM</span>
                                        <span className="upi-logo">UPI</span>
                                      </div>
                                      <div className="powered-by-paytm">
                                        paytm <span>❤</span> UPI
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="amazon-trust-badges mt-3" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                                    <Lock size={20} color="#00bc8c" />
                                    <div style={{ textAlign: 'left' }}>
                                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#2d3436' }}>100% Purchase Protection</div>
                                      <div style={{ fontSize: '0.75rem', color: '#636e72' }}>Secure Payments by New Shree Shyam Misthan Bhandar</div>
                                    </div>
                                  </div>
                                  
                                  {orderStatus === 'AWAITING_APPROVAL' ? (
                                    <div className="payment-initiated-notice mt-3" style={{ textAlign: 'center', padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                                      <Loader2 size={40} className="spinner" style={{ color: '#e65100', margin: '0 auto 15px auto', display: 'flex' }} />
                                      <h4 style={{ color: '#e65100', margin: '0 0 10px 0' }}>Verifying payment...</h4>
                                      <p style={{ color: '#636e72', fontSize: '0.9rem', marginBottom: 0 }}>Waiting for shop owner to confirm your payment.<br/><strong>Please do not close this window.</strong></p>
                                    </div>
                                  ) : orderStatus === 'REJECTED' ? (
                                    <div className="payment-initiated-notice mt-3" style={{ textAlign: 'center', background: '#ffeaa7', padding: '20px', borderRadius: '8px' }}>
                                      <h4 style={{ color: '#d63031', margin: '0 0 10px 0' }}>Payment Rejected</h4>
                                      <p style={{ color: '#636e72', fontSize: '0.9rem' }}>The shop owner marked your payment as missing.</p>
                                      <button type="button" onClick={() => setOrderStatus('IDLE')} className="btn btn-orange action-btn mt-2">Try Again</button>
                                    </div>
                                  ) : isPaymentInitiated ? (
                                    <div className="payment-initiated-notice mt-3">
                                      {error && (
                                        <div className="error-alert mb-2" style={{ 
                                          color: '#d63031', 
                                          background: '#fff0f0', 
                                          padding: '10px', 
                                          borderRadius: '8px', 
                                          fontSize: '0.85rem', 
                                          border: '1px solid #ff4d4d',
                                          textAlign: 'left'
                                        }}>
                                          ⚠️ <strong>Verification Error:</strong> {error}
                                        </div>
                                      )}
                                      <button 
                                        type="button" 
                                        onClick={startVerification} 
                                        className="btn btn-purple action-btn w-100" 
                                        disabled={isVerifying}
                                      >
                                        {isVerifying ? 'STARTING...' : 'I HAVE COMPLETED PAYMENT'}
                                      </button>
                                      <p className="helper-text mt-2 text-center" style={{ fontSize: '0.8rem' }}>
                                        (Click after you finish payment to verify)
                                      </p>
                                    </div>

                                  ) : (
                                    <button type="submit" className="btn btn-orange action-btn mt-3" disabled={timer === 0}>
                                      {timer === 0 ? "EXPIRED" : `PAY ₹${cartTotal}`}
                                    </button>
                                  )}
                                </>
                              ) : (
                                <div className="frictionless-loader-container">
                                  <div className="verification-card">
                                    <div className="loader-wrapper-large">
                                      <Loader2 className="spin-large" size={48} />
                                    </div>
                                    <h4>{verificationMessages[verificationStep]}</h4>
                                    <p>Please do not close this window or click back.</p>
                                    <div className="verification-steps-progress">
                                      {verificationMessages.map((_, index) => (
                                        <div key={index} className={`progress-dot ${index <= verificationStep ? 'completed' : ''}`}></div>
                                      ))}
                                    </div>
                                    <div className="polling-status mt-3">
                                      <span className="dot"></span>
                                      Status: Secure Verification in Progress
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {timer === 0 && !isVerifying && <p className="timer-expired-msg">QR Code has expired. Please refresh the page.</p>}
                            </div>
                          )}
                        </div>
                      </label>

                      <label className={`payment-method-row ${paymentMethod === 'card' ? 'selected' : ''}`}>
                        <div className="radio-wrapper">
                          <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                        </div>
                        <div className="method-details">
                          <span className="method-name"><CreditCard size={16} /> Credit / Debit / ATM Card</span>
                          {paymentMethod === 'card' && (
                             <div className="card-expanded-content mt-3">
                               <p className="text-muted">This is a mock implementation for demonstration.</p>
                               <button type="submit" className="btn btn-orange action-btn mt-3">PAY ₹{cartTotal}</button>
                             </div>
                          )}
                        </div>
                      </label>

                      <label className={`payment-method-row ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                        <div className="radio-wrapper">
                          <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                        </div>
                        <div className="method-details">
                          <span className="method-name"><DollarSign size={16} /> Cash on Delivery</span>
                          {paymentMethod === 'cod' && (
                             <div className="cod-expanded-content mt-3">
                               <p className="text-muted">Pay securely with cash at your doorstep.</p>
                               <button type="submit" className="btn btn-orange action-btn mt-3">CONFIRM ORDER</button>
                             </div>
                          )}
                        </div>
                      </label>
                      
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="safe-security">
              <ShieldCheck size={20} color="#878787" />
              <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
            </div>

          </div>

          {/* Right Side: Price Details Widget */}
          <div className="checkout-price-widget">
            <div className="price-widget-header">
              <h3>PRICE DETAILS</h3>
            </div>
            <div className="price-widget-body">
              <div className="price-row">
                <span>Price ({cartItems.length} items)</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="price-row">
                <span>Delivery Charges</span>
                <span className="text-green">Free</span>
              </div>
              <div className="price-row total-row">
                <span>Total Amount</span>
                <span>₹{cartTotal}</span>
              </div>
              <p className="savings-text">You will save ₹50 on this order (Mock Offer)</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
