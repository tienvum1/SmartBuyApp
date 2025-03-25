const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/top-selling", productController.getTopSellingProducts);
router.get("/new", productController.getLatestProducts);
router.get("/", productController.getAllProducts);
router.get("/search", productController.searchProductsByName); // Thêm route tìm kiếm sản phẩm theo tên
<<<<<<< HEAD
router.get("/name/:name", productController.getProductByName);
router.get("/brand/:brandId", productController.getProductsByBrand); // Thêm route lấy sản phẩm theo thương hiệu
=======
>>>>>>> 0aa2407 (fix db)
router.get("/:id", productController.getProductById);

router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

<<<<<<< HEAD
=======
router.get("/name/:name", productController.getProductByName);

>>>>>>> 0aa2407 (fix db)
module.exports = router;
