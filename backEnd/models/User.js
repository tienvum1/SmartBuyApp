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
    sparse: true, // Sparse index cho phép nhiều giá trị null
    unique: false, // Bỏ hoặc đặt unique: false để tránh lỗi duplicate key
  },
  address: [AddressSchema], // Sử dụng AddressSchema để mỗi địa chỉ có _id riêng
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

// Đảm bảo không tạo index trên phoneNumber (nếu có) vì trường này không tồn tại trong schema
UserSchema.index({ email: 1 }, { unique: true }); // Chỉ tạo index unique trên email

// Tạo và export model User
const User = mongoose.model("User", UserSchema);
module.exports = User;
