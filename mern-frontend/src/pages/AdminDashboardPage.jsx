import { Link } from "react-router-dom";

function AdminDashboardPage() {
  return (
    <main className="admin-page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage products and orders</p>
      </div>

      <div className="admin-dashboard-links">
        <Link to="/admin/products" className="admin-dashboard-card">
          <h2>Products</h2>
          <p>Create, update and delete products</p>
        </Link>

        <Link to="/admin/orders" className="admin-dashboard-card">
          <h2>Orders</h2>
          <p>Manage user orders</p>
        </Link>
      </div>
    </main>
  );
}

export default AdminDashboardPage;