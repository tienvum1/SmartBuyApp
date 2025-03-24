const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  full_name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  status: { type: String, default: "active" },
  phone: {
    type: String,
    default: "0123456789",
  },
  address: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      telephone: String,
      address: String,
      is_primary: Boolean,
    },
  ],
  wishlist: [
    {
      product_id: mongoose.Schema.Types.ObjectId,
      added_at: { type: Date, default: Date.now },
    },
  ],
  payment: [
    {
      method: String,
      card_number: String,
      expiry_date: String,
      billing_address: String,
    },
  ],
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema, "users");
