import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { 
  Pencil, Trash, Plus, Search, X, Check, Save, 
  Package, Info, Settings, Image as ImageIcon, User, Lock, ExternalLink, Layout, MapPin, Tag 
} from 'lucide-react';
import './Admin.css';

const Admin = () => {
  const { 
    products, addProduct, updateProduct, deleteProduct, categories,
    aboutData, updateAbout, adminAuth, updateAuth, heroData, updateHero,
    footerData, updateFooter, addCategory, updateCategory, deleteCategory
  } = useProducts();
  
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Product Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        image: product.image
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
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
    updateAuth(authForm);
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
          {activeTab === 'inventory' && (
            <button className="btn btn-primary btn-add" onClick={() => handleOpenModal()}>
              <Plus size={20} /> Add New Item
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
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
                      <td><img src={product.image} alt="" className="admin-prod-img" /></td>
                      <td className="font-semibold">{product.name}</td>
                      <td><span className={`cat-badge cat-${product.category}`}>{product.category}</span></td>
                      <td>₹{product.price}</td>
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
                <div className="form-group">
                  <label>Hero Story (Sub-headline)</label>
                  <textarea 
                    value={aboutForm.story}
                    onChange={(e) => setAboutForm({...aboutForm, story: e.target.value})}
                    rows="2"
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

        {/* Settings Tab */}
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
                  <label>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
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
