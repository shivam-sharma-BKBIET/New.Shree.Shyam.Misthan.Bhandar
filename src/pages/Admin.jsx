import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { 
  Pencil, Trash, Plus, Search, X, Check, Save, Star,
  Package, Info, Settings, Image as ImageIcon, User, Lock, ExternalLink, Layout, MapPin, Tag, Users, ShoppingCart
} from 'lucide-react';
import { getApiUrl } from '../config';
import './Admin.css';

const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || 'NewShyamSecretKey2026';

const Admin = () => {
  const { 
    products, addProduct, updateProduct, deleteProduct, categories,
    aboutData, updateAbout, adminAuth, updateAuth, heroData, updateHero,
    footerData, updateFooter, addCategory, updateCategory, deleteCategory,
    deleteReview, deliveryCharge, updateDeliveryCharge, deliverySettings, updateDeliverySettings
  } = useProducts();
  
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('admin_alerts_enabled');
    return saved === 'true' && Notification.permission === 'granted';
  });
  const [deliverySchedule, setDeliverySchedule] = useState({});

  const handleScheduleChange = (orderId, field, value) => {
    setDeliverySchedule(prev => ({ ...prev, [orderId]: { ...prev[orderId], [field]: value } }));
  };

  const updateSchedule = async (orderId) => {
    const data = deliverySchedule[orderId];
    if (!data || !data.deliveryDate || !data.deliveryTime) {
      alert('Please fill both Date and Time');
      return;
    }
    try {
      const response = await fetch(getApiUrl(`/api/admin/orders/${orderId}/schedule`), {

        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_KEY
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        showSuccess();
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Notifications Permission
  const enableNotifications = () => {
    if (notificationsEnabled) {
      // Toggle OFF
      setNotificationsEnabled(false);
      localStorage.setItem('admin_alerts_enabled', 'false');
      return;
    }

    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('admin_alerts_enabled', 'true');
        new Notification("Alerts ON!", { body: "Notifications are now active." });
      } else {
        alert("Please allow notification permission in your browser settings to turn this ON.");
      }
    });
  };

  // Sound Alert Helper
  const playAlertSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  // Fetch Data on mount
  React.useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  // Polling for New Orders
  React.useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchOrdersSilently();
    }, 10000); // Poll every 10 seconds
    return () => clearInterval(pollInterval);
  }, [lastOrderId]); // Dependency on lastOrderId to handle logic

  const fetchOrders = async () => {
    setIsLoadingData(true);
    await fetchOrdersSilently();
    setIsLoadingData(false);
  };

  const fetchOrdersSilently = async () => {
    try {
      const resp = await fetch(getApiUrl('/api/admin/orders'), { headers: { 'x-admin-key': ADMIN_KEY } });

      const responseData = await resp.json();
      const ordersArray = responseData.data || [];
      
      // Check for New Orders
      if (ordersArray.length > 0) {
        const latestOrder = ordersArray[0]; // Orders are sorted by -1 createdAt
        if (lastOrderId && latestOrder._id !== lastOrderId && latestOrder.transactionStatus === 'PENDING_VERIFICATION') {
          playAlertSound();
          if (Notification.permission === 'granted') {
            new Notification("NEW ORDER ALERT!", {
              body: `Order #${latestOrder.orderRef} for ₹${latestOrder.totalAmount} is awaiting your approval.`,
              icon: '/favicon.svg'
            });
          }
        }
        setLastOrderId(latestOrder._id);
      }
      
      setAllOrders(ordersArray);
    } catch (err) {
      console.error('Failed to fetch ordersSilently', err);
    }
  };

  const fetchCustomers = async () => {
    setIsLoadingData(true);
    try {
      const resp = await fetch(getApiUrl('/api/admin/customers'), { headers: { 'x-admin-key': ADMIN_KEY } });
      if (resp.ok) {
        const result = await resp.json();
        setAllCustomers(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch customers', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const deleteOrder = async (id) => {
    if(!window.confirm('Delete this order?')) return;
    try {
      await fetch(getApiUrl(`/api/admin/orders/${id}`), { 
                method: 'DELETE',
                headers: { 'x-admin-key': ADMIN_KEY }
              });

      fetchOrders();
    } catch (err) {
      console.error('Failed to delete order', err);
    }
  };

  const deleteCustomer = async (id) => {
    if(!window.confirm('Are you sure you want to PERMANENTLY delete this customer? This will remove their account forever.')) return;
    try {
      const response = await fetch(getApiUrl(`/api/admin/customers/${id}`), { 
                method: 'DELETE',
                headers: { 'x-admin-key': ADMIN_KEY }
              });
      
      if (response.ok) {
        showSuccess();
        fetchCustomers();
      }
    } catch (err) {
      console.error('Failed to delete customer', err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(getApiUrl(`/api/admin/orders/${id}/status`), {

        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_KEY 
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchOrders();
        showSuccess();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };


  // Product Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    unit: '1 kg',
    inStock: true,
    category: 'sweets',
    description: '',
    image: 'https://images.unsplash.com/photo-1599598425947-330026e3c150?auto=format&fit=crop&q=80&w=800'
  });

  // About Form State
  const [aboutForm, setAboutForm] = useState({ ...aboutData });
  
  // Hero Form State
  const [heroForm, setHeroForm] = useState({ ...heroData });
  
  // Footer Form State
  const [footerForm, setFooterForm] = useState({ ...footerData });
  
  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  
  // Auth Form State
  const [authForm, setAuthForm] = useState({ ...adminAuth });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deliveryChargeInput, setDeliveryChargeInput] = useState(deliveryCharge);
  const [deliveryForm, setDeliveryForm] = useState({ ...deliverySettings });

  // Sync inputs when values load from DB
  useEffect(() => {
    setDeliveryChargeInput(deliveryCharge);
  }, [deliveryCharge]);

  useEffect(() => {
    setDeliveryForm({ ...deliverySettings });
  }, [deliverySettings.perKmCharge, deliverySettings.shopLat]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Analytics Calculations
  const totalRevenue = allOrders
    .filter(o => ['PAYMENT_VERIFIED', 'VERIFIED', 'DELIVERED'].includes(o.transactionStatus))
    .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  
  const pendingOrdersCount = allOrders.filter(o => o.transactionStatus === 'PENDING_VERIFICATION').length;
  const totalOrdersCount = allOrders.length;
  const totalCustomersCount = allCustomers.length;

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        unit: product.unit || '1 kg',
        inStock: product.inStock !== false,
        category: product.category,
        description: product.description,
        image: product.image
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        unit: '1 kg',
        inStock: true,
        category: 'sweets',
        description: '',
        image: 'https://images.unsplash.com/photo-1599598425947-330026e3c150?auto=format&fit=crop&q=80&w=800'
      });
    }
    setIsModalOpen(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const productData = { ...formData, price: parseFloat(formData.price) };
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...productData });
    } else {
      addProduct(productData);
    }
    setIsModalOpen(false);
  };

  const handleAboutSubmit = (e) => {
    e.preventDefault();
    updateAbout(aboutForm);
    showSuccess();
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (updateAuth) {
      updateAuth(authForm);
    } else {
      console.warn("Auth update not supported directly via API yet. Using session default.");
    }
    showSuccess();
  };

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    updateHero(heroForm);
    showSuccess();
  };

  const handleFooterSubmit = (e) => {
    e.preventDefault();
    updateFooter(footerForm);
    showSuccess();
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if(newCategoryName.trim() === '') return;
    addCategory(newCategoryName.trim());
    setNewCategoryName('');
    showSuccess();
  };

  const startEditCat = (cat) => {
    setEditingCatId(cat.id);
    setEditCatName(cat.name);
  };
  
  const saveEditCat = () => {
    if (editCatName.trim() === '') return;
    updateCategory(editingCatId, editCatName.trim());
    setEditingCatId(null);
    setEditCatName('');
    showSuccess();
  };

  const showSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="admin-page section bg-light">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Store <span>Manager</span></h1>
            <p className="admin-subtitle">Manage your inventory, content, and security settings.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn" 
              onClick={enableNotifications} 
              style={{ 
                backgroundColor: notificationsEnabled ? '#e65100' : '#d63031', 
                color: '#fff',
                borderColor: 'transparent',
                fontWeight: 'bold'
              }}
            >
              🔔 Mobile Alerts: {notificationsEnabled ? 'ON' : 'OFF'}
            </button>
            {activeTab === 'inventory' && (
              <button className="btn btn-primary btn-add" onClick={() => handleOpenModal()}>
                <Plus size={20} /> Add New Item
              </button>
            )}
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="admin-analytics-dashboard" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
          <div className="analytics-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '4px solid #0984e3' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#636e72', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Revenue</h4>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3436' }}>₹{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="analytics-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '4px solid #27ae60' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#636e72', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Orders</h4>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3436' }}>{totalOrdersCount}</div>
          </div>
          <div className="analytics-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '4px solid #f39c12' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#636e72', fontSize: '0.9rem', textTransform: 'uppercase' }}>Pending Verifications</h4>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3436' }}>{pendingOrdersCount}</div>
          </div>
          <div className="analytics-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '4px solid #9b59b6' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#636e72', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Customers</h4>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3436' }}>{totalCustomersCount}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart size={18} /> Orders
          </button>
          <button 
            className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <Users size={18} /> Customers
          </button>
          <button 
            className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Package size={18} /> Inventory
          </button>
          <button 
            className={`tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            <Layout size={18} /> Hero Editor
          </button>
          <button 
            className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Tag size={18} /> Categories
          </button>
          <button 
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <Info size={18} /> About Us
          </button>
          <button 
            className={`tab-btn ${activeTab === 'footer' ? 'active' : ''}`}
            onClick={() => setActiveTab('footer')}
          >
            <MapPin size={18} /> Footer & Contact
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <Star size={18} /> Reviews
          </button>
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} /> Settings
          </button>
        </div>

        {saveSuccess && (
          <div className="save-toast">
            <Check size={18} /> Changes saved successfully!
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="tab-content fadeIn">
            <div className="admin-controls">
              <h3>Live Customer Orders</h3>
              <div className="admin-stats">
                <span>Total Orders: <strong>{allOrders.length}</strong></span>
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-4">No orders found.</td></tr>
                  ) : (
                    allOrders.map(order => (
                      <tr key={order._id}>
                        <td className="font-semibold">{order.orderRef}</td>
                        <td>
                          <div><strong>{order.userId?.name}</strong></div>
                          <div className="text-muted" style={{fontSize: '0.8rem'}}>{order.userId?.phone}</div>
                          {order.specialInstructions && (
                            <div className="special-req-tag mt-1">
                              📝 {order.specialInstructions}
                            </div>
                          )}
                        </td>
                        <td>{order.items?.length} items</td>
                        <td>
                          <div style={{ fontWeight: 'bold' }}>₹{order.totalAmount}</div>
                          {order.paymentMethod && (
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: order.paymentMethod?.toLowerCase() === 'cod' ? '#e65100' : '#27ae60', marginTop: '4px' }}>
                              Method: {order.paymentMethod?.toUpperCase()}
                            </div>
                          )}
                          {order.transactionId && (
                            <div style={{ fontSize: '0.8rem', color: '#0984e3', marginTop: '4px' }}>
                              UTR: {order.transactionId}
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem', maxWidth: '200px', whiteSpace: 'normal', color: '#2d3436' }}>
                            <MapPin size={12} style={{ display: 'inline', marginRight: '4px', color: '#d63031' }} />
                            {order.address}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge status-${order.transactionStatus?.toLowerCase()}`}>
                            {order.transactionStatus === 'PENDING_VERIFICATION' 
                              ? (order.paymentMethod?.toLowerCase() === 'cod' ? 'AWAITING VERIFICATION' : 'AWAITING PAYMENT')
                              : order.transactionStatus?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td>
                          <div className="admin-actions">
                             {order.transactionStatus === 'PENDING_VERIFICATION' && (
                              <>
                                 <button 
                                  className="action-btn approve" 
                                  onClick={() => handleUpdateStatus(order._id, 'PAYMENT_VERIFIED')}
                                  title={order.paymentMethod?.toLowerCase() === 'cod' ? "Confirm Order" : "Approve Payment"}
                                >
                                  <Check size={14} />
                                </button>
                                <button 
                                  className="action-btn reject" 
                                  onClick={() => handleUpdateStatus(order._id, 'PAYMENT_REJECTED')}
                                  title={order.paymentMethod?.toLowerCase() === 'cod' ? "Reject Order" : "Reject Payment"}
                                >
                                  <X size={14} />
                                </button>
                              </>
                            )}
                            <button 
                              className="action-btn delete" 
                              onClick={() => deleteOrder(order._id)}
                              title="Delete Order"
                            >
                              <Trash size={14} />
                            </button>
                            {['PAYMENT_VERIFIED', 'VERIFIED'].includes(order.transactionStatus) && (
                              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <input 
                                  type="date" 
                                  value={deliverySchedule[order._id]?.deliveryDate || order.deliveryDate || ''}
                                  onChange={(e) => handleScheduleChange(order._id, 'deliveryDate', e.target.value)}
                                  style={{ padding: '4px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                                />
                                <input 
                                  type="time" 
                                  value={deliverySchedule[order._id]?.deliveryTime || order.deliveryTime || ''}
                                  onChange={(e) => handleScheduleChange(order._id, 'deliveryTime', e.target.value)}
                                  style={{ padding: '4px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                                />
                                <button 
                                  className="btn btn-primary" 
                                  onClick={() => updateSchedule(order._id)}
                                  style={{ padding: '4px', fontSize: '10px', marginTop: '4px' }}
                                >
                                  Update Schedule
                                </button>
                                <button 
                                  className="btn" 
                                  onClick={() => {
                                    if(window.confirm('Mark this order as DELIVERED exclusively?')) {
                                      handleUpdateStatus(order._id, 'DELIVERED');
                                    }
                                  }}
                                  style={{ padding: '4px', fontSize: '10px', marginTop: '4px', background: '#27ae60', color: 'white', border: 'none' }}
                                >
                                  Mark as Delivered <Check size={10} style={{display:'inline', marginLeft:'2px'}}/>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="tab-content fadeIn">
            <div className="admin-controls">
              <h3>Registered Customers</h3>
              <div className="admin-stats">
                <span>Count: <strong>{allCustomers.length}</strong></span>
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allCustomers.map(customer => (
                    <tr key={customer._id}>
                      <td className="font-semibold">{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="action-btn delete" 
                          onClick={() => deleteCustomer(customer._id)}
                          title="Delete Customer"
                        >
                          <Trash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="tab-content fadeIn">
            <div className="admin-controls">
              <div className="search-box admin-search">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="admin-stats">
                <span>Items: <strong>{products.length}</strong></span>
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        <img 
                          src={product.image} 
                          alt="" 
                          className="admin-prod-img" 
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = '/logoo.png';
                          }}
                        />
                      </td>
                      <td className="font-semibold">
                        {product.name}
                        {product.inStock === false && <span style={{marginLeft: '8px', fontSize: '10px', background: '#ff7675', color: 'white', padding: '2px 6px', borderRadius: '4px'}}>Out of Stock</span>}
                      </td>
                      <td><span className={`cat-badge cat-${product.category}`}>{product.category}</span></td>
                      <td>₹{product.price} <span style={{fontSize: '0.8rem', color: '#795548'}}>/ {product.unit || '1 kg'}</span></td>
                      <td>
                        <div className="admin-actions">
                          <button className="action-btn edit" onClick={() => handleOpenModal(product)} title="Edit">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Edit</span>
                          </button>
                          <button className="action-btn delete" onClick={() => { if(window.confirm(`Are you sure you want to delete ${product.name}?`)) deleteProduct(product.id); }} title="Delete">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hero Editor Tab */}
        {activeTab === 'hero' && (
          <div className="tab-content fadeIn">
            <div className="admin-card">
              <h3>Manage Homepage Hero Content</h3>
              <form onSubmit={handleHeroSubmit} className="admin-form">
                <div className="form-group">
                  <label>Main Heading</label>
                  <input 
                    type="text" 
                    value={heroForm.heading}
                    onChange={(e) => setHeroForm({...heroForm, heading: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Subtext</label>
                  <textarea 
                    value={heroForm.subtext}
                    onChange={(e) => setHeroForm({...heroForm, subtext: e.target.value})}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Hero Image URL</label>
                  <input 
                    type="text" 
                    value={heroForm.image}
                    onChange={(e) => setHeroForm({...heroForm, image: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn btn-primary"><Save size={18} /> Update Content</button>
              </form>
            </div>
          </div>
        )}

        {/* About Us Tab */}
        {activeTab === 'about' && (
          <div className="tab-content fadeIn">
            <div className="admin-card">
              <h3>Manage About Us Content</h3>
              <form onSubmit={handleAboutSubmit} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Hero Badge (e.g. SINCE 1999)</label>
                    <input 
                      type="text" 
                      value={aboutForm.heroBadge}
                      onChange={(e) => setAboutForm({...aboutForm, heroBadge: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Experience Years (e.g. 25+)</label>
                    <input 
                      type="text" 
                      value={aboutForm.experienceYears}
                      onChange={(e) => setAboutForm({...aboutForm, experienceYears: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Hero Title</label>
                  <input 
                    type="text" 
                    value={aboutForm.heroTitle}
                    onChange={(e) => setAboutForm({...aboutForm, heroTitle: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Hero Story (Sub-headline)</label>
                  <textarea 
                    value={aboutForm.story}
                    onChange={(e) => setAboutForm({...aboutForm, story: e.target.value})}
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <label>Heritage Title</label>
                  <input 
                    type="text" 
                    value={aboutForm.heritageTitle}
                    onChange={(e) => setAboutForm({...aboutForm, heritageTitle: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Heritage Story (Main Text)</label>
                  <textarea 
                    value={aboutForm.heritageText}
                    onChange={(e) => setAboutForm({...aboutForm, heritageText: e.target.value})}
                    rows="5"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Values Title</label>
                    <input 
                      type="text" 
                      value={aboutForm.valuesTitle}
                      onChange={(e) => setAboutForm({...aboutForm, valuesTitle: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Values Subtitle</label>
                    <input 
                      type="text" 
                      value={aboutForm.valuesSubtitle}
                      onChange={(e) => setAboutForm({...aboutForm, valuesSubtitle: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Heritage Image URL</label>
                    <input 
                      type="text" 
                      value={aboutForm.heritageImage}
                      onChange={(e) => setAboutForm({...aboutForm, heritageImage: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Owner Image URL</label>
                    <input 
                      type="text" 
                      value={aboutForm.ownerImage}
                      onChange={(e) => setAboutForm({...aboutForm, ownerImage: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Owner Name</label>
                    <input 
                      type="text" 
                      value={aboutForm.ownerName}
                      onChange={(e) => setAboutForm({...aboutForm, ownerName: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Owner Quote</label>
                    <input 
                      type="text" 
                      value={aboutForm.ownerQuote}
                      onChange={(e) => setAboutForm({...aboutForm, ownerQuote: e.target.value})}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary"><Save size={18} /> Update Content</button>
              </form>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="tab-content fadeIn">
            <div className="admin-card">
              <h3>Manage Categories</h3>
              
              <div className="admin-form" style={{ display: 'flex', gap: '10px', marginBottom: '30px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="New Category Name (e.g. Snacks)..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={handleAddCategory} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                  <Plus size={18} /> Add Category
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Category Name</th>
                      <th>Slug ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(cat => (
                      <tr key={cat.id}>
                        {editingCatId === cat.id ? (
                          <>
                            <td colSpan="2">
                              <input 
                                type="text" 
                                value={editCatName} 
                                onChange={(e) => setEditCatName(e.target.value)} 
                                style={{ width: '100%', padding: '6px 12px', border: '1.5px solid #e1e1e1', borderRadius: '8px', outline: 'none' }}
                              />
                            </td>
                            <td>
                              <div className="admin-actions">
                                <button onClick={saveEditCat} className="btn" style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>Save</button>
                                <button onClick={() => setEditingCatId(null)} className="btn" style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #ccc', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="font-semibold">{cat.name}</td>
                            <td className="text-muted">{cat.id}</td>
                            <td>
                              <div className="admin-actions">
                                <button className="action-btn edit" onClick={() => startEditCat(cat)} title="Edit">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Edit</span>
                                </button>
                                <button className="action-btn delete" onClick={() => { if(window.confirm(`Delete category "${cat.name}"? Products inside it will become uncategorized.`)) deleteCategory(cat.id); }} title="Delete">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Delete</span>
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Footer & Contact Tab */}
        {activeTab === 'footer' && (
          <div className="tab-content fadeIn">
            <div className="admin-card">
              <h3>Footer & Contact Settings</h3>
              <form onSubmit={handleFooterSubmit} className="admin-form">
                <div className="form-group">
                  <label>Shop Name</label>
                  <input 
                    type="text" 
                    value={footerForm.shopName}
                    onChange={(e) => setFooterForm({...footerForm, shopName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Footer Description</label>
                  <textarea 
                    value={footerForm.description}
                    onChange={(e) => setFooterForm({...footerForm, description: e.target.value})}
                    rows="3"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Branch 1 Address</label>
                    <textarea 
                      value={footerForm.addresses?.[0] || ''}
                      onChange={(e) => {
                        const arr = [...(footerForm.addresses || [])];
                        arr[0] = e.target.value;
                        setFooterForm({...footerForm, addresses: arr});
                      }}
                      rows="2"
                    />
                  </div>
                  <div className="form-group">
                    <label>Branch 2 Address (Optional)</label>
                    <textarea 
                      value={footerForm.addresses?.[1] || ''}
                      onChange={(e) => {
                        const arr = [...(footerForm.addresses || [])];
                        arr[1] = e.target.value;
                        setFooterForm({...footerForm, addresses: arr});
                      }}
                      rows="2"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Line 1 & Line 2</label>
                    <div style={{display:'flex', gap: '8px'}}>
                      <input 
                        type="text" 
                        placeholder="Primary Number"
                        value={footerForm.phoneNumbers?.[0] || ''}
                        onChange={(e) => {
                          const arr = [...(footerForm.phoneNumbers || [])];
                          arr[0] = e.target.value;
                          setFooterForm({...footerForm, phoneNumbers: arr});
                        }}
                      />
                      <input 
                        type="text" 
                        placeholder="Secondary Number"
                        value={footerForm.phoneNumbers?.[1] || ''}
                        onChange={(e) => {
                          const arr = [...(footerForm.phoneNumbers || [])];
                          arr[1] = e.target.value;
                          setFooterForm({...footerForm, phoneNumbers: arr});
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Line 3 & Line 4 (Optional)</label>
                    <div style={{display:'flex', gap: '8px'}}>
                      <input 
                        type="text" 
                        placeholder="Tertiary Number"
                        value={footerForm.phoneNumbers?.[2] || ''}
                        onChange={(e) => {
                          const arr = [...(footerForm.phoneNumbers || [])];
                          arr[2] = e.target.value;
                          setFooterForm({...footerForm, phoneNumbers: arr});
                        }}
                      />
                      <input 
                        type="text" 
                        placeholder="Quaternary Number"
                        value={footerForm.phoneNumbers?.[3] || ''}
                        onChange={(e) => {
                          const arr = [...(footerForm.phoneNumbers || [])];
                          arr[3] = e.target.value;
                          setFooterForm({...footerForm, phoneNumbers: arr});
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={footerForm.email}
                      onChange={(e) => setFooterForm({...footerForm, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Operating Hours</label>
                    <input 
                      type="text" 
                      value={footerForm.hours || 'Mon-Sun: 9:00 AM - 10:00 PM'}
                      onChange={(e) => setFooterForm({...footerForm, hours: e.target.value})}
                    />
                  </div>
                </div>
                
                <button type="submit" className="btn btn-primary mt-4"><Save size={18} /> Update Content</button>
              </form>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="tab-content fadeIn">
            <div className="admin-controls">
              <h3>All Product Reviews</h3>
              <div className="admin-stats">
                <span>Total Reviews: <strong>{products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0)}</strong></span>
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>User</th>
                    <th>Rating</th>
                    <th>Date</th>
                    <th>Comment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.flatMap(p => (p.reviews || []).map(r => ({ ...r, productId: p.id, productName: p.name })))
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((review, idx) => (
                      <tr key={`${review.productId}-${review.id}-${idx}`}>
                        <td className="font-semibold">{review.productName}</td>
                        <td>{review.username || 'Anonymous'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} fill={i < review.rating ? "#ffca28" : "none"} color={i < review.rating ? "#ffca28" : "#ccc"} />
                            ))}
                          </div>
                        </td>
                        <td>{new Date(review.date).toLocaleDateString()}</td>
                        <td style={{ maxWidth: '250px', whiteSpace: 'normal' }}>"{review.comment}"</td>
                        <td>
                          <button 
                            className="btn-icon delete" 
                            title="Delete Review"
                            onClick={() => {
                              if(window.confirm('Delete this review?')) {
                                deleteReview(review.productId, review.id);
                                showSuccess();
                              }
                            }}
                          >
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  {products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0) === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No reviews found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-content fadeIn">
            <div className="admin-card compact">
              <h3>Admin Credentials</h3>
              <p className="text-muted mb-6">Update your login information. Changes take effect on next login.</p>
              <form onSubmit={handleAuthSubmit} className="admin-form">
                <div className="form-group">
                  <label><User size={16} /> Username</label>
                  <input 
                    type="text" 
                    value={authForm.username}
                    onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label><Lock size={16} /> New Password</label>
                  <input 
                    type="password" 
                    value={authForm.password}
                    onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn btn-primary"><Save size={18} /> Save Credentials</button>
              </form>
            </div>

            <div className="admin-card compact" style={{ marginTop: '20px' }}>
              <h3>🚗 Delivery Charge Settings</h3>
              <p className="text-muted mb-6">
                Set a flat delivery charge that will be applied to all customer orders.
              </p>
              <form onSubmit={(e) => {
                e.preventDefault();
                updateDeliveryCharge(deliveryChargeInput);
                showSuccess();
              }} className="admin-form">
                <div className="form-group">
                  <label>Flat Delivery Charge (₹)</label>
                  <input
                    type="number" min="0" step="1"
                    value={deliveryChargeInput}
                    onChange={(e) => setDeliveryChargeInput(e.target.value)}
                    placeholder="e.g. 50"
                    required
                  />
                  <small style={{color:'#636e72',marginTop:'4px',display:'block'}}>Currently saved charge: ₹{deliveryCharge}</small>
                </div>
                <button type="submit" className="btn btn-primary"><Save size={18} /> Save Delivery Charge</button>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleProductSubmit} className="admin-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Unit / Quantity (e.g. 1 kg, 1 box)</label>
                  <input type="text" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: '#f8f9fa', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.inStock} 
                    onChange={(e) => setFormData({...formData, inStock: e.target.checked})} 
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{fontWeight: '600', color: formData.inStock ? '#27ae60' : '#e74c3c'}}>
                    {formData.inStock ? 'Item is currently In Stock and available for purchase' : 'Item is Out of Stock (Hidden from Cart)'}
                  </span>
                </label>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" required />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
