import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";

function OrderDetailsPage() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrder() {
    try {
      setLoading(true);
      setError("");

      const data = await getOrderById(orderId);

      setOrder(data.order);
    } catch (error) {
      setError(error.message ||"Failed to load order");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="page-container">
        <p className="status-text">Loading order...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <p className="error-text">{error}</p>

        <button className="retry-btn" onClick={loadOrder}>
          Try Again
        </button>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="page-container">
        <p className="status-text">Order not found</p>

        <Link to="/orders" className="details-link">
          Back to orders
        </Link>
      </main>
    );
  }

  const orderItems = order.orderItems
  const shippingAddress = order.shippingInfo;

  const paymentStatus = order.paymentInfo.status

  const orderStatus = order.orderStatus

  const itemsPrice = order.itemsPrice || 0;
  const shippingPrice = order.shippingPrice || 0;
  const taxPrice = order.taxPrice || 0;
  const totalPrice = order.totalPrice
  return (
    <main className="order-details-page">
      <Link to="/orders" className="back-link">
        ← Back to Orders
      </Link>

      <div className="page-header">
        <h1>Order Details</h1>
        <p>Order ID: {order._id}</p>
      </div>

      <section className="order-details-layout">
        <div className="order-main">
          <section className="order-section">
            <h2>Shipping Address</h2>

            <p>{shippingAddress.address || "N/A"}</p>

            <p>
              {shippingAddress.city || "N/A"},{" "}
              {shippingAddress.state || "N/A"}
            </p>

            <p>
              
              {shippingAddress.pinCode || "N/A"}
            </p>

            <p>Phone: {shippingAddress.phoneNo || "N/A"}</p>
          </section>

          <section className="order-section">
            <h2>Order Items</h2>

            {orderItems.length === 0 ? (
              <p className="status-text">No items found in this order.</p>
            ) : (
              <div className="order-items-list">
                {orderItems.map((item) => {
                 
                  const productId =  item.product;

                  const name = item.name ;

                  const price = item.price;

                  const imageUrl = item.image

                  return (
                    <article
                      key={item._id || productId}
                      className="order-item"
                    >
                      <img
                        src={imageUrl}
                        alt={name}
                        className="order-item-image"
                      />

                      <div>
                        <h3>{name}</h3>

                        <p>
                          ₹{price} × {item.quantity}
                        </p>
                      </div>

                      <strong>₹{price * item.quantity}</strong>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="order-summary">
          <h2>Summary</h2>

          <div className="summary-row">
            <span>Payment Method</span>
            <span>{order.paymentMethod || "N/A"}</span>
          </div>

          <div className="summary-row">
            <span>Payment Status</span>
            <span>{paymentStatus}</span>
          </div>

          <div className="summary-row">
            <span>Order Status</span>
            <span>{orderStatus}</span>
          </div>

          <div className="summary-row">
            <span>Items</span>
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
        </aside>
      </section>
    </main>
  );
}

export default OrderDetailsPage;