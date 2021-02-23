const scrape = require('./spiders/continente')

const producsToSearch = [
  'arroz',
  'feijao'
]

const main = async () => {
  await Promise.all(
    productsToSearch.map(async (productToSearch) => {
      console.log(`Start looking for ${productToSearch}`)
      await scrape(producToSearch)
    })
  )
}

main();
