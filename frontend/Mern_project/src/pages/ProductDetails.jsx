import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiStar, FiShoppingCart, FiMinus, FiPlus, FiPackage } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => { fetchProduct(); }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/get-product/${id}`);
      if (data.success) setProduct(data.product);
    } catch { toast.error("Failed to load product"); }
    finally { setLoading(false); }
  };

  const handleAddToCart = async () => {
    if (!user) { toast.error("Please login first"); return; }
    setAdding(true);
    try {
      await addToCart(id, qty);
      toast.success("Added to cart!");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setAdding(false); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login first"); return; }
    setReviewLoading(true);
    try {
      await api.put(`/add-product/${id}`, { rating, coomment: comment });
      toast.success("Review submitted!");
      setComment("");
      fetchProduct();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setReviewLoading(false); }
  };

  const renderStars = (r) => Array.from({ length: 5 }, (_, i) => (
    <FiStar key={i} size={16} fill={i < Math.floor(r) ? "#FBBF24" : "transparent"} color={i < Math.floor(r) ? "#FBBF24" : "#64748b"} />
  ));

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;
  if (!product) return <div className="page"><div className="container"><div className="empty-state"><h2>Product not found</h2></div></div></div>;

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 60 }} className="product-detail-grid">
          {/* Image */}
          <div style={{ borderRadius: 20, overflow: "hidden", background: "#1e2a4a", border: "1px solid rgba(148,163,184,0.12)", aspectRatio: "1" }}>
            <img src={product.image?.url || "/logo1.png"} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "#F97316", marginBottom: 8 }}>{product.category}</span>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 12, color: "#f1f5f9" }}>{product.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 2 }}>{renderStars(product.ratings || 0)}</div>
              <span style={{ color: "#64748b", fontSize: "0.9rem" }}>({product.numOfReviews} reviews)</span>
            </div>
            <p style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FBBF24", marginBottom: 20 }}>₹{product.price?.toLocaleString()}</p>
            <p style={{ color: "#94a3b8", lineHeight: 1.7, marginBottom: 24 }}>{product.description}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <FiPackage size={18} color={product.stock > 0 ? "#22c55e" : "#ef4444"} />
              <span style={{ color: product.stock > 0 ? "#22c55e" : "#ef4444", fontWeight: 600 }}>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
            </div>
            {product.stock > 0 && (
              <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 0, background: "#1e2a4a", borderRadius: 12, border: "1px solid rgba(148,163,184,0.15)" }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", color: "#f1f5f9", cursor: "pointer" }}><FiMinus /></button>
                  <span style={{ width: 44, textAlign: "center", fontWeight: 700, color: "#f1f5f9" }}>{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", color: "#f1f5f9", cursor: "pointer" }}><FiPlus /></button>
                </div>
                <button onClick={handleAddToCart} disabled={adding} className="btn btn-primary btn-lg" id="add-to-cart-btn">
                  {adding ? "Adding..." : <><FiShoppingCart size={18} /> Add to Cart</>}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div style={{ maxWidth: 700 }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 24, color: "#f1f5f9" }}>Reviews</h2>
          {user && (
            <form onSubmit={handleReview} style={{ padding: 24, background: "#16213e", borderRadius: 16, border: "1px solid rgba(148,163,184,0.12)", marginBottom: 32 }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16, color: "#f1f5f9" }}>Write a Review</h3>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setRating(s)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                      <FiStar size={24} fill={s <= rating ? "#FBBF24" : "transparent"} color={s <= rating ? "#FBBF24" : "#64748b"} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Comment</label>
                <textarea className="form-input" rows={3} value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..." style={{ resize: "vertical" }} />
              </div>
              <button type="submit" className="btn btn-primary btn-sm" disabled={reviewLoading}>{reviewLoading ? "Submitting..." : "Submit Review"}</button>
            </form>
          )}
          {product.reviews?.length > 0 ? product.reviews.map((rev, i) => (
            <div key={i} style={{ padding: 20, background: "#16213e", borderRadius: 14, border: "1px solid rgba(148,163,184,0.1)", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 600, color: "#f1f5f9" }}>{rev.name}</span>
                <div style={{ display: "flex", gap: 2 }}>{renderStars(rev.rating)}</div>
              </div>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{rev.comment}</p>
            </div>
          )) : <p style={{ color: "#64748b" }}>No reviews yet. Be the first!</p>}
        </div>
      </div>
      <style>{`@media(max-width:768px){.product-detail-grid{grid-template-columns:1fr!important;gap:24px!important}}`}</style>
    </div>
  );
}
export default ProductDetails;