import React, { useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import './About.css';
import { Award, ShieldCheck, Heart, Clock, Star, Utensils, Zap } from 'lucide-react';

const About = () => {
  const { aboutData, isLoading } = useProducts();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  if (isLoading) return (
    <div className="about-loading">
      <div className="loader-spinner"></div>
      <p>Unfolding Our Story...</p>
    </div>
  );

  return (
    <div className="about-wrapper">
      {/* Premium Hero Section */}
      <section className="about-hero-v2">
        <div className="about-hero-overlay"></div>
        <div className="container relative z-10">
          <div className="about-hero-inner">
            <span className="hero-badge">SINCE 1999</span>
            <h1 className="hero-main-title">Crafting <span>Sweet</span> Memories for Generations</h1>
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
                  <span className="years">25+</span>
                  <span className="text">Years of Mastery</span>
                </div>
              </div>
              <div className="decorative-element"></div>
            </div>
            
            <div className="heritage-content-v2">
              <div className="section-tag">OUR HERITAGE</div>
              <h2 className="heritage-title">A Tradition of <span>Purity</span> & Taste</h2>
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
            <h2 className="section-title-v2">The Pillars of Our <span>Excellence</span></h2>
            <p className="section-subtitle">What makes every bite of our sweets special.</p>
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
                <div className="signature">New Shree Shyam Misthan Bhandar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
