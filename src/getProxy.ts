import { chromium, Page } from 'playwright'
import http from 'http'
import https from 'https'
import axios from 'axios'

const httpAgent = new http.Agent({ keepAlive: true })
const httpsAgent = new https.Agent({ keepAlive: true })

const url = 'http://www.xiladaili.com/http/'

const $td = 'table > tbody > tr> td:nth-child(1)'

export default async function (): Promise<string> {
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
async function findServer (page: Page, index: number): Promise<string | null> {
  await page.goto(`${url}${index}`)

  const $tds = await page.$$($td)
  const ips = await Promise.all($tds.map($ip => $ip.textContent()))

  for (let i = 0; i < ips.length; i += 10) {
    const items = ips.slice(i, i + 10)
    console.log('checking server:', items)

    try {
      return await Promise.any(
        items.map(async item => {
          if (!item) {
            throw new Error('没有有效IP')
          }
          const [host, port] = item.split(':')
          await axios.get('https://www.v2ex.com/', {
            httpAgent,
            httpsAgent,
            timeout: 5000,
            proxy: {
              host,
              port: Number(port)
            }
          })
          return item
        })
      )
    } catch (e) {
      console.log('check server error:', e.message)
    }
  }

  if (ips.length) {
    return findServer(page, ++index)
  } else {
    return null
  }
}
