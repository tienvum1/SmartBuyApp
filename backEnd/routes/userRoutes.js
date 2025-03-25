const express = require("express");
const {
  register,
  login,
  getUsers,
  getPrimaryAddress,
  getAllAddresses,
  addAddress,
  getUserById,
  removeAddress,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getResetPasswordForm
} = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", register); // Đăng ký
router.post("/login", login); // Đăng nhập
router.get("/getUsers", getUsers);

// Đơn giản hóa quên mật khẩu không cần email
router.post("/reset-password", resetPassword); // Xử lý đặt lại mật khẩu trực tiếp

router.get("/getAllAddresses/:userId", getAllAddresses);

// thêm địa chỉ giao hang
router.post("/addAddress/:userId", addAddress);
// lấy user theo id
router.get("/getUserById/:userId", getUserById);

// xóa địa chỉ
router.delete("/removeAddress/:userId/:addressId", removeAddress);

module.exports = router;
