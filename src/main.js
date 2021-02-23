const scrape = require('./spiders/continente')

var productsToSearch = process.argv.slice(2);
const main = async (productsToSearch) => {
  await Promise.all(
    productsToSearch.map(async (productToSearch) => {
      console.log(`Start looking for ${productToSearch}`)
      await scrape(productToSearch)
    })
  )
}

main(productsToSearch);
