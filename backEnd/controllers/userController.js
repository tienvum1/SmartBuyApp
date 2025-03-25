const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    console.log(req.body);

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ full_name, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log(token, user);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllAddresses = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Tìm người dùng theo userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Lấy tất cả địa chỉ của người dùng
    const addresses = user.address;

    if (!addresses || addresses.length === 0) {
      return res
        .status(404)
        .json({ message: "No addresses found for this user" });
    }

    // Trả về toàn bộ danh sách địa chỉ
    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { address, phone } = req.body;
    const userId = req.params.userId;

    // Tìm người dùng theo userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Thêm điểm giao hàng mới với ID được tạo bởi MongoDB
    user.address.push({
      _id: new mongoose.Types.ObjectId(),
      address,
      phone,
      telephone: phone,
    });

    // Lưu người dùng
    await user.save();

    res.status(201).json({ message: "Address added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Đảm bảo mỗi địa chỉ đều có _id hợp lệ
    if (user.address && user.address.length > 0) {
      user.address.forEach((addr, index) => {
        if (!addr._id) {
          user.address[index]._id = new mongoose.Types.ObjectId();
        }
      });
      await user.save(); // Lưu lại nếu có thay đổi
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    console.log(`Attempting to remove address with ID: ${addressId} for user: ${userId}`);

    // Tìm người dùng theo userId
    const user = await User.findById(userId);

    if (!user) {
      console.log(`User with ID ${userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    // Log chi tiết về địa chỉ
    console.log("User found, number of addresses:", user.address.length);
    user.address.forEach((addr, index) => {
      console.log(`Address ${index + 1}:`);
      console.log(` - _id: ${addr._id} (${typeof addr._id})`);
      console.log(` - _id.toString(): ${addr._id ? addr._id.toString() : 'undefined'} (${typeof (addr._id ? addr._id.toString() : undefined)})`);
      console.log(` - address: ${addr.address}`);
      console.log(` - phone: ${addr.phone}, telephone: ${addr.telephone}`);
      // Check if this ID matches the one we're looking for
      const addrIdStr = addr._id ? addr._id.toString() : '';
      console.log(` - matches requested ID: ${addrIdStr === addressId}`);
    });

    // Kiểm tra nếu địa chỉ tồn tại - tìm kiếm linh hoạt hơn
    let addressIndex = -1;
    
    // Cố gắng tìm theo nhiều cách khác nhau
    
    // 1. Tìm bằng _id.toString() - cách chính xác nhất
    addressIndex = user.address.findIndex(
      (addr) => addr._id && addr._id.toString() === addressId
    );
    
    // 2. Nếu không tìm thấy, thử tìm bằng ObjectId trực tiếp
    if (addressIndex === -1) {
      try {
        const objectId = new mongoose.Types.ObjectId(addressId);
        addressIndex = user.address.findIndex(
          (addr) => addr._id && addr._id.equals(objectId)
        );
      } catch (err) {
        console.log("Error converting to ObjectId:", err.message);
      }
    }
    
    // 3. Nếu vẫn không tìm thấy, thử tìm theo cả nội dung địa chỉ
    if (addressIndex === -1) {
      // Lấy tất cả các ID địa chỉ để ghi log
      const availableIds = user.address.map(addr => addr._id?.toString());
      console.log("Available IDs:", availableIds);
      console.log("Looking for ID similar to:", addressId);
      
      // Tìm ID gần giống
      const similarIds = availableIds.filter(id => id && id.includes(addressId.substring(0, 8)));
      if (similarIds.length > 0) {
        console.log("Found similar IDs:", similarIds);
        // Tìm địa chỉ với ID gần giống nhất
        addressIndex = user.address.findIndex(
          (addr) => addr._id && similarIds.includes(addr._id.toString())
        );
      }
    }

    console.log(`Address index found: ${addressIndex}`);

    if (addressIndex === -1) {
      console.log(`Address with ID ${addressId} not found in user's addresses`);
      console.log(`Address IDs available: ${user.address.map(addr => addr._id ? addr._id.toString() : 'undefined')}`);
      return res.status(404).json({ message: "Address not found" });
    }

    // Lấy thông tin địa chỉ trước khi xóa để ghi log
    const addressToRemove = user.address[addressIndex];
    console.log(`Address to remove: ${JSON.stringify(addressToRemove)}`);

    // Xóa địa chỉ khỏi mảng address
    user.address.splice(addressIndex, 1);
    console.log(`Address removed from array. New addresses length: ${user.address.length}`);

    // Lưu người dùng
    await user.save();
    console.log("User saved successfully after removing address");

    res.status(200).json({ 
      message: "Address removed successfully",
      removedAddress: addressToRemove
    });
  } catch (error) {
    console.error("Error removing address:", error);
    res.status(500).json({ message: error.message });
  }
};
