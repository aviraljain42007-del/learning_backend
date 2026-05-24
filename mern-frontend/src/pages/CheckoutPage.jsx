import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { createOrder } from "../services/orderService";

import {
  fetchCartThunk,
  resetCartState,
  selectCartItems,
  selectCartLoading,
} from "../redux/slices/cartSlice";

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const loading = useSelector(selectCartLoading);

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phoneNo: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchCartThunk());
  }, [dispatch]);

  function getProductFromItem(item) {
    return item.product || item.productId;
  }

  function handleAddressChange(event) {
    const { name, value } = event.target;

    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  }

  function validateCheckout() {
    if (cartItems.length === 0) {
      return "Your cart is empty";
    }

    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pinCode ||
      !shippingAddress.phoneNo
    ) {
      return "All shipping fields are required";
    }

    if (shippingAddress.phoneNo.length < 10) {
      return "Please enter a valid phone number";
    }

    return "";
  }

  const itemsPrice = cartItems.reduce((total, item) => {
    const product = getProductFromItem(item);

    return total + (product?.price || 0) * item.quantity;
  }, 0);

  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  async function handlePlaceOrder(event) {
    event.preventDefault();

    const validationError = validateCheckout();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const orderData = {
        shippingAddress,
        paymentMethod,
      };

      const data = await createOrder(orderData);

      dispatch(resetCartState());

      const orderId =
        data.order?._id ||
        data.newOrder?._id ||
        data.createdOrder?._id ||
        data.orderId;

      if (orderId) {
        navigate(`/orders/${orderId}`);
      } else {
        navigate("/orders");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to place order"
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <main className="page-container">
        <p className="status-text">Loading checkout...</p>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <h1>Checkout</h1>

        {error && <p className="error-text">{error}</p>}

        <p className="status-text">Your cart is empty.</p>

        <button className="retry-btn" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="page-header">
        <h1>Checkout</h1>
        <p>Confirm your shipping details and place your order</p>
      </div>

      <form className="checkout-layout" onSubmit={handlePlaceOrder}>
        <section className="checkout-card">
          <h2>Shipping Address</h2>

          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              type="text"
              value={shippingAddress.address}
              onChange={handleAddressChange}
              placeholder="House no, street, area"
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              name="city"
              type="text"
              value={shippingAddress.city}
              onChange={handleAddressChange}
              placeholder="City"
            />
          </div>

          <div className="form-group">
            <label>State</label>
            <input
              name="state"
              type="text"
              value={shippingAddress.state}
              onChange={handleAddressChange}
              placeholder="State"
            />
          </div>

          <div className="form-group">
            <label>Pin Code</label>
            <input
              name="pinCode"
              type="text"
              value={shippingAddress.pinCode}
              onChange={handleAddressChange}
              placeholder="Pin code"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              name="phoneNo"
              type="text"
              value={shippingAddress.phone}
              onChange={handleAddressChange}
              placeholder="Phone number"
            />
          </div>

          <h2>Payment Method</h2>

          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              Cash on Delivery
            </label>

            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              Online Payment
            </label>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button
            type="submit"
            className="checkout-btn mobile-place-order-btn"
            disabled={placingOrder}
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </section>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-items">
            {cartItems.map((item) => {
              const product = getProductFromItem(item);

              if (!product) return null;

              return (
                <div key={product._id} className="checkout-item">
                  <span>
                    {product.name} × {item.quantity}
                  </span>

                  <strong>₹{product.price * item.quantity}</strong>
                </div>
              );
            })}
          </div>

          <div className="summary-row">
            <span>Items Price</span>
            <span>₹{itemsPrice}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>₹{shippingPrice}</span>
          </div>

          <div className="summary-row">
            <span>Tax</span>
            <span>₹{taxPrice}</span>
          </div>

          <div className="summary-row total-row">
            <span>Total</span>
            <strong>₹{totalPrice}</strong>
          </div>

          <button
            type="submit"
            className="checkout-btn"
            disabled={placingOrder}
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </aside>
      </form>
    </main>
  );
}

export default CheckoutPage;