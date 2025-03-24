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
} = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", register); // Đăng ký
router.post("/login", login); // Đăng nhập
router.get("/getUsers", getUsers);

router.get("/getAllAddresses/:userId", getAllAddresses);

// thêm địa chỉ giao hang
router.post("/addAddress/:userId", addAddress);
// lấy user theo id
router.get("/getUserById/:userId", getUserById);

// xóa địa chỉ
router.delete("/removeAddress/:userId/:addressId", removeAddress);

module.exports = router;
