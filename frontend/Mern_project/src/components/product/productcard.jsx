import { Link } from "react-router-dom";
import { FiStar, FiShoppingCart } from "react-icons/fi";

function ProductCard({ product }) {
  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FiStar
          key={i}
          size={14}
          fill={i < full ? "#FBBF24" : "transparent"}
          color={i < full ? "#FBBF24" : "#64748b"}
        />
      );
    }
    return stars;
  };

  return (
    <Link to={`/products/${product._id}`} style={cardStyle} id={`product-${product._id}`}>
      <div style={imageWrapStyle}>
        <img
          src={product.image?.url || "/logo1.png"}
          alt={product.name}
          style={imageStyle}
        />
        {product.stock <= 0 && <span style={outOfStockStyle}>Out of Stock</span>}
      </div>

      <div style={bodyStyle}>
        <p style={categoryStyle}>{product.category}</p>
        <h3 style={nameStyle}>{product.name}</h3>

        <div style={ratingRowStyle}>
          <div style={{ display: "flex", gap: 2 }}>{renderStars(product.ratings || 0)}</div>
          <span style={reviewCountStyle}>({product.numOfReviews || 0})</span>
        </div>

        <div style={bottomRowStyle}>
          <span style={priceStyle}>₹{product.price?.toLocaleString()}</span>
          <span style={cartIconStyle}>
            <FiShoppingCart size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}

const cardStyle = {
  display: "block",
  background: "rgba(22, 33, 62, 0.7)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(148, 163, 184, 0.12)",
  borderRadius: 16,
  overflow: "hidden",
  textDecoration: "none",
  transition: "all 0.3s ease",
  cursor: "pointer",
};

const imageWrapStyle = {
  position: "relative",
  width: "100%",
  height: 220,
  overflow: "hidden",
  background: "#1e2a4a",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.4s ease",
};

const outOfStockStyle = {
  position: "absolute",
  top: 12,
  right: 12,
  padding: "4px 12px",
  background: "rgba(239, 68, 68, 0.9)",
  color: "#fff",
  fontSize: "0.75rem",
  fontWeight: 600,
  borderRadius: 999,
};

const bodyStyle = {
  padding: "16px 20px 20px",
};

const categoryStyle = {
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: 1,
  color: "#F97316",
  marginBottom: 6,
};

const nameStyle = {
  fontSize: "1rem",
  fontWeight: 600,
  color: "#f1f5f9",
  marginBottom: 8,
  lineHeight: 1.4,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const ratingRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  marginBottom: 12,
};

const reviewCountStyle = {
  fontSize: "0.8rem",
  color: "#64748b",
};

const bottomRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const priceStyle = {
  fontSize: "1.2rem",
  fontWeight: 800,
  color: "#FBBF24",
};

const cartIconStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: 10,
  background: "rgba(249, 115, 22, 0.15)",
  color: "#F97316",
  transition: "all 0.2s ease",
};

export default ProductCard;
