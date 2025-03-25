const Product = require("../models/Product");

// Lấy danh sách sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy 5 sản phẩm bán chạy nhất
exports.getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await Product.find().sort({ sold: -1 }).limit(10);
    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Lấy 5 sản phẩm mới nhất
exports.getLatestProducts = async (req, res) => {
  try {
    const latestProducts = await Product.find()
      .sort({ created_at: -1 }) // Sắp xếp theo ngày tạo, mới nhất trước
      .limit(10); // Lấy 5 sản phẩm
    res.json(latestProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Tìm kiếm sản phẩm theo tên
exports.searchProductsByName = async (req, res) => {
  try {
    const { name } = req.query; // Lấy tên sản phẩm từ query string
    if (!name) {
      return res
        .status(400)
        .json({ message: "Tên sản phẩm không được để trống" });
    }

    // Tìm sản phẩm theo tên (sử dụng regex để tìm kiếm gần đúng)
    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Lấy chi tiết sản phẩm

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Sản phẩm đã được xóa" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// lấy sản phẩm theo tên
// Lấy sản phẩm theo tên (không phân biệt chữ hoa chữ thường, tìm theo chuỗi chứa)
exports.getProductByName = async (req, res) => {
  try {
    const searchName = req.params.name;
    console.log(searchName);

    const products = await Product.find({
      name: { $regex: searchName, $options: "i" },
    });
    console.log(products);
    if (!products || products.length === 0)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy sản phẩm theo thương hiệu (brand_id)
exports.getProductsByBrand = async (req, res) => {
  try {
    const brandId = req.params.brandId;
    
    if (!brandId) {
      return res.status(400).json({ message: "Brand ID không được để trống" });
    }
    
    const products = await Product.find({ brand_id: brandId });
    
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm nào thuộc thương hiệu này" });
    }
    
    res.json(products);
  } catch (err) {
    console.error("Error getting products by brand:", err);
    res.status(500).json({ error: err.message });
  }
};
