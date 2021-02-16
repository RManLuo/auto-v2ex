;(function () {
  const pluginData = [
    { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
    { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
    { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' }
  ]

  const pluginArray = pluginData.map(p => {
    class FakePlugin {
      constructor() {
        return p
      }
    }
    const plugin = new FakePlugin()
    Object.setPrototypeOf(plugin, Plugin.prototype)
    return plugin
  })

  Object.setPrototypeOf(pluginArray, PluginArray.prototype)
  Object.defineProperty(navigator, 'plugins', {
    get: () => pluginArray
  })

  const userAgent = navigator.userAgent
  Object.defineProperty(navigator, 'userAgent', {
    get: () => {
      userAgent.replace('HeadlessChrome', 'Chrome')
    }
  })

  Object.defineProperty(navigator, 'webdriver', {
    get: () => undefined
  })
})()
