import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiPhone, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

function Checkout() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ address: "", city: "", state: "", pinCode: "", phoneNo: "" });

  useEffect(() => { fetchCart(); }, []);

  const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { address, city, state, pinCode, phoneNo } = form;
    if (!address || !city || !state || !pinCode || !phoneNo) { toast.error("Please fill all fields"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/order/new", { shippingInfo: form });
      if (data.success) {
        toast.success("Order placed successfully!");
        await fetchCart();
        navigate("/my-orders");
      }
    } catch (err) { toast.error(err.response?.data?.message || "Failed to place order"); }
    finally { setLoading(false); }
  };

  if (cart.length === 0) return <div className="page"><div className="container"><div className="empty-state"><h2>Cart is empty</h2><p>Add items before checkout</p></div></div></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>Checkout</h1><p>Complete your order</p></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "start" }} className="cart-layout">
          <form onSubmit={handleSubmit} id="checkout-form">
            <div style={{ padding: 28, background: "#16213e", borderRadius: 20, border: "1px solid rgba(148,163,184,0.12)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><FiMapPin /> Shipping Address</h3>
              <div className="form-group"><label className="form-label">Address</label><input name="address" className="form-input" value={form.address} onChange={handleChange} placeholder="Street address" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group"><label className="form-label">City</label><input name="city" className="form-input" value={form.city} onChange={handleChange} placeholder="City" /></div>
                <div className="form-group"><label className="form-label">State</label><input name="state" className="form-input" value={form.state} onChange={handleChange} placeholder="State" /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group"><label className="form-label">Pin Code</label><input name="pinCode" className="form-input" value={form.pinCode} onChange={handleChange} placeholder="Pin code" /></div>
                <div className="form-group"><label className="form-label"><FiPhone size={14} style={{ marginRight: 4 }} />Phone</label><input name="phoneNo" className="form-input" value={form.phoneNo} onChange={handleChange} placeholder="Phone number" /></div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 20 }} id="place-order-btn">
              {loading ? "Placing Order..." : <><FiCheck size={18} /> Place Order — ₹{total.toLocaleString()}</>}
            </button>
          </form>
          {/* Summary */}
          <div style={{ padding: 28, background: "#16213e", borderRadius: 20, border: "1px solid rgba(148,163,184,0.12)", position: "sticky", top: 90 }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>Order Summary</h3>
            {cart.map((item) => (
              <div key={item.product?._id || item._id} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
                <img src={item.product?.image?.url || "/logo1.png"} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f1f5f9" }}>{item.product?.name}</p>
                  <p style={{ fontSize: "0.8rem", color: "#64748b" }}>Qty: {item.quantity}</p>
                </div>
                <span style={{ fontWeight: 700, color: "#FBBF24", fontSize: "0.9rem" }}>₹{((item.product?.price || 0) * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <hr style={{ border: "none", borderTop: "1px solid rgba(148,163,184,0.15)", margin: "16px 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "0.9rem" }}><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "0.9rem" }}><span>Tax (18%)</span><span>₹{tax.toLocaleString()}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "0.9rem" }}><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
              <hr style={{ border: "none", borderTop: "1px solid rgba(148,163,184,0.15)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, color: "#f1f5f9" }}><span>Total</span><span style={{ color: "#FBBF24" }}>₹{total.toLocaleString()}</span></div>
            </div>
            <p style={{ textAlign: "center", marginTop: 16, fontSize: "0.8rem", color: "#64748b" }}>Payment: Cash on Delivery</p>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.cart-layout{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
export default Checkout;