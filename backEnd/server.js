const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import routes
const brandRoutes = require("./routes/brandRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const stripeRoutes = require("./routes/stripeRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());

// Middleware cho Stripe webhook - phải đặt trước middleware xử lý JSON thông thường
// Stripe webhook cần raw body
app.use((req, res, next) => {
  if (req.originalUrl === '/stripe/webhook') {
    bodyParser.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

app.use("/uploads", express.static("uploads")); // Cho phép truy cập ảnh trong thư mục uploads

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/brands", brandRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);
app.use("/checkouts", checkoutRoutes);
app.use("/wishlists", wishlistRoutes);
app.use("/stripe", stripeRoutes);

// Direct route for removeAddress
app.delete("/removeAddress/:userId/:addressId", async (req, res) => {
  try {
    const { removeAddress } = require("./controllers/userController");
    await removeAddress(req, res);
  } catch (error) {
    console.error("Error in removeAddress route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port localhost:${PORT}`));
