const { chromium } = require('playwright')

const url = 'https://v2ex.com/mission/daily'

async function main() {
  const browser = await chromium.launch()

  const context = await browser.newContext()

  context.addCookies([
    {
      name: 'A2',
      value: process.env.A2,
      domain: '.v2ex.com',
      path: '/',
      httpOnly: true
    }
  ])

  const page = await context.newPage()
  await page.goto(url)
  // 检测 Cookie 是否有效
  if (url !== page.url()) {
    throw new Error('页面 Cookie 过期')
  }
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
