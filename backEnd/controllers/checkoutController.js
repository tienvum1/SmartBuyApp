// controllers/checkoutController.js
const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// Place order (COD and Stripe) - Đã cập nhật để hỗ trợ Stripe
exports.placeOrder = async (req, res) => {
  try {
    const { shippingAddressId, paymentMethod, selectedItemIds, total, userId, paymentIntentId } =
      req.body;
    console.log("--- Bắt đầu xử lý placeOrder ---");
    console.log("Request body:", req.body);
    console.log("User ID from placeOrder:", userId);
    console.log("Thông tin đầu vào:", {
      shippingAddressId,
      paymentMethod,
      selectedItemIds,
      total,
      paymentIntentId
    });

    // Kiểm tra xem userId có phải là ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("userId không phải là ObjectId hợp lệ:", userId);
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    // Kiểm tra xem shippingAddressId có phải là ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(shippingAddressId)) {
      console.error("shippingAddressId không phải là ObjectId hợp lệ:", shippingAddressId);
      return res.status(400).json({
        success: false,
        message: "Invalid shipping address ID format"
      });
    }

    // Kiểm tra xem selectedItemIds có phải là mảng các ObjectId hợp lệ không
    const invalidItemIds = selectedItemIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidItemIds.length > 0) {
      console.error("Có các item ID không hợp lệ:", invalidItemIds);
      return res.status(400).json({
        success: false,
        message: "Invalid item ID format in selectedItemIds"
      });
    }

    if (
      !shippingAddressId ||
      !paymentMethod ||
      !selectedItemIds ||
      !total ||
      !userId
    ) {
      console.error("Thiếu thông tin bắt buộc:", {
        hasShippingAddressId: !!shippingAddressId,
        hasPaymentMethod: !!paymentMethod,
        hasSelectedItemIds: !!selectedItemIds && selectedItemIds.length > 0,
        hasTotal: !!total,
        hasUserId: !!userId
      });
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: shippingAddressId, paymentMethod, selectedItemIds, total, userId",
      });
    }
    console.log("Dữ liệu đầu vào hợp lệ");

    // Kiểm tra phương thức thanh toán hợp lệ
    if (paymentMethod !== "cod" && paymentMethod !== "stripe") {
      console.error("Phương thức thanh toán không hợp lệ:", paymentMethod);
      return res.status(400).json({
        success: false,
        message: "Only 'cod' and 'stripe' payment methods are supported",
      });
    }

    // Nếu thanh toán qua Stripe, cần paymentIntentId
    if (paymentMethod === "stripe" && !paymentIntentId) {
      console.error("Thanh toán qua Stripe nhưng không có paymentIntentId");
      return res.status(400).json({
        success: false,
        message: "PaymentIntentId is required for Stripe payments",
      });
    }

    console.log("Bắt đầu tìm giỏ hàng với user_id:", userId);
    const cart = await Cart.findOne({ user_id: userId }).populate(
      "items.product_id"
    );
    console.log("Kết quả tìm giỏ hàng:", cart ? "Tìm thấy giỏ hàng" : "Không tìm thấy giỏ hàng");
    if (!cart) {
      console.error("Không tìm thấy giỏ hàng cho user:", userId);
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    
    // Kiểm tra có items trong giỏ hàng không
    if (!cart.items || cart.items.length === 0) {
      console.error("Giỏ hàng rỗng cho user:", userId);
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty" });
    }
    console.log("Giỏ hàng hợp lệ, có", cart.items.length, "sản phẩm");

    console.log("Bắt đầu tìm user với userId:", userId);
    const user = await User.findById(userId);
    console.log("Kết quả tìm user:", user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    console.log("User hợp lệ:", user);

    console.log("Bắt đầu kiểm tra shippingAddress với ID:", shippingAddressId);
    const shippingAddress = user.address.find(
      (addr) => addr._id && addr._id.toString() === shippingAddressId
    );
    console.log("Shipping address tìm thấy:", shippingAddress);
    if (!shippingAddress) {
      return res.status(404).json({
        success: false,
        message: "Shipping address not found",
      });
    }
    console.log("Shipping address hợp lệ:", shippingAddress);

    const selectedItems = cart.items.filter((item) =>
      selectedItemIds.includes(item._id.toString())
    );
    console.log("Selected items:", selectedItems);
    if (selectedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No selected items found in cart",
      });
    }

    for (const item of selectedItems) {
      const product = await Product.findById(item.product_id._id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product_id._id} not found`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        });
      }
    }

    const orderItems = selectedItems.map((item) => ({
      product_id: item.product_id._id,
      name: item.product_id.name,
      quantity: item.quantity,
      selected_storage: {
        storage: item.selected_storage.storage,
        price: item.selected_storage.price,
      },
      selected_color: {
        color_name: item.selected_color.color_name,
      },
      subtotal: item.quantity * item.selected_storage.price,
    }));
    console.log("Order items:", orderItems);

    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const shippingCost = 30000;
    const tax = 0;
    const calculatedTotal = subtotal + shippingCost + tax;
    console.log("Calculated total:", calculatedTotal, "Received total:", total);

    if (calculatedTotal !== total) {
      return res.status(400).json({
        success: false,
        message: "Total amount mismatch",
      });
    }

    const order = new Order({
      user_id: userId,
      items: orderItems,
      shipping_address: {
        phone: shippingAddress.phone,
        address: shippingAddress.address,
      },
      payment_method: paymentMethod,
      payment_intent_id: paymentMethod === 'stripe' ? paymentIntentId : undefined,
      subtotal,
      shipping_cost: shippingCost,
      tax,
      total,
      status: "pending",
    });
    console.log("Đơn hàng đã được tạo:", order);
    await order.save();

    for (const item of selectedItems) {
      await Product.findByIdAndUpdate(item.product_id._id, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }

    await Cart.findOneAndUpdate(
      { user_id: userId },
      { $pull: { items: { _id: { $in: selectedItemIds } } } }
    );
    console.log("Giỏ hàng đã được cập nhật sau khi đặt hàng");

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order: {
        orderId: order._id,
        subtotal,
        shippingCost,
        tax,
        total,
        shippingAddress: {
          phone: shippingAddress.phone,
          address: shippingAddress.address,
        },
        paymentMethod,
        paymentIntentId: order.payment_intent_id,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Lỗi trong placeOrder:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error placing order",
      error: error.message,
    });
  }
};

// Lấy tất cả đơn hàng của người dùng
exports.getUserOrders = async (req, res) => {
  try {
    const { userId, status } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const query = { user_id: userId };
    if (status) {
      const validStatuses = [
        "pending",
        "processing",
        "confirmed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
        "failed",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(
            ", "
          )}`,
        });
      }
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("items.product_id")
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      orders: orders.map((order) => ({
        orderId: order._id,
        userId: order.user_id,
        items: order.items,
        shippingAddress: order.shipping_address,
        paymentMethod: order.payment_method,
        subtotal: order.subtotal,
        shippingCost: order.shipping_cost,
        tax: order.tax,
        total: order.total,
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      })),
    });
  } catch (error) {
    console.error("Lỗi trong getUserOrders:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error fetching user orders",
      error: error.message,
    });
  }
};

// Lấy đơn hàng theo trạng thái
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { userId, status } = req.params;

    if (!userId || !status) {
      return res.status(400).json({
        success: false,
        message: "User ID and status are required",
      });
    }

    const validStatuses = [
      "pending",
      "processing",
      "confirmed",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
      "returned",
      "refunded",
      "failed",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const orders = await Order.find({ user_id: userId, status })
      .populate("items.product_id")
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      orders: orders.map((order) => ({
        orderId: order._id,
        userId: order.user_id,
        items: order.items,
        shippingAddress: order.shipping_address,
        paymentMethod: order.payment_method,
        subtotal: order.subtotal,
        shippingCost: order.shipping_cost,
        tax: order.tax,
        total: order.total,
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      })),
    });
  } catch (error) {
    console.error("Lỗi trong getOrdersByStatus:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error fetching orders by status",
      error: error.message,
    });
  }
};

// Hủy đơn hàng
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId, userId } = req.body;

    if (!orderId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Order ID and user ID are required",
      });
    }

    const order = await Order.findOne({ _id: orderId, user_id: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const cancellableStatuses = [
      "pending",
      "processing",
      "confirmed",
      "shipped",
    ];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order in status ${
          order.status
        }. Order can only be cancelled in: ${cancellableStatuses.join(", ")}`,
      });
    }

    // Cập nhật trạng thái thành "cancelled"
    order.status = "cancelled";
    await order.save();

    // Hoàn lại tồn kho
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { stock: item.quantity, sold: -item.quantity },
      });
    }

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: {
        orderId: order._id,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Lỗi trong cancelOrder:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
};

// Yêu cầu trả hàng
exports.requestReturn = async (req, res) => {
  try {
    const { orderId, userId, reason } = req.body;

    if (!orderId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Order ID and user ID are required",
      });
    }

    const order = await Order.findOne({ _id: orderId, user_id: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "delivered") {
      return res.status(400).json({
        success: false,
        message: "Order must be in 'delivered' status to request a return",
      });
    }

    // Cập nhật trạng thái thành "returned"
    order.status = "returned";
    order.returnReason = reason || "No reason provided"; // Lưu lý do trả hàng (cần thêm trường returnReason vào schema Order)
    await order.save();

    res.status(200).json({
      success: true,
      message: "Return request submitted successfully",
      order: {
        orderId: order._id,
        status: order.status,
        returnReason: order.returnReason,
      },
    });
  } catch (error) {
    console.error("Lỗi trong requestReturn:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error requesting return",
      error: error.message,
    });
  }
};

// Xác nhận đã nhận hàng
exports.confirmDelivery = async (req, res) => {
  try {
    const { orderId, userId } = req.body;

    if (!orderId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Order ID and user ID are required",
      });
    }

    const order = await Order.findOne({ _id: orderId, user_id: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "out_for_delivery") {
      return res.status(400).json({
        success: false,
        message:
          "Order must be in 'out_for_delivery' status to confirm delivery",
      });
    }

    // Cập nhật trạng thái thành "delivered"
    order.status = "delivered";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Delivery confirmed successfully",
      order: {
        orderId: order._id,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Lỗi trong confirmDelivery:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error confirming delivery",
      error: error.message,
    });
  }
};

// Giữ nguyên các hàm khác
exports.getCheckoutDetails = async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log("User ID from getCheckoutDetails:", userId);
    const cart = await Cart.findOne({ user_id: userId }).populate(
      "items.product_id"
    );
    const user = await User.findById(userId);

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.selected_storage.price,
      0
    );
    const shippingCost = cart.items.length > 0 ? 30000 : 0;
    const tax = 0;
    const total = subtotal + shippingCost + tax;

    res.status(200).json({
      success: true,
      cartItems: cart.items,
      shippingAddresses: user.address || [],
      paymentMethods: ["cod"],
      summary: {
        subtotal,
        shippingCost,
        tax,
        total,
      },
    });
  } catch (error) {
    console.error("Lỗi trong getCheckoutDetails:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error fetching checkout details",
      error: error.message,
    });
  }
};

exports.getAllAddresses = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      addresses: user.address || [],
    });
  } catch (error) {
    console.error("Lỗi trong getAllAddresses:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error fetching addresses",
      error: error.message,
    });
  }
};

exports.addShippingAddress = async (req, res) => {
  try {
    const { phone, address, is_primary, userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!phone || !address) {
      return res.status(400).json({
        success: false,
        message: "phone and address are required",
      });
    }

    const newAddress = {
      phone,
      address,
      is_primary: is_primary || false,
    };

    if (is_primary) {
      user.address.forEach((addr) => (addr.is_primary = false));
    }

    user.address.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Shipping address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error("Lỗi trong addShippingAddress:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error adding shipping address",
      error: error.message,
    });
  }
};

module.exports = exports;
