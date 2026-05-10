import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api/axios";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/get-allproducts?page=1");
      if (data.success) setProducts(data.products || []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/delete-product/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div><h1 style={{ fontSize: "1.8rem", fontWeight: 800, background: "linear-gradient(135deg,#F97316,#FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Admin Products</h1></div>
          <Link to="/admin/products/create" className="btn btn-primary"><FiPlus size={16} /> Add Product</Link>
        </div>
        {products.length === 0 ? (
          <div className="empty-state"><h2>No products</h2><Link to="/admin/products/create" className="btn btn-primary">Create First Product</Link></div>
        ) : (
          <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid rgba(148,163,184,0.12)" }}>
            <table className="data-table">
              <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td><img src={p.image?.url || "/logo1.png"} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} /></td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td style={{ color: "#FBBF24", fontWeight: 700 }}>₹{p.price?.toLocaleString()}</td>
                    <td><span className={`badge ${p.stock > 0 ? "badge-success" : "badge-danger"}`}>{p.stock}</span></td>
                    <td>{p.category}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Link to={`/admin/products/edit/${p._id}`} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}><FiEdit size={16} /></Link>
                        <button onClick={() => handleDelete(p._id)} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "none", cursor: "pointer" }}><FiTrash2 size={16} /></button>
                      </div>
                    </td>
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
export default AdminProducts;