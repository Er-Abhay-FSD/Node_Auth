const nodemailer = require("nodemailer");

const sendMail = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  // connect with the smtp
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jeramy.kertzmann34@ethereal.email',
        pass: 'qD7gJreRu6dYVgsgkD'
    }
});


  let info = await transporter.sendMail({
    from: '"Abhay Singh 👻" <abhaychauhan836481@gmail.com>', // sender address
    to: "abhaysingh0@outlook.com", // list of receivers
    subject: "Hello Abhay", // Subject line
    text: "Hello Abhi Coder", // plain text body
    html: "<b>Hello Abhay Coder</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  res.json(info);
};

module.exports = sendMail;