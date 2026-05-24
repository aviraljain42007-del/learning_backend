import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { addToCartThunk } from "../redux/slices/cartSlice";
import { selectUser } from "../redux/slices/authSlice";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

  const imageUrl =
    product.image?.url ||
    product.image ||
    "https://via.placeholder.com/250x180?text=Product";

  async function handleAddToCart() {
    if (!user) {
      navigate("/login", {
        state: {
          from: location.pathname,
        },
      });

      return;
    }

    if (!product || product.stock === 0) {
      return;
    }

    try {
      setAddingToCart(true);
      setCartMessage("");
      setCartError("");

      await dispatch(
        addToCartThunk({
          productId: product._id,
          quantity: 1,
        })
      ).unwrap();

      setCartMessage("Added to cart");
    } catch (error) {
      setCartError(error || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  }

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`}>
        <img
          src={imageUrl}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
      </Link>

      <div className="product-info">
        <p className="product-category">{product.category}</p>

        <h3>{product.name}</h3>

        <p className="product-price">₹{product.price}</p>

        {product.discount > 0 && (
          <p className="product-discount">Discount: ₹{product.discount}</p>
        )}

        <p>Rating: {product.rating || 0}</p>

        <p className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        {cartMessage && <p className="success-text">{cartMessage}</p>}

        {cartError && <p className="error-text">{cartError}</p>}

        <Link to={`/products/${product._id}`} className="details-link">
          View Details
        </Link>

        <button
          type="button"
          disabled={product.stock === 0 || addingToCart}
          onClick={handleAddToCart}
          className="add-btn"
        >
          {addingToCart
            ? "Adding..."
            : product.stock > 0
            ? "Add to Cart"
            : "Out of Stock"}
        </button>

        {cartMessage && (
          <Link to="/cart" className="details-link">
            Go to Cart
          </Link>
        )}
      </div>
    </article>
  );
}

export default ProductCard;