import { Link } from "react-router-dom";
import { FiPackage, FiShoppingBag, FiGrid } from "react-icons/fi";

function Dashboard() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>Admin Dashboard</h1><p>Manage your store</p></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          <Link to="/admin/products" style={cardStyle}>
            <div style={iconStyle}><FiShoppingBag size={28} /></div>
            <h3 style={cardTitleStyle}>Products</h3>
            <p style={cardDescStyle}>Manage your product catalog</p>
          </Link>
          <Link to="/admin/products/create" style={cardStyle}>
            <div style={{ ...iconStyle, background: "rgba(34,197,94,0.12)", color: "#22c55e" }}><FiGrid size={28} /></div>
            <h3 style={cardTitleStyle}>Add Product</h3>
            <p style={cardDescStyle}>Create a new product listing</p>
          </Link>
          <Link to="/admin/orders" style={cardStyle}>
            <div style={{ ...iconStyle, background: "rgba(251,191,36,0.12)", color: "#FBBF24" }}><FiPackage size={28} /></div>
            <h3 style={cardTitleStyle}>Orders</h3>
            <p style={cardDescStyle}>View and manage all orders</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
const cardStyle = { display: "block", padding: 32, background: "#16213e", borderRadius: 20, border: "1px solid rgba(148,163,184,0.12)", textDecoration: "none", transition: "all 0.3s", cursor: "pointer" };
const iconStyle = { width: 56, height: 56, borderRadius: 14, background: "rgba(249,115,22,0.12)", color: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 };
const cardTitleStyle = { fontSize: "1.2rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 6 };
const cardDescStyle = { color: "#64748b", fontSize: "0.9rem" };
export default Dashboard;