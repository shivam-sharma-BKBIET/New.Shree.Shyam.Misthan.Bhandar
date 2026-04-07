import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, CheckCircle, Package, Truck, ShoppingBag, CreditCard, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { getApiUrl } from '../config';
import './TrackOrder.css';


const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Auto-search if query param exists in URL
  useEffect(() => {
    const urlQuery = searchParams.get('query');
    if (urlQuery) {
      setQuery(urlQuery);
      performSearch(urlQuery);
    }
  }, [searchParams]);

  // Polling mechanism to check for status updates every 5 seconds
  useEffect(() => {
    let interval;
    const isPending = result && (
      result.status === 'PENDING_VERIFICATION' || 
      result.status === 'PENDING_ADMIN_APPROVAL' ||
      !['VERIFIED', 'CANCELLED', 'PAYMENT_VERIFIED', 'PAYMENT_REJECTED'].includes(result.status)
    );

    if (isPending) {
      interval = setInterval(() => {
        performSearch(query, true); // silent refresh (no loading spinner)
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [result, query]);

  const performSearch = async (searchQuery, silent = false) => {
    if (!searchQuery) return;
    if (!silent) {
      setLoading(true);
      setError('');
    }

    try {
      const res = await fetch(getApiUrl(`/api/orders/track/status?query=${encodeURIComponent(searchQuery.trim())}`));

      const data = await res.json();
      
      if (!res.ok) {
        if (!silent) throw new Error(data.message || 'Failed to fetch order status');
        return;
      }
      
      setResult(data);
    } catch (err) {
      if (!silent) setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(query);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <div className="status-badge success-badge" style={{ background: '#d4edda', color: '#155724', padding: '10px 15px', borderRadius: '8px', border: '1px solid #c3e6cb', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', marginBottom: '15px' }}>
            <CheckCircle size={18} /> Order Successfully Delivered!
          </div>
        );
      case 'VERIFIED':
      case 'PAYMENT_VERIFIED':
        return (
          <div className="status-badge success-badge" style={{ background: '#d4edda', color: '#155724', padding: '10px 15px', borderRadius: '8px', border: '1px solid #c3e6cb', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', marginBottom: '15px' }}>
            <CheckCircle size={18} /> Order Confirmed!
          </div>
        );
      case 'CANCELLED':
      case 'PAYMENT_REJECTED':
        return (
          <div className="status-badge danger-badge" style={{ background: '#f8d7da', color: '#721c24', padding: '10px 15px', borderRadius: '8px', border: '1px solid #f5c6cb', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', marginBottom: '15px' }}>
            <AlertCircle size={18} /> Payment Failed / Order Cancelled
          </div>
        );
      default:
        return (
          <div className="status-badge warning-badge" style={{ background: '#fff3cd', color: '#856404', padding: '10px 15px', borderRadius: '8px', border: '1px solid #ffeeba', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', marginBottom: '15px' }}>
            <Clock size={18} className="spinner-slow" /> Payment Verification Pending... Please wait.
          </div>
        );
    }
  };

  return (
    <div className="section" style={{ minHeight: '70vh', backgroundColor: '#fff8f0', padding: '4rem 0' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: '#fff', padding: '3rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <h2 style={{ color: '#e65100', marginBottom: '1rem' }}>Track Your Order</h2>
          <p style={{ color: '#636e72', marginBottom: '2rem' }}>
            Enter your 10-digit Mobile Number or Order ID to check your order and delivery status.
          </p>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Mobile No. or Order ID" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ 
                  width: '100%', padding: '12px 15px 12px 40px', borderRadius: '8px', 
                  border: '1px solid #ccc', fontSize: '1rem', outline: 'none' 
                }}
                required
              />
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#999' }} />
            </div>
            <button type="submit" className="btn btn-orange action-btn" disabled={loading} style={{ padding: '12px 24px', borderRadius: '8px' }}>
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {error && (
            <div style={{ color: '#d63031', background: '#ffeaa7', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          {result && (
            <div className="track-result-card" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e0e0e0', marginTop: '2rem', textAlign: 'left' }}>
              
              {/* Dynamic Status Badge */}
              {getStatusBadge(result.status)}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f2f6', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#2d3436' }}>Order #{result.orderRef}</h3>
                  <p style={{ margin: '5px 0 0 0', color: '#636e72', fontSize: '0.9rem' }}>Official Status: <strong style={{ color: '#e65100' }}>{result.status.replace(/_/g, ' ')}</strong></p>
                </div>
              </div>
              
              {/* Amazon Style Timeline */}
              <div className="amazon-timeline">
                
                {/* Step 1: Order Placed */}
                <div className={`timeline-node completed`}>
                  <div className="node-icon"><ShoppingBag size={18} /></div>
                  <div className="node-content">
                    <h4>Order Placed</h4>
                    <p>We've received your order</p>
                  </div>
                </div>

                <div className={`timeline-connector completed`}></div>

                {/* Step 2: Payment Verified */}
                <div className={`timeline-node ${(result.status === 'VERIFIED' || result.status === 'PAYMENT_VERIFIED') ? 'completed' : (['PENDING_VERIFICATION', 'PENDING_ADMIN_APPROVAL'].includes(result.status) ? 'active' : '')}`}>
                  <div className="node-icon"><CreditCard size={18} /></div>
                  <div className="node-content">
                    <h4>Payment Verification</h4>
                    <p>{(result.status === 'VERIFIED' || result.status === 'PAYMENT_VERIFIED') ? 'Payment successfully secured' : 'Admin is manually verifying your payment via UTR'}</p>
                  </div>
                </div>

                <div className={`timeline-connector ${(result.status === 'VERIFIED' || result.status === 'PAYMENT_VERIFIED') ? 'completed' : ''}`}></div>

                {/* Step 3: Scheduled / Dispatched */}
                <div className={`timeline-node ${result.deliveryDate || result.status === 'DELIVERED' ? 'completed' : ''}`}>
                  <div className="node-icon"><Package size={18} /></div>
                  <div className="node-content">
                    <h4>Order Scheduled</h4>
                    {result.deliveryDate ? (
                       <p style={{ fontWeight: '500', color: '#27ae60' }}>Scheduled: {result.deliveryDate} at {result.deliveryTime}</p>
                    ) : (
                       <p>{result.status === 'DELIVERED' ? 'Dispatched successfully' : 'Awaiting admin scheduling'}</p>
                    )}
                  </div>
                </div>

                <div className={`timeline-connector ${result.status === 'DELIVERED' ? 'completed' : ''}`}></div>

                {/* Step 4: Delivered */}
                <div className={`timeline-node ${result.status === 'DELIVERED' ? 'completed' : ''}`}>
                  <div className="node-icon"><CheckCircle size={18} /></div>
                  <div className="node-content">
                    <h4>Delivered</h4>
                    <p>{result.status === 'DELIVERED' ? 'Package delivered to the customer' : 'Pending'}</p>
                  </div>
                </div>

              </div>

              {(result.status === 'CANCELLED' || result.status === 'PAYMENT_REJECTED') && (
                <div style={{ marginTop: '2rem', padding: '1rem', background: '#fdeded', color: '#d63031', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #f5c6cb' }}>
                  Your payment was rejected or unverified. Please contact support.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;

