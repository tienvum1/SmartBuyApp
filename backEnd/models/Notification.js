// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: { type: String, required: true },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: false,
  },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
