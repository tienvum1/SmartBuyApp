const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { _id: true, timestamps: false } // Đảm bảo mỗi địa chỉ có _id riêng, không cần timestamps cho subdocument
);

const UserSchema = new mongoose.Schema({
  full_name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  status: { type: String, default: "active" },
  phone: {
    type: String,
    sparse: true,
    default: "null",
  },
  address: [AddressSchema], // Sử dụng AddressSchema để mỗi địa chỉ có _id riêng
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
