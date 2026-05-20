import React, { useEffect, useState } from 'react';
import { useProducts } from '../context/ProductContext';
import './About.css';
import { 
  Award, 
  ShieldCheck, 
  Heart, 
  Clock, 
  Star, 
  Utensils, 
  Zap, 
  Play, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Eye 
} from 'lucide-react';

export const branchGalleryData = {
  sultana: {
    name: "Sultana Branch (The Heritage Store)",
    tag: "ESTD. 1999",
    description: "Our historic founding store where the legacy of pure ghee sweets began. Rich with traditional charm and time-tested recipes.",
    items: [
      {
        id: "s1",
        type: "image",
        title: "Traditional Sweet Display",
        description: "A gorgeous array of fresh, hand-made milk pedas and laddus at our main counter.",
        url: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "s2",
        type: "video",
        title: "Crafting Desi Ghee Jalebi",
        description: "Watch our master chef prepare piping hot, crispy Jalebis in pure desi ghee.",
        url: "https://assets.mixkit.co/videos/preview/mixkit-preparing-delicious-sweet-pastries-42340-large.mp4",
        thumbnail: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "s3",
        type: "image",
        title: "The Legacy Kitchen",
        description: "Where our secret family recipes are prepared with strict hygiene and love.",
        url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "s4",
        type: "image",
        title: "Festive Packings",
        description: "Our signature gold-embossed gift boxes packed for local celebrations.",
        url: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "s5",
        type: "video",
        title: "Pouring Pure Rabri",
        description: "Slow-cooked milk condensed to perfection, rich with cardamom and saffron.",
        url: "https://assets.mixkit.co/videos/preview/mixkit-pouring-honey-on-fresh-pancakes-34372-large.mp4",
        thumbnail: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "s6",
        type: "image",
        title: "Happy Customer Smiles",
        description: "Serving sweet moments of joy to families for over two decades.",
        url: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800"
      }
    ]
  },
  jhunjhunu: {
    name: "Jhunjhunu Branch (The Luxury Flagship)",
    tag: "ESTD. 2018",
    description: "Our modern state-of-the-art flagship store featuring luxury interiors, a VIP dine-in lounge, and premium designer sweet boxes.",
    items: [
      {
        id: "j1",
        type: "image",
        title: "Modern Premium Storefront",
        description: "Our stunning contemporary storefront with elegant lighting and luxury glass showcases.",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "j2",
        type: "video",
        title: "Flagship Walkthrough",
        description: "Take a virtual tour of our premium retail space and interactive sweet tasting counters.",
        url: "https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-modern-kitchen-40436-large.mp4",
        thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "j3",
        type: "image",
        title: "Dine-In Cafe & Lounge",
        description: "A comfortable, beautiful space to enjoy fresh sweets, hot snacks, and signature kulfi.",
        url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "j4",
        type: "image",
        title: "Premium Designer Sweets",
        description: "Our gold-leafed dry fruit bites, saffron Kaju Katli, and exotic fusion sweets.",
        url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "j5",
        type: "video",
        title: "Custom Designer Cakes",
        description: "Our master chef adding exquisite custom sugar-art decorations to a celebratory cake.",
        url: "https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-sweet-dessert-42352-large.mp4",
        thumbnail: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "j6",
        type: "image",
        title: "Gifting Hampers Lounge",
        description: "Dedicated counter for creating customized royal wedding and corporate gift hampers.",
        url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800"
      }
    ]
  }
};

const About = () => {
  const { aboutData } = useProducts();
  const [activeBranch, setActiveBranch] = useState('sultana');
  const [filterType, setFilterType] = useState('all');
  const [lightbox, setLightbox] = useState({ isOpen: false, itemIndex: 0 });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const currentBranchData = (aboutData.branchGalleryData && aboutData.branchGalleryData[activeBranch])
    ? aboutData.branchGalleryData[activeBranch]
    : branchGalleryData[activeBranch];
  const filteredItems = currentBranchData.items.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const handleOpenLightbox = (index) => {
    setLightbox({ isOpen: true, itemIndex: index });
  };

  const handleCloseLightbox = () => {
    setLightbox({ isOpen: false, itemIndex: 0 });
  };

  const handlePrevItem = () => {
    setLightbox(prev => ({
      ...prev,
      itemIndex: prev.itemIndex === 0 ? filteredItems.length - 1 : prev.itemIndex - 1
    }));
  };

  const handleNextItem = () => {
    setLightbox(prev => ({
      ...prev,
      itemIndex: prev.itemIndex === filteredItems.length - 1 ? 0 : prev.itemIndex + 1
    }));
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightbox.isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleCloseLightbox();
      if (e.key === 'ArrowLeft') handlePrevItem();
      if (e.key === 'ArrowRight') handleNextItem();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.isOpen, filteredItems.length]);

  return (
    <div className="about-wrapper">
      {/* Premium Hero Section */}
      <section className="about-hero-v2">
        <div className="about-hero-overlay"></div>
        <div className="container relative z-10">
          <div className="about-hero-inner">
            <span className="hero-badge">{aboutData.heroBadge || 'SINCE 1999'}</span>
            <h1 className="hero-main-title">{(aboutData.heroTitle || 'Crafting Sweet Memories for Generations').split(' ').map((w,i) => w === 'Sweet' || w === 'Memories' ? <span key={i}>{w} </span> : w + ' ')}</h1>
            <p className="hero-description">{aboutData.story}</p>
          </div>
        </div>
      </section>

      {/* Heritage & Legacy Section */}
      <section className="heritage-v2 section">
        <div className="container">
          <div className="heritage-grid-v2">
            <div className="heritage-image-container">
              <div className="image-frame">
                <img src={aboutData.heritageImage} alt="Our Heritage" className="heritage-main-img" />
                <div className="experience-badge">
                  <span className="years">{aboutData.experienceYears || '25+'}</span>
                  <span className="text">Years of Mastery</span>
                </div>
              </div>
              <div className="decorative-element"></div>
            </div>
            
            <div className="heritage-content-v2">
              <div className="section-tag">OUR HERITAGE</div>
              <h2 className="heritage-title">{aboutData.heritageTitle || 'A Tradition of Purity & Taste'}</h2>
              <div className="divider-gold"></div>
              <p className="heritage-text">{aboutData.heritageText}</p>
              
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon"><Utensils size={20} /></div>
                  <div className="feature-info">
                    <h4>Traditional Recipes</h4>
                    <p>Authentic flavors passed down through generations.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon"><Zap size={20} /></div>
                  <div className="feature-info">
                    <h4>Modern Quality</h4>
                    <p>Highest standards of hygiene and safety.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Promises Grid */}
      <section className="values-v2 section bg-warm">
        <div className="container">
          <div className="section-header-v2">
            <h2 className="section-title-v2">{aboutData.valuesTitle || 'The Pillars of Our Excellence'}</h2>
            <p className="section-subtitle">{aboutData.valuesSubtitle || 'What makes every bite of our sweets special.'}</p>
          </div>
          
          <div className="values-cards-v2">
            <div className="value-card-v2">
              <div className="card-icon-box"><Heart size={32} /></div>
              <h3>Handcrafted Love</h3>
              <p>Each sweet is made by hand with the finest ingredients and genuine care.</p>
            </div>
            
            <div className="value-card-v2 featured">
              <div className="card-icon-box"><Star size={32} /></div>
              <h3>Superior Quality</h3>
              <p>We source only the purest milk, saffron, and nuts for an unmatched taste.</p>
            </div>
            
            <div className="value-card-v2">
              <div className="card-icon-box"><ShieldCheck size={32} /></div>
              <h3>Total Hygiene</h3>
              <p>Prepared in a sanitized, state-of-the-art facility for your peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner & Visionary Section */}
      <section className="visionary-section section">
        <div className="container">
          <div className="visionary-card-v2">
            <div className="visionary-image-box">
              <img src={aboutData.ownerImage} alt={aboutData.ownerName} />
              <div className="visionary-overlay"></div>
            </div>
            <div className="visionary-content-box">
              <div className="quote-icon">“</div>
              <p className="visionary-quote">{aboutData.ownerQuote}</p>
              <div className="visionary-footer">
                <h3 className="visionary-name">{aboutData.ownerName}</h3>
                <p className="visionary-role">Founder & Master Confectioner</p>
                <div className="signature">{aboutData.shopName || 'New Shree Shyam Misthan Bhandar'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Multi-Branch Gallery Section */}
      <section className="gallery-section section">
        <div className="container">
          <div className="section-header-v2">
            <div className="section-tag">VISIT OUR STORES</div>
            <h2 className="section-title-v2">Our <span>Branches & Gallery</span></h2>
            <p className="section-subtitle">Take a visual tour through our traditional heritage kitchens and modern luxury sweets lounges.</p>
          </div>

          {/* Branch Switching Tabs ("Two Windows") */}
          <div className="branch-tabs-wrapper">
            <div className="branch-tabs">
              <button 
                className={`branch-tab-btn ${activeBranch === 'sultana' ? 'active' : ''}`}
                onClick={() => { setActiveBranch('sultana'); setFilterType('all'); }}
              >
                <span className="branch-tab-title">{((aboutData.branchGalleryData && aboutData.branchGalleryData['sultana']) ? aboutData.branchGalleryData['sultana'] : branchGalleryData['sultana']).name.split(' (')[0] || 'Sultana Branch'}</span>
                <span className="branch-tab-subtitle">{((aboutData.branchGalleryData && aboutData.branchGalleryData['sultana']) ? aboutData.branchGalleryData['sultana'] : branchGalleryData['sultana']).tag || 'Heritage Store'}</span>
              </button>
              <button 
                className={`branch-tab-btn ${activeBranch === 'jhunjhunu' ? 'active' : ''}`}
                onClick={() => { setActiveBranch('jhunjhunu'); setFilterType('all'); }}
              >
                <span className="branch-tab-title">{((aboutData.branchGalleryData && aboutData.branchGalleryData['jhunjhunu']) ? aboutData.branchGalleryData['jhunjhunu'] : branchGalleryData['jhunjhunu']).name.split(' (')[0] || 'Jhunjhunu Branch'}</span>
                <span className="branch-tab-subtitle">{((aboutData.branchGalleryData && aboutData.branchGalleryData['jhunjhunu']) ? aboutData.branchGalleryData['jhunjhunu'] : branchGalleryData['jhunjhunu']).tag || 'Luxury Flagship'}</span>
              </button>
            </div>
          </div>

          {/* Branch Description Banner */}
          <div className="branch-desc-banner">
            <div className="banner-badge">{currentBranchData.tag}</div>
            <h3>{currentBranchData.name}</h3>
            <p>{currentBranchData.description}</p>
          </div>

          {/* Media Category Filters */}
          <div className="media-filters">
            <button 
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All Media
            </button>
            <button 
              className={`filter-btn ${filterType === 'image' ? 'active' : ''}`}
              onClick={() => setFilterType('image')}
            >
              Photos
            </button>
            <button 
              className={`filter-btn ${filterType === 'video' ? 'active' : ''}`}
              onClick={() => setFilterType('video')}
            >
              Videos
            </button>
          </div>

          {/* Dynamic Interactive Gallery Grid */}
          <div className="gallery-grid">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`gallery-card ${item.type === 'video' ? 'video-card' : ''}`}
                onClick={() => handleOpenLightbox(index)}
              >
                <div className="gallery-card-inner">
                  <img 
                    src={item.type === 'video' ? item.thumbnail : item.url} 
                    alt={item.title} 
                    className="gallery-media-preview"
                  />
                  <div className="gallery-overlay-v2">
                    <span className="media-type-badge">
                      {item.type === 'video' ? <Play size={16} fill="currentColor" /> : <Eye size={16} />}
                    </span>
                    <div className="overlay-text-box">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Lightbox Modal */}
      {lightbox.isOpen && filteredItems[lightbox.itemIndex] && (
        <div className="lightbox-modal" onClick={handleCloseLightbox}>
          <div className="lightbox-backdrop"></div>
          
          <button className="lightbox-close-btn" onClick={handleCloseLightbox} aria-label="Close Lightbox">
            <X size={28} />
          </button>

          {/* Lightbox Controls */}
          {filteredItems.length > 1 && (
            <>
              <button 
                className="lightbox-nav-btn prev-btn" 
                onClick={(e) => { e.stopPropagation(); handlePrevItem(); }}
                aria-label="Previous item"
              >
                <ChevronLeft size={36} />
              </button>
              <button 
                className="lightbox-nav-btn next-btn" 
                onClick={(e) => { e.stopPropagation(); handleNextItem(); }}
                aria-label="Next item"
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}

          {/* Lightbox Content Container */}
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-media-wrapper">
              {filteredItems[lightbox.itemIndex].type === 'video' ? (
                <video 
                  src={filteredItems[lightbox.itemIndex].url}
                  className="lightbox-video"
                  controls
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
                <img 
                  src={filteredItems[lightbox.itemIndex].url} 
                  alt={filteredItems[lightbox.itemIndex].title} 
                  className="lightbox-image"
                />
              )}
            </div>
            
            {/* Lightbox Info Footer */}
            <div className="lightbox-info">
              <span className="lightbox-index">{lightbox.itemIndex + 1} / {filteredItems.length}</span>
              <h3>{filteredItems[lightbox.itemIndex].title}</h3>
              <p>{filteredItems[lightbox.itemIndex].description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Final Call to Action or Trust Section */}
      <section className="trust-v2 section">
        <div className="container">
          <div className="trust-banner">
            <div className="trust-item">
              <Award size={40} className="trust-icon" />
              <div className="trust-text">
                <strong>Certified Quality</strong>
                <span>FSSAI Licensed Facility</span>
              </div>
            </div>
            <div className="trust-item">
              <Clock size={40} className="trust-icon" />
              <div className="trust-text">
                <strong>Always Fresh</strong>
                <span>Batches made every day</span>
              </div>
            </div>
            <div className="trust-item">
              <ShieldCheck size={40} className="trust-icon" />
              <div className="trust-text">
                <strong>Secure Ordering</strong>
                <span>Trusted by 10k+ Customers</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
