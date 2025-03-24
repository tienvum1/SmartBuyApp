const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/top-selling", productController.getTopSellingProducts);
router.get("/new", productController.getLatestProducts);
router.get("/", productController.getAllProducts);
router.get("/search", productController.searchProductsByName); // Thêm route tìm kiếm sản phẩm theo tên
router.get("/:id", productController.getProductById);

router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

router.get("/name/:name", productController.getProductByName);

module.exports = router;
