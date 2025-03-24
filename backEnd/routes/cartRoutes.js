const express = require("express");
const cartController = require("../controllers/cartControllers");
const router = express.Router();

router.get("/", cartController.getCart); // Lấy giỏ hàng (không rõ user_id)
router.post("/add", cartController.addToCart); // Thêm sản phẩm vào giỏ
router.get("/:user_id", cartController.getCart); // Lấy giỏ hàng theo user_id
router.patch("/:user_id/items/:item_id", cartController.updateCartItem); // Cập nhật item
router.delete("/:user_id/items/:item_id", cartController.removeFromCart); // Xóa item

module.exports = router;
