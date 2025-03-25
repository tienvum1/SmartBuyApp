const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');
const bodyParser = require('body-parser');

// Route để lấy cấu hình Stripe (publishable key)
router.get('/config', stripeController.getConfig);

// Route để tạo Payment Intent
router.post('/create-payment-intent', stripeController.createPaymentIntent);

// Route để xác nhận thanh toán
router.post('/confirm-payment', stripeController.confirmPayment);

// Route để xử lý webhook (sử dụng raw body)
router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  stripeController.webhook
);

module.exports = router; 