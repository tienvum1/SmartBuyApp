const Wishlist = require("../models/Wishlist");

// Thêm sản phẩm vào Wishlist
exports.addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  console.log("san ppham add vào");
  console.log(req.body);
  try {
    const wishlist = await Wishlist.findOne({ user_id: userId });

    if (wishlist) {
      const productExists = wishlist.products.some(
        (item) => item.product_id.toString() === productId
      );

      if (!productExists) {
        wishlist.products.push({ product_id: productId });
        await wishlist.save();
        return res.status(200).json({
          success: true,
          message: "Thêm sản phẩm vào Wishlist thành công!",
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Sản phẩm đã có trong Wishlist!" });
      }
    } else {
      const newWishlist = new Wishlist({
        user_id: userId,
        products: [{ product_id: productId }],
      });

      await newWishlist.save();
      return res.status(201).json({
        success: true,
        message: "Tạo Wishlist và thêm sản phẩm thành công!",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}; // Xóa sản phẩm khỏi Wishlist
exports.removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  console.log("san pham bo ra", { userId, productId });

  try {
    const wishlist = await Wishlist.findOne({ user_id: userId });

    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy Wishlist!" });
    }

    const productIndex = wishlist.products.findIndex(
      (item) => item.product_id.toString() === productId
    );

    if (productIndex === -1) {
      return res
        .status(400)
        .json({ success: false, message: "Sản phẩm không có trong Wishlist!" });
    }

    wishlist.products.splice(productIndex, 1); // Xóa sản phẩm khỏi mảng
    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Xóa sản phẩm khỏi Wishlist thành công!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách Wishlist của người dùng
exports.getWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    const wishlist = await Wishlist.findOne({ user_id: userId }).populate(
      "products.product_id"
    );

    if (wishlist) {
      return res.status(200).json({ success: true, data: wishlist });
    } else {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy Wishlist cho người dùng này.",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
