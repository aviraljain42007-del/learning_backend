import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Cart() {
  const { cart, cartLoading, fetchCart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) fetchCart(); }, [user]);

  const handleUpdateQty = async (productId, qty) => {
    if (qty < 1) return;
    try { await updateQuantity(productId, qty); } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleRemove = async (productId) => {
    try { await removeFromCart(productId); toast.success("Removed from cart"); } catch { toast.error("Failed to remove"); }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  if (cartLoading) return <div className="spinner-container"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>Shopping Cart</h1><p>{cart.length} item{cart.length !== 1 ? "s" : ""} in your cart</p></div>
        {cart.length === 0 ? (
          <div className="empty-state">
            <div className="icon"><FiShoppingBag size={64} /></div>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "start" }} className="cart-layout">
            {/* Cart Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cart.map((item) => (
                <div key={item.product?._id || item._id} style={{ display: "flex", gap: 16, padding: 20, background: "#16213e", borderRadius: 16, border: "1px solid rgba(148,163,184,0.1)", alignItems: "center" }}>
                  <img src={item.product?.image?.url || "/logo1.png"} alt={item.product?.name} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 12, background: "#1e2a4a" }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#f1f5f9", marginBottom: 4 }}>{item.product?.name || "Product"}</h3>
                    <p style={{ fontSize: "0.85rem", color: "#64748b" }}>{item.product?.category}</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FBBF24", marginTop: 4 }}>₹{item.product?.price?.toLocaleString()}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 0, background: "#1e2a4a", borderRadius: 10, border: "1px solid rgba(148,163,184,0.15)" }}>
                    <button onClick={() => handleUpdateQty(item.product?._id, item.quantity - 1)} disabled={item.quantity <= 1} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", color: "#f1f5f9", cursor: "pointer" }}><FiMinus size={14} /></button>
                    <span style={{ width: 32, textAlign: "center", fontWeight: 700, color: "#f1f5f9", fontSize: "0.9rem" }}>{item.quantity}</span>
                    <button onClick={() => handleUpdateQty(item.product?._id, item.quantity + 1)} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", color: "#f1f5f9", cursor: "pointer" }}><FiPlus size={14} /></button>
                  </div>
                  <button onClick={() => handleRemove(item.product?._id)} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(239,68,68,0.1)", border: "none", borderRadius: 10, color: "#ef4444", cursor: "pointer" }}><FiTrash2 size={16} /></button>
                </div>
              ))}
            </div>
            {/* Summary */}
            <div style={{ padding: 28, background: "#16213e", borderRadius: 20, border: "1px solid rgba(148,163,184,0.12)", position: "sticky", top: 90 }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 20 }}>Order Summary</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}><span>Tax (18%)</span><span>₹{tax.toLocaleString()}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
                <hr style={{ border: "none", borderTop: "1px solid rgba(148,163,184,0.15)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 800, color: "#f1f5f9" }}><span>Total</span><span style={{ color: "#FBBF24" }}>₹{total.toLocaleString()}</span></div>
              </div>
              <button onClick={() => navigate("/checkout")} className="btn btn-primary" style={{ width: "100%" }} id="checkout-btn">
                Checkout <FiArrowRight size={16} />
              </button>
              {shipping > 0 && <p style={{ textAlign: "center", marginTop: 12, fontSize: "0.8rem", color: "#64748b" }}>Free shipping on orders over ₹500</p>}
            </div>
          </div>
        )}
      </div>
      <style>{`@media(max-width:768px){.cart-layout{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
export default Cart;