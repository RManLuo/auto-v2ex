import { chromium } from 'playwright'
import path from 'path'
import sendMail from './sendMail'

const url = 'https://www.v2ex.com/'

const v2exA2 = process.env.V2EX_A2 || ''

// 页面元素
const $mission = 'a[href="/mission/daily"]'
const $redeem = '#Main > div.box > div:nth-child(2) > input'

async function main(): Promise<void> {
  const browser = await chromium.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      '--disable-blink-features',
      '--disable-blink-features=AutomationControlled'
    ],
    ignoreDefaultArgs: ['--enable-automation', '--disable-extensions']
  })

  const context = await browser.newContext()

  await context.route('**/*', (route, request) => {
    const headers = request.headers()
    const ua = headers['user-agent']
    headers['user-agent'] = headers['user-agent'].replace('HeadlessChrome', 'Chrome')
    console.log(request.url(), ua, headers['user-agent'])
    route.continue({ headers })
  })

  await context.addInitScript({ path: path.join(__dirname, './preload.js') })

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

    // 防止DDOS页面拦截请求
    await page.waitForSelector($mission, {
      // 等待60s
      timeout: 60000
    })
    // 点击 领取今日的登录奖励 链接
    // 必须经过这个页面过去，否则领取会异常
    await page.click($mission)

    // 防止DDOS页面拦截请求
    await page.waitForSelector($redeem, {
      // 等待60s
      timeout: 60000
    })
    // 点击领取按钮
    await page.click($redeem)
  } catch (err) {
    const buffer = await page.screenshot({
      fullPage: true
    })
    await sendMail({
      subject: 'Github Action(v2ex 领取登录奖励失败)',
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
