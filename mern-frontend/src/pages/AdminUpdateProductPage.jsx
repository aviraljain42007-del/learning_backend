import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  updateProduct,
} from "../services/productService";

function AdminUpdateProductPage() {
  const navigate = useNavigate();
  const { productId } = useParams();

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

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  async function loadProduct() {
    try {
      setLoading(true);
      setError("");

      const data = await getProductById(productId);
      const product = data.product;

      if (!product) {
        setError("Product not found");
        return;
      }

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        stock: product.stock || "",
        discount: product.discount || "",
      });

      setImagePreview(product.image?.url || product.image || "");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load product"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProduct();
  }, [productId]);

  function handleChange(event) {
    const { name, value } = event.target;

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

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setUpdating(true);
      setError("");

      const productFormData = new FormData();

      productFormData.append("name", formData.name);
      productFormData.append("description", formData.description);
      productFormData.append("price", formData.price);
      productFormData.append("category", formData.category);
      productFormData.append("stock", formData.stock);
      productFormData.append("discount", formData.discount || 0);

      if (image) {
        productFormData.append("image", image);
      }

      const updated = await updateProduct(productId, productFormData);
      console.log(updated.product)
      navigate("/admin/products");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update product"
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <main className="page-container">
        <p className="status-text">Loading product...</p>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="page-header">
        <h1>Update Product</h1>
        <p>Edit product details</p>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
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
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
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
            />
          </div>

          <div className="form-group">
            <label>Discount</label>
            <input
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Change Product Image</label>
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

        <button type="submit" className="auth-btn" disabled={updating}>
          {updating ? "Updating..." : "Update Product"}
        </button>
      </form>
    </main>
  );
}

export default AdminUpdateProductPage;