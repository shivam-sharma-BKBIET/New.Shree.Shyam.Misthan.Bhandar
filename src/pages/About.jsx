import React from 'react';
import { useProducts } from '../context/ProductContext';
import './About.css';
import { Award, ShieldCheck, Heart, Clock } from 'lucide-react';

const About = () => {
  const { aboutData } = useProducts();

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <h1>Our Story of <span>Sweetness</span></h1>
            <p>{aboutData.story}</p>
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="section heritage-section">
        <div className="container">
          <div className="heritage-grid">
            <div className="heritage-image">
              <img src={aboutData.heritageImage} alt="Our Heritage Shop" />
            </div>
            <div className="heritage-content">
              <h2 className="section-title">A Legacy of <span>Pure Ingredients</span></h2>
              <p>{aboutData.heritageText}</p>
              
              <div className="stats-grid">
                <div className="stat-item">
                  <Award size={32} />
                  <h4>25+ Years</h4>
                  <p>Of Excellence</p>
                </div>
                <div className="stat-item">
                  <ShieldCheck size={32} />
                  <h4>100% Pure</h4>
                  <p>Quality Guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Owners */}
      <section className="section owners-section bg-light">
        <div className="container">
          <h2 className="section-title text-center">Meet the <span>Visionaries</span></h2>
          <div className="owners-grid">
            <div className="owner-card">
              <div className="owner-image">
                <img src={aboutData.ownerImage} alt={aboutData.ownerName} />
              </div>
              <div className="owner-info">
                <h3>{aboutData.ownerName}</h3>
                <p className="owner-title">Founders & Master Confectioners</p>
                <div className="divider"></div>
                <p>{aboutData.ownerQuote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section values-section">
        <div className="container">
          <h2 className="section-title text-center">Why Choose <span>Sweet Delight</span>?</h2>
          <div className="values-grid">
            <div className="value-card">
              <Heart size={40} className="value-icon" />
              <h3>Made with Love</h3>
              <p>Handcrafted by artisans who have mastered the art of dessert making over generations.</p>
            </div>
            <div className="value-card">
              <Clock size={40} className="value-icon" />
              <h3>Freshly Baked</h3>
              <p>Items are prepared in small batches daily to ensure you receive them at their peak of freshness.</p>
            </div>
            <div className="value-card">
              <ShieldCheck size={40} className="value-icon" />
              <h3>Hygiene First</h3>
              <p>Our state-of-the-art kitchen adheres to the highest international food safety standards.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
