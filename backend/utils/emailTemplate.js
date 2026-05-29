const orderConfirmationTemplate = (order, user) => {
  const itemsText = order.orderItems
    .map((item) => {
      return `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`;
    })
    .join("\n");

  const itemsHtml = order.orderItems
    .map((item) => {
      return `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">₹${item.price}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">₹${
            item.price * item.quantity
          }</td>
        </tr>
      `;
    })
    .join("");

  return {
    subject: `Order Confirmation - ${order._id}`,

    text: `
Hi ${user.name},

Your order has been placed successfully.

Order ID: ${order._id}
Order Status: ${order.orderStatus}
Payment Method: ${order.paymentInfo?.method}
Payment Status: ${order.paymentInfo?.status}

Items:
${itemsText}

Items Price: ₹${order.itemsPrice}
Shipping Price: ₹${order.shippingPrice}
Tax Price: ₹${order.taxPrice}
Total Price: ₹${order.totalPrice}

Shipping Address:
${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} - ${order.shippingInfo.pinCode}

Thank you for shopping with us!
`,

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Order Placed Successfully ✅</h2>

        <p>Hi <b>${user.name}</b>,</p>

        <p>Your order has been placed successfully.</p>

        <h3>Order Details</h3>
        <p><b>Order ID:</b> ${order._id}</p>
        <p><b>Status:</b> ${order.orderStatus}</p>
        <p><b>Payment Method:</b> ${order.paymentInfo?.method}</p>
        <p><b>Payment Status:</b> ${order.paymentInfo?.status}</p>

        <h3>Items</h3>
        <table style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th style="padding: 8px; border: 1px solid #ddd;">Product</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Qty</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <h3>Price Summary</h3>
        <p><b>Items Price:</b> ₹${order.itemsPrice}</p>
        <p><b>Shipping:</b> ₹${order.shippingPrice}</p>
        <p><b>Tax:</b> ₹${order.taxPrice}</p>
        <h3>Total: ₹${order.totalPrice}</h3>

        <h3>Shipping Address</h3>
        <p>
          ${order.shippingInfo.address}, ${order.shippingInfo.city},
          ${order.shippingInfo.state} - ${order.shippingInfo.pinCode}
        </p>

        <p>Thank you for shopping with us!</p>
      </div>
    `,
  };
};

module.exports = {
  orderConfirmationTemplate,
};