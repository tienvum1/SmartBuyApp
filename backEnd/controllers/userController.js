const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

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
