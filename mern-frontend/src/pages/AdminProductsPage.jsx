import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, getProducts } from "../services/productService";

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts({
        limit: 100,
      });

      setProducts(data.products || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(productId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(productId);

      await deleteProduct(productId);

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete product"
      );
    } finally {
      setDeletingId("");
    }
  }

  if (loading) {
    return (
      <main className="page-container">
        <p className="status-text">Loading admin products...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <p className="error-text">{error}</p>

        <button className="retry-btn" onClick={loadProducts}>
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Products</h1>
          <p>Manage store products</p>
        </div>

        <Link to="/admin/products/create" className="admin-primary-link">
          Create Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="status-text">No products found.</p>
      ) : (
        <section className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const imageUrl =
                  product.image?.url ||
                  product.image ||
                  "https://via.placeholder.com/80x60?text=Product";

                return (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="admin-product-image"
                      />
                    </td>

                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>₹{product.price}</td>
                    <td>{product.stock}</td>

                    <td>
                      <div className="admin-actions">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="edit-link"
                        >
                          Edit
                        </Link>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                        >
                          {deletingId === product._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}

export default AdminProductsPage;