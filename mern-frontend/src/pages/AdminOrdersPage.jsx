import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteOrder,
  getAllOrders,
  updateOrderStatus,
} from "../services/orderService";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [deletingOrderId, setDeletingOrderId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  async function loadOrders() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const data = await getAllOrders();

      setOrders(data.orders);
    } 
    
    catch (error) {
      setError( error.message || "Failed to load orders");
    } 
    
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleStatusChange(orderId, newStatus) {
    try {
      setUpdatingOrderId(orderId);
      setError("");
      setMessage("");

      const data = await updateOrderStatus(orderId, newStatus);

      const updatedOrder = data.order;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus : updatedOrder.orderStatus
              }
            : order
        )
      );

      setMessage("Order status updated successfully");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingOrderId("");
      setTimeout(() => {
        setMessage("")
      }, 1000);
    }
  }

  async function handleDelete(orderId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingOrderId(orderId);
      setError("");
      setMessage("");

      await deleteOrder(orderId);

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );

      setMessage("Order deleted successfully");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete order"
      );
    } finally {
      setDeletingOrderId("");
      setTimeout(() => {
       setMessage("")
      }, 1000);
    }
  }

  if (loading) {
    return (
      <main className="page-container">
        <p className="status-text">Loading admin orders...</p>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="page-header">
        <h1>Admin Orders</h1>
        <p>Manage all user orders</p>
      </div>

      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}

      {orders.length === 0 ? (
        <p className="status-text">No orders found.</p>
      ) : (
        <section className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const orderDate = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A";

                const isUpdating = updatingOrderId === order._id;
                
                const isDeleting = deletingOrderId === order._id;

                return (
                  <tr key={order._id}>
                    <td>{order._id}</td>

                    <td>{order.user.name }</td>

                    <td>{orderDate}</td>

                    <td>₹{ order.totalPrice}</td>

                    <td>{order.paymentInfo.method}</td>

                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={(event) =>
                          handleStatusChange(order._id, event.target.value)
                        }
                        disabled={isUpdating || isDeleting}
                        className="admin-status-select"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      {isUpdating && (
                        <p className="small-status-text">Updating...</p>
                      )}
                    </td>

                    <td>
                      <div className="admin-actions">
                        <Link
                          to={`/orders/${order._id}`}
                          className="edit-link"
                        >
                          View
                        </Link>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(order._id)}
                          disabled={isDeleting || isUpdating}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
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

export default AdminOrdersPage;