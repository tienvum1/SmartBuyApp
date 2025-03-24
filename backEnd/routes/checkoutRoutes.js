// routes/checkout.js
const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");

router.post("/placeOrder", checkoutController.placeOrder);
router.get("/user-orders", checkoutController.getUserOrders); // Lấy tất cả đơn hàng
router.get("/orders/:userId/:status", checkoutController.getOrdersByStatus); // Lấy đơn hàng theo trạng thái
router.post("/cancel", checkoutController.cancelOrder); // Hủy đơn hàng
router.post("/request-return", checkoutController.requestReturn); // Yêu cầu trả hàng
router.post("/confirm-delivery", checkoutController.confirmDelivery); // Xác nhận đã nhận hàng
router.post("/details", checkoutController.getCheckoutDetails);
router.get("/addresses/:userId", checkoutController.getAllAddresses);
router.post("/add-address", checkoutController.addShippingAddress);

module.exports = router;
