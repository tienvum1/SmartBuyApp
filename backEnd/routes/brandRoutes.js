const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");

// Lấy danh sách tất cả các thương hiệu
router.get("/", brandController.getAllBrands);

// Lấy thông tin một thương hiệu theo ID
router.get("/:id", brandController.getBrandById);


module.exports = router;
