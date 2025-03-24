// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      selected_storage: {
        storage: { type: String, required: true },
        price: { type: Number, required: true },
      },
      selected_color: {
        color_name: { type: String, required: true },
      },
      subtotal: { type: Number, required: true },
    },
  ],
  shipping_address: {
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  payment_method: { type: String, required: true },
  subtotal: { type: Number, required: true },
  shipping_cost: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
      "returned",
      "refunded",
      "failed",
    ],
    default: "pending",
  },
  returnReason: { type: String }, // Thêm trường để lưu lý do trả hàng
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
