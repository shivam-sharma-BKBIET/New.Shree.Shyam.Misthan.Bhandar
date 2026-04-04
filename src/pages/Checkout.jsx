import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, CreditCard, DollarSign, Check, ShieldCheck } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Accordion Step State (1: Login, 2: Address, 3: Summary, 4: Payment)
  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [userDetails, setUserDetails] = useState({ name: '', phone: '' });
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [utrNumber, setUtrNumber] = useState('');

  const generateUPILink = () => {
    const pa = "shivam7777@fam";
    const pn = encodeURIComponent("New Shree Shyam Misthan Bhandar");
    const am = cartTotal.toFixed(2);
    const cu = "INR";
    return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}`;
  };

  const handleStepSubmit = (step, e) => {
    e?.preventDefault();
    if (step === 1 && userDetails.name && userDetails.phone) {
      setCurrentStep(2);
    } else if (step === 2 && address) {
      setCurrentStep(3);
    } else if (step === 3) {
      setCurrentStep(4);
    }
  };

  const placeOrder = (e) => {
    e.preventDefault();
    
    // If it's UPI and UTR is empty, it's a mobile deep-link intent trigger
    if (paymentMethod === 'upi' && !utrNumber) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (!isMobile) {
        alert("Desktop users: Please scan the QR code using your phone's UPI app (GPay/PhonePe/Paytm). Once paid, enter the 12-digit UTR number here.");
        return;
      }

      // Action A: Mobile Redirect
      alert("Opening your UPI app... Pay the amount and return here to enters your 12-digit UTR to confirm.");
      window.location.href = generateUPILink();
      return;
    }

    if (paymentMethod === 'upi') {
      const cleanUTR = utrNumber.trim();
      if (cleanUTR.length < 12) {
        alert("The Payment Reference (UTR) number must be exactly 12 digits. Please check your transaction details.");
        return;
      }
    }

    // Success flow
    setIsSuccess(true);
    setTimeout(() => {
      clearCart();
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="section checkout-success">
        <div className="container" style={{ textAlign: 'center' }}>
          <CheckCircle size={80} color="var(--success)" style={{ margin: '0 auto 2rem' }} />
          <h1>Order Placed Successfully!</h1>
          <p>Your sweetest cravings are on their way. You will receive an SMS confirmation shortly.</p>
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
                        <input type="text" className="input-field" required value={userDetails.name} onChange={(e) => setUserDetails({...userDetails, name: e.target.value})} placeholder="Enter your name" />
                      </div>
                      <div className="form-group w-100">
                        <label>Phone Number</label>
                        <input type="tel" className="input-field" required value={userDetails.phone} onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})} placeholder="10-digit mobile number" />
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
                              <p className="upi-desc">Scan QR or use one-click pay to open apps like Google Pay / PhonePe.</p>
                              
                              <div className="qr-container-mini">
                                <img 
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generateUPILink())}`} 
                                  alt="UPI QR Code" 
                                  className="payment-qr" 
                                />
                                <div className="qr-info-mini">
                                  <strong>UPI ID:</strong> shivam7777@fam
                                </div>
                              </div>
                              
                              <div className="form-group mt-3">
                                <label>Payment Reference (UTR) Number</label>
                                <input type="text" className="input-field" placeholder="12-digit UTR" value={utrNumber} onChange={(e) => setUtrNumber(e.target.value)} />
                                <small className="helper-text d-block mt-1" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                  (Mobile users: Click Pay to open UPI app. Once paid, return here to enter your UTR)
                                </small>
                              </div>
                              
                              <button type="submit" className="btn btn-orange action-btn mt-3">
                                {utrNumber ? `CONFIRM ORDER ₹${cartTotal}` : `PAY ₹${cartTotal}`}
                              </button>
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
