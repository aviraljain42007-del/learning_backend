import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiInstagram } from "react-icons/fi";

function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={innerStyle}>
        <div style={gridStyle}>
          {/* Brand */}
          <div>
            <div style={brandStyle}>
              <img src="/logo1.png" alt="MARKIT" style={{ width: 36, height: 36, objectFit: "contain" }} />
              <span style={brandTextStyle}>MARKIT</span>
            </div>
            <p style={taglineStyle}>Mark it, Get it. Your premium online shopping destination.</p>
            <div style={socialStyle}>
              <a href="#" style={socialIconStyle}><FiGithub size={18} /></a>
              <a href="#" style={socialIconStyle}><FiTwitter size={18} /></a>
              <a href="#" style={socialIconStyle}><FiInstagram size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={colTitleStyle}>Quick Links</h4>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/products" style={linkStyle}>Products</Link>
            <Link to="/cart" style={linkStyle}>Cart</Link>
          </div>

          {/* Account */}
          <div>
            <h4 style={colTitleStyle}>Account</h4>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
            <Link to="/my-orders" style={linkStyle}>My Orders</Link>
          </div>

          {/* Support */}
          <div>
            <h4 style={colTitleStyle}>Support</h4>
            <p style={linkStyle}>help@markit.com</p>
            <p style={linkStyle}>+91 98765 43210</p>
            <p style={linkStyle}>Mumbai, India</p>
          </div>
        </div>

        <div style={bottomStyle}>
          <p>© {new Date().getFullYear()} MARKIT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

const footerStyle = {
  background: "#0a0a18",
  borderTop: "1px solid rgba(148, 163, 184, 0.1)",
  padding: "60px 0 0",
};

const innerStyle = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 20px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 40,
  paddingBottom: 40,
};

const brandStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 12,
};

const brandTextStyle = {
  fontSize: "1.3rem",
  fontWeight: 800,
  background: "linear-gradient(135deg, #F97316, #FBBF24)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const taglineStyle = {
  color: "#64748b",
  fontSize: "0.9rem",
  lineHeight: 1.6,
  marginBottom: 16,
};

const socialStyle = {
  display: "flex",
  gap: 12,
};

const socialIconStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: 10,
  background: "rgba(249, 115, 22, 0.1)",
  color: "#F97316",
  transition: "all 0.2s ease",
};

const colTitleStyle = {
  fontSize: "0.85rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 1,
  color: "#f1f5f9",
  marginBottom: 16,
};

const linkStyle = {
  display: "block",
  color: "#64748b",
  fontSize: "0.9rem",
  marginBottom: 10,
  textDecoration: "none",
  transition: "color 0.2s",
};

const bottomStyle = {
  borderTop: "1px solid rgba(148, 163, 184, 0.1)",
  padding: "20px 0",
  textAlign: "center",
  color: "#475569",
  fontSize: "0.85rem",
};

export default Footer;