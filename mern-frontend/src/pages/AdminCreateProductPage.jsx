import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/productService";

function AdminCreateProductPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    discount: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    console.log(value)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    
  }

  function validateForm() {
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.stock
    ) {
      return "All fields are required";
    }


    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const productFormData = new FormData();

      productFormData.append("name", formData.name);
      productFormData.append("description", formData.description);
      productFormData.append("price", formData.price);
      productFormData.append("category", formData.category);
      productFormData.append("stock", formData.stock);
      productFormData.append("discount", formData.discount || 0);
      productFormData.append("image", image);

      await createProduct(productFormData);

      navigate("/admin/products");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-page">
      <div className="page-header">
        <h1>Create Product</h1>
        <p>Add a new product to your store</p>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product name"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description"
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Stock"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <input
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
            />
          </div>

          <div className="form-group">
            <label>Discount</label>
            <input
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Discount"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="admin-image-preview"
          />
        )}

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </main>
  );
}

export default AdminCreateProductPage;