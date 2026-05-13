import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { CheckCircle, CreditCard, DollarSign, Check, ShieldCheck, Loader2, Lock } from 'lucide-react';
import { getApiUrl } from '../config';
import './Checkout.css';


const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const { deliveryCharge, isLoading } = useProducts();
  const [calculatedDeliveryCharge, setCalculatedDeliveryCharge] = useState(0);
  const [locationStatus, setLocationStatus] = useState('idle'); 
  const [customerDistanceKm, setCustomerDistanceKm] = useState(null);
  const finalTotal = cartTotal + calculatedDeliveryCharge;
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderStatus, setOrderStatus] = useState('IDLE'); // IDLE, AWAITING_APPROVAL, SUCCESS, REJECTED
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [placedOrderTotal, setPlacedOrderTotal] = useState(0);
  
  // Date.now() moved to useRef to prevent impure render calls
  const transactionTimeRef = React.useRef(Date.now());
  
  // Accordion Step State (1: Login, 2: Address, 3: Summary, 4: Payment)
  const [currentStep, setCurrentStep] = useState(1);

  // Form states - initialized with user data
  const [userDetails, setUserDetails] = useState({ 
    name: user?.name || '', 
    phone: user?.phone || '' 
  });
  const [address, setAddress] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
  const [orderRef] = useState(`SSP-${Math.floor(100000 + Math.random() * 900000)}`);
  const [hasDeepLinked, setHasDeepLinked] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Scroll to top of the page on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);



  // Autocomplete / Nominatim OpenStreetMap States
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const searchTimeoutRef = React.useRef(null);
  const step4Ref = React.useRef(null);

  // Ensure the payment accordion stays aligned when toggling payment methods
  useEffect(() => {
    if (currentStep === 4 && step4Ref.current) {
      setTimeout(() => {
        step4Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50); // slight delay to allow collapsed layout transition to finish
    }
  }, [paymentMethod, currentStep]);

  const verificationMessages = [
    "Connecting to UPI Secure Gateway...",
    "Awaiting confirmation from your bank...",
    "Verifying transaction authenticity...",
    "Finalizing order details..."
  ];

  const fetchAddressSuggestions = async (query) => {
    let cleanedQuery = query.toLowerCase();
    const fillers = [
      "ka pass", "ke pass", "ke samne", "samne", "k pass",
      "gali no", "ward no", "gali number", "ward number",
      "opposite", "opp", "near"
    ];
    fillers.forEach(filler => {
      cleanedQuery = cleanedQuery.replace(filler, "");
    });
    cleanedQuery = cleanedQuery.replace(/\s+/g, ' ').trim();

    if (!cleanedQuery || cleanedQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearchingAddress(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanedQuery)}&countrycodes=in&limit=5&addressdetails=1`;
      
      const response = await fetch(url, { headers: { 'Accept-Language': 'en' } });
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      }
    } catch (err) {
      console.error('Error fetching address suggestions:', err);
    } finally {
      setIsSearchingAddress(false);
    }
  };

  const handleAddressChange = (val) => {
    setAddress(val);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchAddressSuggestions(val);
    }, 450);
  };

  const handleSelectSuggestion = (item) => {
    setAddress(item.display_name);
    setShowSuggestions(false);
  };

  // Sync fixed deliveryCharge set by Admin in Database
  useEffect(() => {
    setCalculatedDeliveryCharge(deliveryCharge || 0);
  }, [deliveryCharge]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && hasDeepLinked && !isSuccess && !isVerifying) {
        startVerification();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [hasDeepLinked, isSuccess, isVerifying]);

  useEffect(() => {
    if (user && token) {
      fetch(getApiUrl('/api/users/profile'), {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.addresses) setSavedAddresses(data.addresses);
      })
      .catch(err => console.error('Failed to fetch addresses:', err));
    }
  }, [user, token]);

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
        customerName: userDetails.name,
        items: cartItems,
        totalAmount: finalTotal,
        address,
        phone: userDetails.phone,
        orderRef,
        specialInstructions,
        paymentMethod
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

      // Enhanced Flow: Show success screen instead of instant redirect
      setPlacedOrderTotal(finalTotal);
      clearCart();
      setIsVerifying(false);
      setIsSuccess(true);
      // navigate(`/track-order?query=${orderRef}`); // Commented out to show success screen first
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
    const tn = encodeURIComponent(`Order ${orderRef}_${transactionTimeRef.current}`); // Transaction Note with useRef timestamp
    return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}&tr=${tr}&tn=${tn}`;
  };

  const handleStepSubmit = async (step, e) => {
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

  const placeOrder = async (e) => {
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

    // Success flow for COD: Save directly to DB
    await completePayment();
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
      <div className="section checkout-success-screen">
        <div className="container">
          <div className="success-card">
            <div className="success-icon-wrapper">
              <div className="success-checkmark">
                <CheckCircle size={100} color="#27ae60" strokeWidth={1.5} />
              </div>
              <div className="confetti-placeholder"></div>
            </div>
            
            <div className="success-content">
              <h1 className="success-title">Order Placed Successfully!</h1>
              <p className="success-message">
                Thank you for your order. We've received your request and our team is already preparing your delicious sweets!
              </p>
              
              <div className="order-info-card">
                <div className="info-row">
                  <span className="info-label">Order Reference</span>
                  <span className="info-value">#{orderRef}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Amount Paid</span>
                  <span className="info-value">₹{placedOrderTotal}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Payment Method</span>
                  <span className="info-value">{paymentMethod === 'upi' ? 'UPI / QR Payment' : 'Cash on Delivery'}</span>
                </div>
              </div>
              
              <div className="success-actions">
                <Link to={`/track-order?query=${orderRef}`} className="btn btn-primary track-btn">
                  <Package size={20} /> Track My Order
                </Link>
                <Link to="/" className="btn btn-outline continue-btn">
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            <div className="success-footer">
              <p>A confirmation has been sent to your phone <strong>{userDetails.phone}</strong></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !isSuccess) {
    return <Navigate to="/" replace />;
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
                  {savedAddresses.length > 0 && (
                    <div className="saved-addresses mb-4">
                      <label className="font-semibold mb-2 block text-muted">Select a Saved Address:</label>
                      <div className="address-cards-grid" style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
                        {savedAddresses.map((addr, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setAddress(addr)}
                            style={{ 
                              padding: '12px', 
                              border: address === addr ? '2px solid var(--secondary)' : '1px solid var(--border)', 
                              borderRadius: '8px', 
                              cursor: 'pointer',
                              background: address === addr ? 'rgba(230, 81, 0, 0.05)' : 'white'
                            }}
                          >
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>{addr}</p>
                          </div>
                        ))}
                      </div>
                      <div className="text-center text-muted mb-3">OR</div>
                    </div>
                  )}

                  <form onSubmit={(e) => handleStepSubmit(2, e)}>
                    <div className="form-group" style={{ position: 'relative' }}>
                      <label>Enter New Address (or edit selected)</label>
                      <textarea 
                        className="input-field" 
                        required 
                        rows="3" 
                        value={address} 
                        onChange={(e) => handleAddressChange(e.target.value)} 
                        placeholder="Flat, House no., Building, Company, Apartment. Type 'Bank' or 'Sultana' for quick suggestions!"
                        style={{ width: '100%', paddingRight: '40px' }}
                      ></textarea>

                      {isSearchingAddress && (
                        <div style={{ position: 'absolute', right: '12px', bottom: '20px', zIndex: 10, display: 'flex', alignItems: 'center' }}>
                          <Loader2 className="animate-spin" size={18} color="#e65100" />
                        </div>
                      )}

                      {showSuggestions && suggestions.length > 0 && (
                        <div 
                          className="address-suggestions-dropdown"
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                            zIndex: 1000,
                            maxHeight: '200px',
                            overflowY: 'auto',
                            marginTop: '4px'
                          }}
                        >
                          {suggestions.map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleSelectSuggestion(item)}
                              style={{
                                padding: '10px 14px',
                                borderBottom: idx < suggestions.length - 1 ? '1px solid #f1f2f6' : 'none',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                color: '#2d3436',
                                textAlign: 'left',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                transition: 'background 0.2s',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#fff3e0'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                            >
                              <strong style={{ color: '#e65100' }}>
                                📍 {item.address.road || item.address.suburb || item.address.village || item.address.town || item.address.city || 'Location'}
                              </strong>
                              <span style={{ color: '#636e72', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.display_name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '16px' }}></div>

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
                          <h4>{item.name} <span style={{fontSize: '0.85rem', color: '#636e72', fontWeight: 'normal'}}>({item.unit || '1 kg'})</span></h4>
                          <p className="text-muted">Quantity: {item.quantity}</p>
                        </div>
                        <div className="review-item-price">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="special-instructions-section mt-4 pt-4 border-top">
                    <label className="instructions-label font-semibold mb-2 block" style={{ color: 'var(--text-dark)' }}>
                      Any suggestions or special instructions? <span className="text-muted">(Optional)</span>
                    </label>
                    <textarea 
                      className="input-field w-100" 
                      rows="3" 
                      placeholder="e.g., Send more chutney, pack extra sauce, etc." 
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      style={{ resize: 'none', padding: '12px' }}
                    ></textarea>
                  </div>

                  <p className="summary-disclaimer mt-4 text-muted">
                    Order confirmation details will be sent to your registered contact.
                  </p>
                  
                  <button className="btn btn-primary btn-checkout mt-3" onClick={() => handleStepSubmit(3)}>
                    CONTINUE
                  </button>
                </div>
              )}
            </div>

            {/* STEP 4: PAYMENT OPTIONS */}
            <div ref={step4Ref} className={`accordion-item ${currentStep === 4 ? 'active' : ''}`}>
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
                <span style={{fontWeight:'600'}}>
                  {isLoading ? (
                    <span style={{ color: '#95a5a6', fontSize: '0.85rem' }}>Loading...</span>
                  ) : calculatedDeliveryCharge > 0 ? (
                    `₹${calculatedDeliveryCharge}`
                  ) : (
                    'FREE'
                  )}
                </span>
              </div>

              <div className="price-row total-row">
                <span>Total Amount</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Checkout;
