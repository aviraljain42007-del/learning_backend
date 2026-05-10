import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api/axios";

function CreateProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", stock: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.category || !form.stock) { toast.error("Fill all fields"); return; }
    if (!image) { toast.error("Please select an image"); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append("image", image);
      await api.post("/add-product", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Product created!");
      navigate("/admin/products");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="page-header"><h1>Create Product</h1></div>
        <form onSubmit={handleSubmit} style={{ padding: 32, background: "#16213e", borderRadius: 20, border: "1px solid rgba(148,163,184,0.12)" }}>
          <div className="form-group"><label className="form-label">Name</label><input name="name" className="form-input" value={form.name} onChange={handleChange} placeholder="Product name" /></div>
          <div className="form-group"><label className="form-label">Description</label><textarea name="description" className="form-input" rows={3} value={form.description} onChange={handleChange} placeholder="Product description" style={{ resize: "vertical" }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group"><label className="form-label">Price (₹)</label><input name="price" type="number" className="form-input" value={form.price} onChange={handleChange} placeholder="0" /></div>
            <div className="form-group"><label className="form-label">Stock</label><input name="stock" type="number" className="form-input" value={form.stock} onChange={handleChange} placeholder="0" /></div>
          </div>
          <div className="form-group"><label className="form-label">Category</label><input name="category" className="form-input" value={form.category} onChange={handleChange} placeholder="e.g. Electronics" /></div>
          <div className="form-group">
            <label className="form-label">Image</label>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 32, background: "#1e2a4a", border: "2px dashed rgba(148,163,184,0.2)", borderRadius: 12, cursor: "pointer", color: "#94a3b8" }}>
              <FiUpload size={20} /> {image ? image.name : "Click to upload image"}
              <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
            </label>
            {preview && <img src={preview} alt="Preview" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 12, marginTop: 12 }} />}
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>{loading ? "Creating..." : "Create Product"}</button>
        </form>
      </div>
    </div>
  );
}
export default CreateProduct;