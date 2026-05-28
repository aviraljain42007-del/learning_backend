import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCartThunk,
  removeCartItemThunk,
  selectCartError,
  selectCartItems,
  selectCartLoading,
  selectCartTotal,
  selectCartTotalQuantity,
  selectUpdatingItemId,
  updateCartItemThunk,
} from "../redux/slices/cartSlice";

function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const updatingItemId = useSelector(selectUpdatingItemId);
  const cartTotal = useSelector(selectCartTotal);
  const totalQuantity = useSelector(selectCartTotalQuantity);

  useEffect(() => {
    dispatch(fetchCartThunk());
  }, []);

  function getProductFromItem(item) {
    return item.product;
  }

  async function handleIncrease(item) {
    const product = getProductFromItem(item);
    

    if (!product) return;

    const currentQuantity = item.quantity;
    const stock = product.stock;

    if (currentQuantity >= stock) return;

    await dispatch(
      updateCartItemThunk({
        productId: product._id,
        quantity: currentQuantity + 1,
      })
    );
  }

  async function handleDecrease(item) {
    const product = getProductFromItem(item);

    if (!product) return;

    const currentQuantity = item.quantity;

    if (currentQuantity <= 1) return;

    await dispatch(
      updateCartItemThunk({
        productId: product._id,
        quantity: currentQuantity - 1,
      })
    );
  }

  async function handleRemove(item) {
    const product = getProductFromItem(item);

    if (!product) return;

    await dispatch(removeCartItemThunk(product._id));
  }

  function handleCheckout() {
    navigate("/checkout");
  }

  if (loading) {
    return (
      <main className="page-container">
        <p className="status-text">Loading cart...</p>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <h1>Your Cart</h1>

        {error && <p className="error-text">{error}</p>}

        <p className="status-text">Your cart is empty.</p>

        <Link to="/" className="details-link">
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="page-header">
        <h1>Your Cart</h1>
        <p>{cartItems.length} product(s) in your cart</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <section className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => {
            const product = getProductFromItem(item);

            if (!product) return null;

            const imageUrl = product.image.url

            const isUpdating = updatingItemId === product._id;

            return (
              <article key={product._id} className="cart-item">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="cart-item-image"
                />

                <div className="cart-item-info">
                  <Link to={`/products/${product._id}`}>
                    <h3>{product.name}</h3>
                  </Link>

                  <p>Price: ₹{product.price}</p>

                  <p
                    className={
                      product.stock > 0 ? "in-stock" : "out-of-stock"
                    }
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </p>

                  <div className="quantity-row">
                    <button
                      onClick={() => handleDecrease(item)}
                      disabled={item.quantity === 1 || isUpdating}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => handleIncrease(item)}
                      disabled={item.quantity >= product.stock || isUpdating}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Remove"}
                  </button>
                </div>

                <div className="cart-item-total">
                  ₹{product.price * item.quantity}
                </div>
              </article>
            );
          })}
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Total Products</span>
            <span>{cartItems.length}</span>
          </div>

          <div className="summary-row">
            <span>Total Quantity</span>
            <span>{totalQuantity}</span>
          </div>

          <div className="summary-row total-row">
            <span>Total</span>
            <strong>₹{cartTotal}</strong>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </aside>
      </section>
    </main>
  );
}

export default CartPage;