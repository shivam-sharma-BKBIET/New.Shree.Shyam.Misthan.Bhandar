import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const { products, categories, heroData } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="home-page">
      {/* Grand Hero Section */}
      <section className="hero-section">
        <div className="container grand-hero-container">
          <div className="hero-plaque">
            <div className="hero-image-frame">
              <img 
                src={heroData?.image || "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=1000"} 
                alt="New Shyam Misthan Bhandar" 
                className="hero-image"
              />
            </div>
            <div className="hero-content">
              <h1 className="hero-title">{heroData?.heading || "New Shree Shyam Misthan Bhandar"}</h1>
              <div className="hero-divider"></div>
              <p className="hero-subtitle">{heroData?.subtext || "Tradition of Purity, Taste of Excellence."}</p>
              <div className="hero-actions">
                <Link to="/products" className="btn btn-luxury">
                  Explore Specialties <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="section categories-section bg-light">
        <div className="container">
          <h2 className="section-title">Shop by <span>Category</span></h2>
          <div className="category-grid">
            {categories.map((category) => (
              <Link to={`/products?category=${category.id}`} key={category.id} className="category-card">
                <img src={category.image} alt={category.name} className="category-image" />
                <div className="category-overlay">
                  <h3>{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured-section">
        <div className="container">
          <h2 className="section-title">Featured <span>Delights</span></h2>
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-row">
            <Link to="/products" className="btn btn-outline">View All Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
