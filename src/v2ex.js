const { chromium } = require('playwright')

const url = 'https://v2ex.com'

async function main() {
  const browser = await chromium.launch()

  const context = await browser.newContext()

  context.addCookies([
    {
      name: 'A2',
      value: process.env.V2EX_A2,
      domain: '.v2ex.com',
      path: '/',
      httpOnly: true
    }
  ])

  const page = await context.newPage()
  await page.goto(url)

  // 点击 领取今日的登录奖励 链接
  // 必须经过这个页面过去，否则领取会异常
  await page.click('a[href="/mission/daily"]')

  // 点击领取按钮
  await page.click('#Main > div.box > div:nth-child(2) > input')

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
