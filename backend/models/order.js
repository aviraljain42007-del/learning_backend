const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },

        name: {
          type: String,
          required: true
        },

        price: {
          type: Number,
          required: true
        },

        quantity: {
          type: Number,
          required: true
        }
      }
    ],

    shippingInfo: {
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      pinCode: {
        type: String,
        required: true
      },
      phoneNo: {
        type: String,
        required: true
      }
    },

    paymentInfo: {
      method: {
        type: String,
        default: "COD"
      },
      status: {
        type: String,
        default: "Not Paid"
      },
      paidAt: Date
    },

    itemsPrice: {
      type: Number,
      required: true
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0
    },

    totalPrice: {
      type: Number,
      required: true
    },

    orderStatus: {
      type: String,
      default: "Processing"
    },

    deliveredAt: Date
  },
  { timestamps: true }
);

// Indexes for order queries
orderSchema.index({ user: 1 }); // Find orders by user
orderSchema.index({ createdAt: -1 }); // Sort by creation date
orderSchema.index({ orderStatus: 1 }); // Filter by status
orderSchema.index({ "paymentInfo.status": 1 }); // Filter by payment status
orderSchema.index({ user: 1, createdAt: -1 }); // Compound index for user orders sorted by date

module.exports = mongoose.model("Order", orderSchema);