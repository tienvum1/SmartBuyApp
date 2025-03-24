const mongoose = require("mongoose");

// Schema cho tùy chọn bộ nhớ
const StorageOptionSchema = new mongoose.Schema(
  {
    storage: {
      type: String,
      required: [true, "Storage option is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  { _id: false } // Không cần _id cho sub-document
);

// Schema cho tùy chọn màu sắc
const ColorOptionSchema = new mongoose.Schema(
  {
    color_name: {
      type: String,
      required: [true, "Color name is required"],
      trim: true,
    },
    color_code: {
      type: String,
      required: [true, "Color code is required"],
      match: [
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        "Invalid color code format",
      ],
    },
    image: {
      type: String,
      required: [true, "Color image is required"],
      trim: true,
    },
  },
  { _id: false } // Không cần _id cho sub-document
);

// Schema cho mỗi item trong giỏ hàng
const CartItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    selected_storage: {
      type: StorageOptionSchema,
      required: [true, "Storage option is required"],
    },
    selected_color: {
      type: ColorOptionSchema,
      required: [true, "Color option is required"],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
      trim: true,
    },
    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },
  },
  { timestamps: false } // Không cần timestamps riêng cho item
);

// Schema cho giỏ hàng
const CartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true, // Tăng tốc truy vấn theo user_id
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    total_quantity: {
      type: Number,
      required: [true, "Total quantity is required"],
      min: [0, "Total quantity cannot be negative"],
      default: 0,
    },
    total_price: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual để tính số lượng sản phẩm duy nhất
CartSchema.virtual("unique_items_count").get(function () {
  return this.items.length;
});

// Đảm bảo updated_at được cập nhật trước khi save
CartSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model("Cart", CartSchema, "carts");
