const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    brand_id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    stock: Number,
    sold: Number,
    description: String,
    colors: [
      {
        color_name: String,
        color_code: String,
        image: String,
      },
    ],
    storage_options: [
      {
        storage: String,
        price: Number,
      },
    ],
    specs: {
      display: String,
      chipset: String,
      ram: String,
      battery: String,
      camera: String,
      os: String,
      network: String,
    },
    images: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema, "products");
