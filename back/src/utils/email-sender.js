const nodemailer = require('nodemailer')

const config = require('../config')

const sendMail = async options => {
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  })

  const mailOptions = {
    from: 'Kryspin <jp@support.com>',
    to: options.email,
    subject: options.subject,
    text: options.msg,
  }

  await transporter.sendMail(mailOptions)
}

module.exports = sendMail
