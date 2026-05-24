import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const data = await getMyOrders();

      setOrders(data.orders || data.myOrders || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="page-container">
        <p className="status-text">Loading orders...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <p className="error-text">{error}</p>

        <button className="retry-btn" onClick={loadOrders}>
          Try Again
        </button>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="orders-page">
        <h1>My Orders</h1>

        <p className="status-text">You have not placed any orders yet.</p>

        <Link to="/" className="details-link">
          Start Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="page-header">
        <h1>My Orders</h1>
        <p>Track your recent orders</p>
      </div>

      <section className="orders-list">
        {orders.map((order) => {
          const orderDate = order.createdAt
            ? new Date(order.createdAt).toLocaleDateString()
            : "N/A";

          const total =
            order.totalPrice ||
            order.totalAmount ||
            order.amount ||
            0;

          const status = order.orderStatus || order.status || "Processing";

          return (
            <article key={order._id} className="order-card">
              <div>
                <h3>Order #{order._id}</h3>

                <p>Placed on: {orderDate}</p>

                <p>
                  Status:{" "}
                  <span
                    className={
                      status === "Delivered"
                        ? "success-text"
                        : "status-text"
                    }
                  >
                    {status}
                  </span>
                </p>
              </div>

              <div className="order-card-right">
                <strong>₹{total}</strong>

                <Link to={`/orders/${order._id}`} className="details-link">
                  View Details
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default OrdersPage;