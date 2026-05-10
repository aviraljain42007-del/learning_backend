import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", stock: "" });

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/get-product/${id}`);
        if (data.success) {
          const p = data.product;
          setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock });
        }
      } catch { toast.error("Failed to load product"); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/update-product/${id}`, form);
      toast.success("Product updated!");
      navigate("/admin/products");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="page-header"><h1>Edit Product</h1></div>
        <form onSubmit={handleSubmit} style={{ padding: 32, background: "#16213e", borderRadius: 20, border: "1px solid rgba(148,163,184,0.12)" }}>
          <div className="form-group"><label className="form-label">Name</label><input name="name" className="form-input" value={form.name} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">Description</label><textarea name="description" className="form-input" rows={3} value={form.description} onChange={handleChange} style={{ resize: "vertical" }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group"><label className="form-label">Price (₹)</label><input name="price" type="number" className="form-input" value={form.price} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Stock</label><input name="stock" type="number" className="form-input" value={form.stock} onChange={handleChange} /></div>
          </div>
          <div className="form-group"><label className="form-label">Category</label><input name="category" className="form-input" value={form.category} onChange={handleChange} /></div>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: "100%" }}>{saving ? "Saving..." : "Update Product"}</button>
        </form>
      </div>
    </div>
  );
}
export default EditProduct;