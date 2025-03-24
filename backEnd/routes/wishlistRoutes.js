const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

// Thêm sản phẩm vào Wishlist
router.post("/add", wishlistController.addToWishlist);

// Lấy danh sách Wishlist của người dùng
router.get("/:userId", wishlistController.getWishlist);

// Xóa sản phẩm khỏi Wishlist
router.delete("/remove", wishlistController.removeFromWishlist);

module.exports = router;
