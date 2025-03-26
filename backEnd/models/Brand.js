const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
  brand_name: {
    type: String,
    required: true,
    unique: true,
  },
  logo: {
    type: String, // Lưu đường dẫn ảnh
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Brand", BrandSchema, "brands");
