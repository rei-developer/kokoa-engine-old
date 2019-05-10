const moment = require('moment')
//const filter = require('../../../../../utils/filter')
const sleep = require('./utils/sleep')
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const chromeOptions = new chrome.Options()
chromeOptions.addArguments(`--user-agent="Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 640 XL LTE) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.10166"`)
//chromeOptions.addArguments(`--headless`)
const By = webdriver.By
const driver = new webdriver
  .Builder()
  .forBrowser('chrome')
  .setChromeOptions(chromeOptions)
  .build()

const TEMP_NEWEST_NUMBER = 699774

class Service {
  constructor() {
    this.host = 'http://www.ilbe.com'
    this.page = 1
    this.nextPage = 2
    this.init()
  }

  async init() {
    await driver.get(`${this.host}/index.php?mid=ilbe&page=${this.page}`)
    await sleep(1200)
    this.getData()
  }

  async getData(click = false) {
    console.log('데이터 로드중...')
    if (click) {
      try {
        console.log('한 페이지 끝 (임시)')
        return await driver.quit()
      } catch (e) {
        console.log(e)
        return await driver.quit()
      }
    }
    const node = await driver.findElement(By.css('.content_margin tbody tr'))
    console.log('데이터 로드 성공.')
    this.getItem(node)
  }

  async getItem(node, index = 0) {
    if (index >= node.length) return this.getData(true)
    const item = node[index]
    try {
      const id = await item.findElement(By.css('td.num')).getText()
      console.log(id)
    } finally {
      this.getItem(node, index + 1)
    }
  }
}

new Service()