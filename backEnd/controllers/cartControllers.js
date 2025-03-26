const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.getCart = async (req, res) => {
  try {
    const { user_id } = req.params;
    const cart = await Cart.findOne({ user_id }).populate("items.product_id");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};
exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity, selected_storage, selected_color } =
      req.body;

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Cannot add more than available stock. Available: ${product.stock}, Requested: ${quantity}`
      });
    }

    let cart = await Cart.findOne({ user_id });
    if (!cart) {
      cart = new Cart({
        user_id,
        items: [],
        total_quantity: 0,
        total_price: 0,
      });
    }

    const storageOption = product.storage_options.find(
      (opt) => opt.storage === selected_storage
    );
    const colorOption = product.colors.find(
      (opt) => opt.color_name === selected_color
    );

    if (!storageOption || !colorOption) {
      return res
        .status(400)
        .json({ message: "Invalid storage or color option" });
    }

    const price = storageOption.price;
    const subtotal = price * quantity;

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product_id.toString() === product_id &&
        item.selected_storage.storage === selected_storage &&
        item.selected_color.color_name === selected_color
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: `Cannot add more than available stock. Available: ${product.stock}, Current in cart: ${cart.items[existingItemIndex].quantity}, Requested to add: ${quantity}`
        });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].subtotal = price * newQuantity;
    } else {
      cart.items.push({
        product_id,
        name: product.name,
        quantity,
        selected_storage: storageOption,
        selected_color: colorOption,
        image: product.images[0],
        subtotal,
      });
    }

    cart.total_quantity = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    cart.total_price = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

// Các hàm khác (getCart, updateCartItem, removeFromCart) giữ nguyên như trước
exports.getCart = async (req, res) => {
  try {
    const { user_id } = req.params;
    const cart = await Cart.findOne({ user_id }).populate("items.product_id");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { user_id, item_id } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(item_id);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Lấy thông tin sản phẩm để kiểm tra số lượng tồn kho
    const product = await Product.findById(item.product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Kiểm tra nếu số lượng mới vượt quá số lượng trong kho
    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Cannot update to more than available stock. Available: ${product.stock}, Requested: ${quantity}`
      });
    }

    item.quantity = quantity;
    item.subtotal = item.selected_storage.price * quantity;

    cart.total_quantity = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    cart.total_price = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { user_id, item_id } = req.params;

    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== item_id);
    cart.total_quantity = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    cart.total_price = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing from cart", error });
  }
};

module.exports = exports;
