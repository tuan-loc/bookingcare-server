require("dotenv").config();
const nodemailer = require("nodemailer");

const sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Tuấn Lộc 👻" <tuanlocvocong@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    html: getBodyHTMLEmail(dataSend), // html body
  });
};

const getBodyHTMLEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xin chào ${dataSend.patientName}!</h3>
    <h4>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên trang Bookingcare.vn</h4>
    <p>Thông tin đặt lịch khám bệnh:</p>
    <div><b>Thời gian: ${dataSend.time}</b></div>
    <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
    <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>
    <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
    <div>Xin chân thành cảm ơn</div>
    `;
  }

  if (dataSend.language === "en") {
    result = `
    <h3>Dear ${dataSend.patientName}!</h3>
    <h4>You received this email because you booked an online medical appointment on Bookingcare.vn</h4>
    <p>Information to book a medical appointment:</p>
    <div><b>Time: ${dataSend.time}</b></div>
    <div><b>Doctor'name: ${dataSend.doctorName}</b></div>
    <p>If the above information is correct, please click on the link below to confirm and complete the medical appointment booking procedure.</p>
    <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
    <div>Sincerely thanks!</div>
    `;
  }

  return result;
};

module.exports = { sendSimpleEmail };
