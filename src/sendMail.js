const nodemailer = require('nodemailer')

const mailUsername = process.env.MAIL_USERNAME
const mailPassword = process.env.MAIL_PASSWORD
const mailTo = process.env.MAIL_TO

module.exports = async function ({ subject, html, attachments }) {
  const transporter = nodemailer.createTransport({
    // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
    service: '163',
    // 使用了 SSL
    secureConnection: true,
    auth: {
      // 邮箱名
      user: mailUsername,
      // 是你设置的smtp授权码
      pass: mailPassword
    }
  })

  const message = {
    from: `Github Auto<${mailUsername}>`,
    to: mailTo,
    subject,
    html,
    attachments
  }

  await transporter.sendMail(message)
  transporter.close()
}
