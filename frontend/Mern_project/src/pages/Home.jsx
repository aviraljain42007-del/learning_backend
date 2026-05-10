import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiStar } from "react-icons/fi";
import api from "../api/axios";
import ProductCard from "../components/product/productcard";

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get("/get-allproducts?page=1");
        if (data.success) {
          setFeatured(data.products?.slice(0, 4) || []);
        }
      } catch {
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={heroStyle}>
        <div style={heroOverlay} />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div style={heroContent}>
            <div style={heroBadge}>
              <FiStar size={14} /> Premium Shopping Experience
            </div>
            <h1 style={heroTitle}>
              Mark it, <span style={{ color: "#F97316" }}>Get it</span>
            </h1>
            <p style={heroSubtitle}>
              Discover premium products curated just for you. From electronics to fashion,
              find everything you need at unbeatable prices.
            </p>
            <div style={heroBtns}>
              <Link to="/products" className="btn btn-primary btn-lg" id="shop-now-btn">
                Shop Now <FiArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div style={floatingOrb1} />
        <div style={floatingOrb2} />
      </section>

      {/* Features */}
      <section style={featuresSection}>
        <div className="container">
          <div style={featuresGrid}>
            {[
              { icon: <FiShoppingBag size={24} />, title: "Curated Products", desc: "Hand-picked quality items" },
              { icon: <FiTruck size={24} />, title: "Fast Delivery", desc: "Free shipping over ₹500" },
              { icon: <FiShield size={24} />, title: "Secure Payments", desc: "100% secure checkout" },
              { icon: <FiStar size={24} />, title: "Top Ratings", desc: "Trusted by thousands" },
            ].map((f, i) => (
              <div key={i} style={featureCard}>
                <div style={featureIcon}>{f.icon}</div>
                <h3 style={featureTitle}>{f.title}</h3>
                <p style={featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Featured Products</h2>
            <Link to="/products" style={viewAllLink}>
              View All <FiArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="spinner-container"><div className="spinner" /></div>
          ) : featured.length > 0 ? (
            <div className="product-grid">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No products available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section style={ctaSection}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={ctaTitle}>Ready to Start Shopping?</h2>
          <p style={ctaDesc}>Join thousands of happy customers on MARKIT</p>
          <Link to="/register" className="btn btn-primary btn-lg" id="cta-register-btn">
            Get Started <FiArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

/* Styles */
const heroStyle = {
  position: "relative",
  minHeight: "85vh",
  display: "flex",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 40%, #16213e 100%)",
  overflow: "hidden",
};

const heroOverlay = {
  position: "absolute",
  inset: 0,
  background: "radial-gradient(ellipse at 70% 50%, rgba(249, 115, 22, 0.08) 0%, transparent 60%)",
};

const heroContent = {
  maxWidth: 640,
  animation: "fadeIn 0.8s ease",
};

const heroBadge = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 16px",
  background: "rgba(249, 115, 22, 0.1)",
  border: "1px solid rgba(249, 115, 22, 0.2)",
  borderRadius: 999,
  color: "#F97316",
  fontSize: "0.85rem",
  fontWeight: 600,
  marginBottom: 24,
};

const heroTitle = {
  fontSize: "clamp(2.5rem, 6vw, 4rem)",
  fontWeight: 900,
  lineHeight: 1.1,
  marginBottom: 20,
  color: "#f1f5f9",
  letterSpacing: "-1px",
};

const heroSubtitle = {
  fontSize: "1.15rem",
  color: "#94a3b8",
  lineHeight: 1.7,
  marginBottom: 36,
  maxWidth: 500,
};

const heroBtns = {
  display: "flex",
  gap: 16,
  flexWrap: "wrap",
};

const floatingOrb1 = {
  position: "absolute",
  width: 400,
  height: 400,
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, transparent 70%)",
  top: "10%",
  right: "-5%",
  animation: "pulse 4s ease-in-out infinite",
};

const floatingOrb2 = {
  position: "absolute",
  width: 300,
  height: 300,
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)",
  bottom: "10%",
  right: "15%",
  animation: "pulse 5s ease-in-out infinite reverse",
};

const featuresSection = {
  padding: "60px 0",
  background: "#0a0a18",
  borderTop: "1px solid rgba(148, 163, 184, 0.06)",
  borderBottom: "1px solid rgba(148, 163, 184, 0.06)",
};

const featuresGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 24,
};

const featureCard = {
  textAlign: "center",
  padding: "32px 20px",
  borderRadius: 16,
  background: "rgba(22, 33, 62, 0.4)",
  border: "1px solid rgba(148, 163, 184, 0.08)",
  transition: "all 0.3s ease",
};

const featureIcon = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 56,
  height: 56,
  borderRadius: 14,
  background: "rgba(249, 115, 22, 0.12)",
  color: "#F97316",
  marginBottom: 16,
};

const featureTitle = {
  fontSize: "1rem",
  fontWeight: 700,
  color: "#f1f5f9",
  marginBottom: 6,
};

const featureDesc = {
  fontSize: "0.85rem",
  color: "#64748b",
};

const sectionHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 32,
};

const sectionTitle = {
  fontSize: "1.8rem",
  fontWeight: 800,
  color: "#f1f5f9",
};

const viewAllLink = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  color: "#F97316",
  fontWeight: 600,
  fontSize: "0.95rem",
};

const ctaSection = {
  padding: "80px 0",
  background: "linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(251, 191, 36, 0.04) 100%)",
  borderTop: "1px solid rgba(249, 115, 22, 0.1)",
};

const ctaTitle = {
  fontSize: "2rem",
  fontWeight: 800,
  marginBottom: 12,
  color: "#f1f5f9",
};

const ctaDesc = {
  color: "#94a3b8",
  fontSize: "1.05rem",
  marginBottom: 32,
};

export default Home;