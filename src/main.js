const scrape = require('./spiders/continente')

const productsToSearch = [
  'arroz',
  'feijao'
]

const main = async (productsToSearch) => {
  await Promise.all(
    productsToSearch.map(async (productToSearch) => {
      console.log(`Start looking for ${productToSearch}`)
      await scrape(productToSearch)
    })
  )
}

main(productsToSearch);
