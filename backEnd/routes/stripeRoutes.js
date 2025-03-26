const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');

// Route để lấy cấu hình Stripe (publishable key)
router.get('/config', stripeController.getConfig);

// Route để tạo Payment Intent
router.post('/create-payment-intent', stripeController.createPaymentIntent);

// Route để xác nhận thanh toán
router.post('/confirm-payment', stripeController.confirmPayment);

// Route để xử lý webhook 
// Lưu ý: bodyParser.raw đã được áp dụng trong server.js
router.post('/webhook', stripeController.webhook);

module.exports = router; 