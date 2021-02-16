import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'

const mailUsername = process.env.MAIL_USERNAME
const mailPassword = process.env.MAIL_PASSWORD
const mailTo = process.env.MAIL_TO

export interface SendMailOpts {
  subject: string
  html: string
  attachments: Mail.Attachment[]
}

export default async function ({ subject, html, attachments }: SendMailOpts): Promise<void> {
  const transporter = nodemailer.createTransport({
    // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
    service: '163',
    auth: {
      // 邮箱名
      user: mailUsername,
      // 是你设置的smtp授权码
      pass: mailPassword
    }
  })

  const message = {
    from: `Github Auto仓库通知 <${mailUsername}>`,
    to: mailTo,
    subject,
    html,
    attachments
  }

  await transporter.sendMail(message)
  transporter.close()
}
