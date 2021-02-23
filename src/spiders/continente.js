const { webkit } = require('playwright-webkit');

const scrape = async (productToSearch) => {
  let data = []
  const browser = await webkit.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.continente.pt/stores/continente/pt-pt/public/Pages/searchResults.aspx?k=${productToSearch}#/?page=1&pl=80`);
  await page.setDefaultNavigationTimeout(90000)

  let paginate = true

  do {
    await page.waitForLoadState('domcontentloaded');
    const productEvaluated = await page.evaluate(() => {
      let productExtracted = []
      const parsePrice = (regex, text) => {
        const matchData = regex.exec(text)
        if (!matchData) {
          return 0
        }
        const price = parseFloat(matchData[1].replace(',', '.'))
        return price;
      }

      document.querySelectorAll('div.productItem div.productBoxTop').forEach(product => {
        let productName = product.querySelector('div.containerDescription div.title a').innerText.trim()
        let productURL = product.querySelector('div.containerDescription div.title a').href
        let productBrand = product.querySelector('div.containerDescription div.type').innerText.trim()
        let productPrice = parsePrice(/\D*(?<price>\d*,\d*).*/, product.querySelector('div.containerPrice div.standardPriceContainer-selector div.priceFirstRow').innerText.trim())
        let productPricePerKg = parsePrice(/\D*(?<price>\d*,\d*).*/, product.querySelector('div.containerPrice div.standardPriceContainer-selector div.priceSecondRow').innerText.trim())

        productExtracted.push({
          productName, productURL, productBrand, productPrice, productPricePerKg
        })
      })
      return productExtracted
    })

    data.push(productEvaluated)

    await page.waitForSelector('div.paginationArea input.next', { timeout: 3000 })
      .then(async () => {
        await page.click('div.paginationArea input.next')
      })
      .catch(async (e) => {
        paginate = false
        console.log(`Finish ${productToSearch} product`)
        await browser.close();
      })
  } while (paginate)

  console.log(`Total prodtcs scraped: ${data.flat().length}`)
  const dataJSON = JSON.stringify(data.flat())
}

module.exports = scrape;
