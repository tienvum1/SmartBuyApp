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
<<<<<<< HEAD
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getResetPasswordForm
} = require("../controllers/userController");
const auth = require("../middleware/auth");
=======
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const { loginFaceBook, forgotPass, changePass } = require("../controllers/auth.controller");
>>>>>>> 0aa2407 (fix db)

const router = express.Router();

router.post("/register", register); // Đăng ký
router.post("/login", login); // Đăng nhập
router.get("/getUsers", getUsers);

<<<<<<< HEAD
// Đơn giản hóa quên mật khẩu không cần email
router.post("/reset-password", resetPassword); // Xử lý đặt lại mật khẩu trực tiếp

router.get("/getAllAddresses/:userId", getAllAddresses);

=======
router.post('/loginFb',loginFaceBook);

router.get("/getAllAddresses/:userId", getAllAddresses);
>>>>>>> 0aa2407 (fix db)
// thêm địa chỉ giao hang
router.post("/addAddress/:userId", addAddress);
// lấy user theo id
router.get("/getUserById/:userId", getUserById);
<<<<<<< HEAD

// xóa địa chỉ
router.delete("/removeAddress/:userId/:addressId", removeAddress);

=======
// xóa địa chỉ
router.delete("/removeAddress/:userId/:addressId", removeAddress);
// quên pass
router.post("/forgotPass",forgotPass);
router.post("/changePass",changePass)
>>>>>>> 0aa2407 (fix db)
module.exports = router;
