const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { transporter } = require("./transporter.js");
const bcrypt = require("bcryptjs");

const crypto = require("crypto");

const loginFaceBook = async (req, res) => {
   const { id, email, name } = req.body;
   try {
      let user = await User.findOne({ face_id: id });
      if (!user) {
         user = await User.create({
            full_name: name,
            face_id: id,
            email,
            password: Math.random().toString(36).slice(-8)
         });
      }
      const accessToken = jwt.sign(
         { id: user._id, email: user.email }, 
         process.env.JWT_SECRET,
         { expiresIn: "1h" }
      );

      res.json({ accessToken, user });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

const forgotPass = async (req, res) => {
   try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(404).json({ message: "Email không tìm thấy trong database" });
      }
      let randomCode = crypto.randomBytes(5).toString("hex");
      await User.updateOne(
         { _id: user._id },
         { expried_code: randomCode }
      );
      const mailOptions = {
         from: "haidang71214@gmail.com",
         to:email, // Email người nhận
         subject: "Reset Password",
         text: `Đây là email đặt lại mật khẩu của bạn: ${randomCode}`,
       };
       transporter.sendMail(mailOptions, (err, info) => {
         if (err) {
           console.error("Lỗi gửi email:", err);
           return res.status(500).json({ message: "Sending mail error" });
         }
         return res.status(200).json({ message: "Sending mail success", data: info });
       });

   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error 500, wrong in" });
   }
};

const changePass = async (req, res) => {
   try {
      const { expried_code, pass_word } = req.body;

      const user = await User.findOne({ expried_code });

      if (!user) {
         return res.status(404).json({ message: "Mã code không hợp lệ hoặc không tồn tại" });
      }
      const hashedPassword = bcrypt.hashSync(pass_word, 10);
      await User.updateOne(
         { _id: user._id },
         { password: hashedPassword, expried_code: null }
      );
      return res.status(200).json({ message: "Mật khẩu đã được cập nhật thành công" });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
   }
};

module.exports = { loginFaceBook, forgotPass, changePass };