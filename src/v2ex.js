const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({
    headless: false,
    devtools: true
  })
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
  console.log(process.env.A2)
  const page = await context.newPage()
  await page.goto('https://v2ex.com/')
  await browser.close()
})()
