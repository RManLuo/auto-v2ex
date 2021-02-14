const { chromium, devices } = require('playwright')
const sendMail = require('./sendMail')
const got = require('got')

const url = 'https://www.v2ex.com/'

const v2exA2 = process.env.V2EX_A2
const mailUsername = process.env.MAIL_USERNAME
const mailPassword = process.env.MAIL_PASSWORD
const mailTo = process.env.MAIL_TO

// 页面元素
const $mission = 'a[href="/mission/daily"]'
const $redeem = '#Main > div.box > div:nth-child(2) > input'

async function main() {
  const browser = await chromium.launch()

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.146 Safari/537.36',
    deviceScaleFactor: 2
  })

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
    await page.goto(url, {
      waitUntil: 'networkidle'
    })

    // 防止DDOS页面拦截请求
    await page.waitForSelector($mission, {
      // 等待60s
      timeout: 300000
    })
    // 点击 领取今日的登录奖励 链接
    // 必须经过这个页面过去，否则领取会异常
    await page.click($mission)

    // 等待页面跳转导航
    await page.waitForNavigation()
    // 防止DDOS页面拦截请求
    await page.waitForSelector($redeem, {
      // 等待60s
      timeout: 60000
    })
    // 点击领取按钮
    await page.click($redeem)
    // 等待页面跳转导航
    // 确保领取成功
    await page.waitForNavigation()
  } catch (err) {
    const buffer = await page.screenshot({
      fullPage: true
    })
    const { body } = await got('https://www.v2ex.com')
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
        },
        {
          filename: 'index.html',
          content: body
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
