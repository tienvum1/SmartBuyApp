const express = require("express");
const {
  register,
  login,
  getUsers,
  getPrimaryAddress,
  getAllAddresses,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", register); // Đăng ký
router.post("/login", login); // Đăng nhập
router.get("/getUsers", getUsers);

router.get("/getAllAddresses/:userId", getAllAddresses);

module.exports = router;
