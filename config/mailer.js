const nodemailer = require("nodemailer");
const USUARIO_MAIL = process.env.USUARIO_MAIL
const PASS_MAIL = process.env.PASS_MAIL

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: USUARIO_MAIL,
    pass: PASS_MAIL,
  },
});

transporter.verify().then(()=>{
    console.log('Ready for send emails')
})

module.exports= {transporter}