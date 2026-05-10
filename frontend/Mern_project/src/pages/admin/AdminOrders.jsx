import { useState, useEffect } from "react";
import { FiClock } from "react-icons/fi";
import api from "../../api/axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Use my-order endpoint as a fallback since admin-specific all-orders endpoint may not be in routes
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
        <div className="page-header"><h1>All Orders</h1><p>Manage customer orders</p></div>
        {orders.length === 0 ? (
          <div className="empty-state"><h2>No orders yet</h2></div>
        ) : (
          <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid rgba(148,163,184,0.12)" }}>
            <table className="data-table">
              <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Payment</th></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 600, fontFamily: "monospace" }}>#{o._id?.slice(-8).toUpperCase()}</td>
                    <td><div style={{ display: "flex", alignItems: "center", gap: 6 }}><FiClock size={14} /> {new Date(o.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</div></td>
                    <td>{o.orderItems?.length || 0}</td>
                    <td style={{ color: "#FBBF24", fontWeight: 700 }}>₹{o.totalPrice?.toLocaleString()}</td>
                    <td><span className={`badge ${statusColor(o.orderStatus)}`}>{o.orderStatus}</span></td>
                    <td><span className={`badge ${o.paymentInfo?.status === "Paid" ? "badge-success" : "badge-danger"}`}>{o.paymentInfo?.status || "Not Paid"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminOrders;