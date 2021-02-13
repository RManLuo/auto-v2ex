const { chromium } = require('playwright')
const sendMail = require('./sendMail')

const url = 'https://www.v2ex.com/'

const v2exA2 = process.env.V2EX_A2
const mailUsername = process.env.MAIL_USERNAME
const mailPassword = process.env.MAIL_PASSWORD
const mailTo = process.env.MAIL_TO

console.log(v2exA2)
console.log(mailUsername, mailPassword, mailTo)

async function main() {
  const browser = await chromium.launch()

  const context = await browser.newContext()

  context.addCookies([
    {
      name: 'A2',
      value: v2exA2,
      domain: '.v2ex.com',
      path: '/',
      httpOnly: true
    }
  ])

  const page = await context.newPage()

  try {
    await page.goto(url)
    // 点击 领取今日的登录奖励 链接
    // 必须经过这个页面过去，否则领取会异常
    await page.click('a[href="/mission/daily"]')

    // 点击领取按钮
    await page.click('#Main > div.box > div:nth-child(2) > input')
  } catch (err) {
    const buffer = await page.screenshot({
      fullPage: true
    })
    await sendMail({
      subject: 'v2ex 领取登录奖励失败',
      html: `
<div>
  <h1>v2ex 领取登录奖励失败</h1>
  <div>
    <p>错误信息如下：</p>
    <p>
      <pre><code>${err.stack || err.message}<code></pre>
    </p>
  </div>
  <div>
    <p>页面截图如下：</p>
    <p><img src="cid:screenshot" alt="截图"/></p>
  </div>
</div>`,
      attachments: [
        {
          cid: 'screenshot',
          filename: 'screenshot.png',
          content: buffer
        }
      ]
    })

    throw err
  }

  // 关闭页面
  await browser.close()
}

main()
  .then(() => {
    console.log('任务执行完成')
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
