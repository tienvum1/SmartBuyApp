const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "haidang71214@gmail.com",
    pass: "ojog ltyu idfa uyaw",
  },
});

module.exports = { transporter };

