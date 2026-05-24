import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  createProductReview,
  getProductById,
} from "../services/productService";

import { addToCartThunk } from "../redux/slices/cartSlice";
import { selectUser } from "../redux/slices/authSlice";

function ProductDetailsPage() {
  const { productId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  async function loadProduct() {
    try {
      setLoading(true);
      setError("");

      const data = await getProductById(productId);

      setProduct(data.product || null);
      setQuantity(1);
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

  function increaseQuantity() {
    setQuantity((prev) => {
      if (!product) return prev;

      return Math.min(prev + 1, product.stock);
    });
  }

  function decreaseQuantity() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

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
          quantity,
        })
      ).unwrap();

      setCartMessage("Product added to cart successfully");
    } catch (error) {
      setCartError(error || "Failed to add product to cart");
    } finally {
      setAddingToCart(false);
    }
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();

    if (!user) {
      navigate("/login", {
        state: {
          from: location.pathname,
        },
      });

      return;
    }

    if (!reviewRating || !reviewComment.trim()) {
      setReviewError("Rating and comment are required");
      return;
    }

    try {
      setReviewLoading(true);
      setReviewError("");
      setReviewMessage("");

      await createProductReview(product._id, {
        rating: Number(reviewRating),
        comment: reviewComment.trim(),
      });

      setReviewMessage("Review submitted successfully");
      setReviewComment("");
      setReviewRating(5);

      await loadProduct();
    } catch (error) {
      setReviewError(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit review"
      );
    } finally {
      setReviewLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="page-container">
        <p className="status-text">Loading product...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <p className="error-text">{error}</p>

        <button className="retry-btn" onClick={loadProduct}>
          Try Again
        </button>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="page-container">
        <p className="status-text">Product not found</p>

        <Link to="/" className="details-link">
          Back to products
        </Link>
      </main>
    );
  }

  const imageUrl =
    product.image?.url ||
    product.image ||
    "https://via.placeholder.com/500x400?text=Product";

  const reviews = product.reviews || [];

  return (
    <main className="product-details-page">
      <Link to="/" className="back-link">
        ← Back to Products
      </Link>

      <section className="product-details">
        <div className="product-details-image-box">
          <img
            src={imageUrl}
            alt={product.name}
            className="product-details-image"
          />
        </div>

        <div className="product-details-info">
          <p className="product-category">{product.category}</p>

          <h1>{product.name}</h1>

          <p className="product-price">₹{product.price}</p>

          {product.discount > 0 && (
            <p className="product-discount">
              Discount: ₹{product.discount}
            </p>
          )}

          <p>Rating: {product.rating || 0}</p>

          <p className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          {product.description && (
            <p className="product-description">{product.description}</p>
          )}

          {product.stock > 0 && (
            <div className="quantity-row">
              <button onClick={decreaseQuantity} disabled={quantity === 1}>
                -
              </button>

              <span>{quantity}</span>

              <button
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          )}

          {cartMessage && <p className="success-text">{cartMessage}</p>}

          {cartError && <p className="error-text">{cartError}</p>}

          <button
            className="add-btn"
            disabled={product.stock === 0 || addingToCart}
            onClick={handleAddToCart}
          >
            {addingToCart
              ? "Adding..."
              : product.stock > 0
              ? "Add to Cart"
              : "Out of Stock"}
          </button>

          {cartMessage && (
            <Link to="/cart" className="details-link">
              View Cart
            </Link>
          )}
        </div>
      </section>

      <section className="reviews-section">
        <div className="reviews-header">
          <h2>Reviews</h2>
          <p>{reviews.length} review(s)</p>
        </div>

        {reviews.length === 0 ? (
          <p className="status-text">No reviews yet.</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <article key={review._id} className="review-card">
                <div className="review-top">
                  <strong>{review.name || review.user?.name || "User"}</strong>
                  <span>Rating: {review.rating}</span>
                </div>

                <p>{review.comment}</p>
              </article>
            ))}
          </div>
        )}

        <div className="review-form-box">
          <h3>Write a Review</h3>

          {!user && (
            <p className="status-text">
              Please <Link to="/login">login</Link> to write a review.
            </p>
          )}

          {user && (
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Rating</label>

                <select
                  value={reviewRating}
                  onChange={(event) => setReviewRating(event.target.value)}
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Average</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>

              <div className="form-group">
                <label>Comment</label>

                <textarea
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  placeholder="Write your review..."
                  rows="4"
                />
              </div>

              {reviewError && <p className="error-text">{reviewError}</p>}

              {reviewMessage && (
                <p className="success-text">{reviewMessage}</p>
              )}

              <button
                type="submit"
                className="auth-btn"
                disabled={reviewLoading}
              >
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export default ProductDetailsPage;