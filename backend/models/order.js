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
      }
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

module.exports = mongoose.model("Order", orderSchema);