import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ShoppingBag, CreditCard, Clock, AlertCircle, Lock, RefreshCw, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { getApiUrl } from '../config';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './TrackOrder.css';

const getStatusConfig = (status, paymentMethod) => {
  const isCOD = paymentMethod?.toLowerCase() === 'cod';
  const configs = {
    DELIVERED: { label: 'Delivered ✅', color: '#155724', bg: '#d4edda', border: '#c3e6cb' },
    VERIFIED: { label: isCOD ? 'Order Confirmed ✅' : 'Order Confirmed ✅', color: '#155724', bg: '#d4edda', border: '#c3e6cb' },
    PAYMENT_VERIFIED: { label: isCOD ? 'Order Confirmed ✅' : 'Payment Verified ✅', color: '#155724', bg: '#d4edda', border: '#c3e6cb' },
    CANCELLED: { label: 'Cancelled ❌', color: '#721c24', bg: '#f8d7da', border: '#f5c6cb' },
    PAYMENT_REJECTED: { label: isCOD ? 'Order Rejected ❌' : 'Payment Rejected ❌', color: '#721c24', bg: '#f8d7da', border: '#f5c6cb' },
    PENDING_VERIFICATION: { label: isCOD ? '⏳ Awaiting Order Verification' : '⏳ Awaiting Payment Verification', color: '#856404', bg: '#fff3cd', border: '#ffeeba' },
    PENDING_ADMIN_APPROVAL: { label: isCOD ? '⏳ Awaiting Admin Approval' : '⏳ Awaiting Admin Approval', color: '#856404', bg: '#fff3cd', border: '#ffeeba' },
  };
  return configs[status] || configs['PENDING_VERIFICATION'];
};

const OrderCard = ({ order, onRefresh }) => {
  const [expanded, setExpanded] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { token } = useAuth();
  const { addToCart } = useCart();

  const handleReorder = () => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      }, item.quantity, true);
    });
  };

  const cfg = getStatusConfig(order.transactionStatus, order.paymentMethod);

  // Removed unused isCompleted function

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      const res = await fetch(getApiUrl(`/api/orders/${order._id}/cancel`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to cancel order');
      onRefresh(false); // Trigger background refresh without full-page loader
    } catch (err) {
      alert(err.message);
    } finally {
      setIsCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  return (
    <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', marginBottom: '1rem', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ padding: '1rem 1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: expanded ? '1px solid var(--border)' : 'none' }}
      >
        <div>
          {/* Show item names instead of order ref */}
          <h4 style={{ margin: 0, color: 'var(--text-primary)', fontWeight: '700', fontSize: '1rem' }}>
            {order.items?.[0]?.name || 'Order'}
            {order.items?.length > 1 && (
              <span style={{ color: '#e65100', fontWeight: '500', fontSize: '0.85rem', marginLeft: '6px' }}>
                +{order.items.length - 1} more
              </span>
            )}
          </h4>
          <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            #{order.orderRef} • {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • <strong style={{ color: 'var(--text-primary)' }}>Rs. {order.totalAmount}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600', background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
            {cfg.label}
          </span>
          {expanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div style={{ padding: '1.5rem' }}>
          {/* Timeline */}
          <div className="amazon-timeline" style={{ marginBottom: '1.5rem' }}>
            <div className="timeline-node completed">
              <div className="node-icon"><ShoppingBag size={16} /></div>
              <div className="node-content"><h4 style={{ color: 'var(--text-primary)' }}>Order Placed</h4><p style={{ color: 'var(--text-muted)' }}>We received your order</p></div>
            </div>
            <div className="timeline-connector completed"></div>
            <div className={`timeline-node ${['VERIFIED', 'PAYMENT_VERIFIED', 'DELIVERED'].includes(order.transactionStatus) ? 'completed' : 'active'}`}>
              <div className="node-icon"><CreditCard size={16} /></div>
              <div className="node-content">
                <h4 style={{ color: 'var(--text-primary)' }}>{order.paymentMethod?.toLowerCase() === 'cod' ? 'Order Verification' : 'Payment Verification'}</h4>
                <p style={{ color: 'var(--text-muted)' }}>
                  {['VERIFIED', 'PAYMENT_VERIFIED', 'DELIVERED'].includes(order.transactionStatus) 
                    ? (order.paymentMethod?.toLowerCase() === 'cod' ? 'Order confirmed' : 'Payment confirmed') 
                    : (order.paymentMethod?.toLowerCase() === 'cod' ? 'Admin is verifying your order' : 'Admin is verifying your payment')}
                </p>
              </div>
            </div>
            <div className={`timeline-connector ${['VERIFIED', 'PAYMENT_VERIFIED', 'DELIVERED'].includes(order.transactionStatus) ? 'completed' : ''}`}></div>
            <div className={`timeline-node ${order.deliveryDate || order.transactionStatus === 'DELIVERED' ? 'completed' : ''}`}>
              <div className="node-icon"><Package size={16} /></div>
              <div className="node-content">
                <h4 style={{ color: 'var(--text-primary)' }}>Order Scheduled</h4>
                {order.deliveryDate
                  ? <p style={{ color: '#27ae60', fontWeight: '500' }}>📅 {order.deliveryDate} at {order.deliveryTime}</p>
                  : <p style={{ color: 'var(--text-muted)' }}>Awaiting scheduling</p>}
              </div>
            </div>
            <div className={`timeline-connector ${order.transactionStatus === 'DELIVERED' ? 'completed' : ''}`}></div>
            <div className={`timeline-node ${order.transactionStatus === 'DELIVERED' ? 'completed' : ''}`}>
              <div className="node-icon"><CheckCircle size={16} /></div>
              <div className="node-content"><h4 style={{ color: 'var(--text-primary)' }}>Delivered</h4><p style={{ color: 'var(--text-muted)' }}>{order.transactionStatus === 'DELIVERED' ? 'Delivered successfully 🎉' : 'Pending'}</p></div>
            </div>
          </div>

          {/* Items */}
          <div style={{ background: 'var(--background)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
            <p style={{ margin: '0 0 8px', fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>Items Ordered:</p>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)', padding: '3px 0' }}>
                <span>{item.name} × {item.quantity}</span>
                <span>Rs. {item.price * item.quantity}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px dashed var(--border)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: 'var(--text-primary)' }}>
              <span>Total</span><span>Rs. {order.totalAmount}</span>
            </div>
          </div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div style={{ background: 'var(--background)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
              📝 <strong>Special Instructions:</strong> {order.specialInstructions}
            </div>
          )}

          {/* Actions Section (Reorder & Cancel) */}
          <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <button
                onClick={handleReorder}
                style={{ background: 'var(--primary)', color: '#000', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(240, 193, 75, 0.3)', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.target.style.transform = 'scale(1.02)'; }}
                onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
              >
                <RotateCcw size={16} /> Reorder Items
              </button>

              {((['PENDING_VERIFICATION', 'PENDING_ADMIN_APPROVAL'].includes(order.transactionStatus)) || 
                (order.paymentMethod?.toLowerCase() !== 'cod' && ['VERIFIED', 'PAYMENT_VERIFIED'].includes(order.transactionStatus))) && !showCancelConfirm && (
                <button 
                  onClick={() => setShowCancelConfirm(true)}
                  style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.target.style.background = '#fee2e2'; }}
                  onMouseLeave={(e) => { e.target.style.background = '#fef2f2'; }}
                >
                  Cancel Order
                </button>
              )}
            </div>

            {showCancelConfirm && (
              <div style={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', width: '100%', marginTop: '5px' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                  ⚠️ Are you sure you want to cancel this order? This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => setShowCancelConfirm(false)}
                    style={{ background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}
                    disabled={isCancelling}
                  >
                    No, Keep It
                  </button>
                  <button 
                    onClick={handleCancelOrder}
                    style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    disabled={isCancelling}
                  >
                    {isCancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

const TrackOrder = () => {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Scroll to top of the page on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 10);
    return () => clearTimeout(timeoutId);
  }, []);

  const fetchMyOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError('');
    try {
      const res = await fetch(getApiUrl('/api/orders/my-orders'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      const newOrders = data.data || [];
      setOrders(newOrders);
      
      // Update cache
      localStorage.setItem(`orders_cache_${user?.id || user?._id}`, JSON.stringify(newOrders));
    } catch (err) {
      setError(err.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      // 1. Try to load from cache first for instant UI
      const cachedOrders = localStorage.getItem(`orders_cache_${user?.id || user?._id}`);
      if (cachedOrders) {
        try {
          setOrders(JSON.parse(cachedOrders));
          // Fetch fresh data in background without showing full-page loader
          fetchMyOrders(false);
        } catch (e) {
          fetchMyOrders(true);
        }
      } else {
        // No cache, show full loader
        fetchMyOrders(true);
      }
    }
  }, [isAuthenticated, token]);

  // Not logged in
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="section" style={{ minHeight: '70vh', backgroundColor: 'var(--background)', padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ background: 'var(--surface)', padding: '3rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid var(--border)' }}>
            <Lock size={60} color="var(--secondary)" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ color: 'var(--secondary)' }}>Login Required</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Apne orders track karne ke liye pehle login karein.
            </p>
            <Link to="/login?redirect=/track-order" className="btn btn-primary" style={{ display: 'inline-block', padding: '12px 30px' }}>
              Login Karein
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ minHeight: '70vh', backgroundColor: 'var(--background)', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ margin: 0, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              My Orders
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#27ae60', fontWeight: '500', background: 'var(--surface)', padding: '3px 10px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                <span style={{ width: '7px', height: '7px', background: '#27ae60', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
                Live
              </span>
            </h2>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome, {user?.name}! Here are all your orders.</p>
          </div>
          <button
            onClick={fetchMyOrders}
            disabled={loading}
            style={{ background: 'none', border: '1px solid var(--secondary)', color: 'var(--secondary)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#ffeaa7', color: '#d63031', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Clock size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Loading your orders...</p>
          </div>
        )}

        {/* Orders List */}
        {!loading && orders.length === 0 && (
          <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '3rem', textAlign: 'center', boxShadow: '0 2px 15px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
            <ShoppingBag size={60} color="var(--secondary)" style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <h3 style={{ color: 'var(--text-muted)' }}>No orders yet</h3>
            <p style={{ color: 'var(--text-muted)' }}>Aapne abhi tak koi order nahi kiya hai.</p>
            <Link to="/products" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem', padding: '10px 24px' }}>
              Menu Dekhein
            </Link>
          </div>
        )}

        {!loading && orders.map(order => (
          <OrderCard key={order._id} order={order} onRefresh={fetchMyOrders} />
        ))}

      </div>
    </div>
  );
};

export default TrackOrder;
