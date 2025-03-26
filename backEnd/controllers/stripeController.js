// Đảm bảo sử dụng API key từ biến môi trường hoặc sử dụng giá trị hardcode nếu không có
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51R6XByKCyDrCcWwNZkA6QexXOKXe47ImvOBPbVFFqZj27l4P9WLqzsj0n7vx52fVq7lKUIhGPQSueSDS9Q9w03MS008YLJol0X');

/**
 * Tạo Payment Intent cho giao dịch thanh toán
 */
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount = 1000, currency = 'vnd', description = 'SmartBuy Payment' } = req.body;
    
    // Tạo PaymentIntent với số tiền và loại tiền tệ được chỉ định
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Số tiền
      currency, // Đơn vị tiền tệ (VND)
      description,
      metadata: {
        order_id: `order-${Date.now()}`, // Tạo ID đơn hàng mẫu
      },
    });

    // Gửi client secret về cho client
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Không thể tạo Payment Intent', 
      error: error.message 
    });
  }
};

/**
 * Lấy thông tin cấu hình Stripe (publishable key)
 */
exports.getConfig = (req, res) => {
  try {
    // Đảm bảo publishable key luôn được trả về
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51R6XByKCyDrCcWwNNeiUs6XUy1qbBxLaB78ny3S3p588CVH203sqyjXSuN8iTCbUaacodTIjHQfLIs1DrqvEJ1zv00B9OXzQsn';
    
    console.log('Sending publishable key:', publishableKey);
    
    res.status(200).json({
      success: true,
      publishableKey
    });
  } catch (error) {
    console.error('Error getting Stripe config:', error);
    res.status(500).json({ 
      success: false,
      message: 'Không thể lấy cấu hình Stripe',
      error: error.message 
    });
  }
};

/**
 * Xử lý webhook từ Stripe
 */
exports.webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Sử dụng webhook secret từ biến môi trường hoặc giá trị mặc định
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_e4f3ba9b4d1c6df5f2c2a0d9e93ccf7b9e2f7b3a1d8c0f4e6b5a2d1c3b4a5f6';
    
    // Xác minh sự kiện đến từ Stripe sử dụng webhook secret từ biến môi trường
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Xử lý sự kiện dựa trên loại
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent ID: ${paymentIntent.id} thành công!`);
      // Ở đây bạn sẽ cập nhật cơ sở dữ liệu và hoàn thành đơn hàng
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log(`Thanh toán thất bại cho PaymentIntent ID: ${failedPayment.id}`);
      // Ở đây bạn sẽ thông báo cho khách hàng hoặc cập nhật hồ sơ
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Trả về phản hồi thành công 200 để xác nhận đã nhận sự kiện
  res.json({ received: true });
};

/**
 * Xác nhận thanh toán thành công
 */
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    if (!paymentIntentId) {
      return res.status(400).json({ 
        success: false, 
        message: 'PaymentIntent ID là bắt buộc' 
      });
    }

    // Lấy thông tin từ PaymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Xử lý logic của bạn sau khi thanh toán thành công
      return res.status(200).json({ 
        success: true, 
        message: 'Thanh toán thành công', 
        paymentIntent 
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: `Thanh toán có trạng thái: ${paymentIntent.status}` 
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi khi xác nhận thanh toán', 
      error: error.message 
    });
  }
}; 