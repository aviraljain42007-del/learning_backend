import { useState, useEffect } from "react";
import { FiPackage, FiClock } from "react-icons/fi";
import api from "../api/axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/my-order");
        if (data.success) setOrders(data.orders || []);
      } catch { setOrders([]); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  const statusColor = (s) => {
    if (s === "Delivered") return "badge-success";
    if (s === "Shipped") return "badge-info";
    if (s === "Processing") return "badge-warning";
    return "badge-orange";
  };

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>My Orders</h1><p>Track and manage your orders</p></div>
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="icon"><FiPackage size={64} /></div>
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {orders.map((order) => (
              <div key={order._id} style={{ padding: 24, background: "#16213e", borderRadius: 16, border: "1px solid rgba(148,163,184,0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: 4 }}>Order #{order._id?.slice(-8).toUpperCase()}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: "0.85rem" }}>
                      <FiClock size={14} /> {new Date(order.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className={`badge ${statusColor(order.orderStatus)}`}>{order.orderStatus}</span>
                    <span className={`badge ${order.paymentInfo?.status === "Paid" ? "badge-success" : "badge-danger"}`}>{order.paymentInfo?.status || "Not Paid"}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {order.orderItems?.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(30,42,74,0.5)", borderRadius: 10 }}>
                      <div>
                        <span style={{ color: "#f1f5f9", fontWeight: 500, fontSize: "0.9rem" }}>{item.name}</span>
                        <span style={{ color: "#64748b", fontSize: "0.85rem", marginLeft: 8 }}>× {item.quantity}</span>
                      </div>
                      <span style={{ color: "#FBBF24", fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(148,163,184,0.1)" }}>
                  <span style={{ color: "#94a3b8" }}>Total</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FBBF24" }}>₹{order.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default MyOrders;