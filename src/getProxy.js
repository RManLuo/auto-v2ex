const { chromium, devices } = require('playwright')
const got = require('got')
const tunnel = require('tunnel')

const url = 'http://www.xiladaili.com/https/'

const $td = 'table > tbody > tr> td:nth-child(1)'

module.exports = async function () {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  let server
  try {
    server = await findServer(page, 1)
  } finally {
    await browser.close()
  }
  if (!server) {
    throw new Error('没有可用代理Server IP')
  }
  return server
}

// 分页查找IP
async function findServer(page, index) {
  await page.goto(`${url}${index}`)

  const $tds = await page.$$($td)
  const ips = await Promise.all($tds.map($ip => $ip.textContent()))

  for (let i = 0; i < ips.length; i += 10) {
    const items = ips.slice(i, i + 10)
    console.log('checking server:', items)

    try {
      return Promise.any(
        items.map(async server => {
          const [host, port] = server.split(':')
          await got.get('https://www.v2ex.com/', {
            timeout: 5000,
            agent: {
              http: tunnel.httpOverHttp({
                proxy: {
                  host,
                  port
                }
              }),
              https: tunnel.httpsOverHttp({
                proxy: {
                  host,
                  port
                }
              })
            }
          })
          return server
        })
      )
    } catch (e) {
      console.log('check server error:', e.message)
    }
  }

  if (ips.length) {
    return findServer(page, ++index)
  }
}
