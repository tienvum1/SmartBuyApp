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
  // này để lưu cái face_id của thằng kia
  face_id:{
    type:String
  },
  role: { type: String, default: "user" }, // ê, cái này cần enum là user với admin nè
  status: { type: String, default: "active" },
  phone: {
    type: String,
    sparse: true,
    default: "null",
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
  expried_code:{
    type:String
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema, "users");
